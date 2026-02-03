/**
 * WhatsApp-Claude Bridge
 *
 * Connects WhatsApp to Claude Code CLI, allowing you to send tasks
 * via WhatsApp messages that get executed by Claude Code.
 *
 * Usage: Send "/claude <task>" to yourself on WhatsApp
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { spawn } = require('child_process');
require('dotenv').config();

// Configuration
const WORKSPACE = process.env.WORKSPACE || process.cwd();
const COMMAND_PREFIX = '/claude ';
const MAX_MESSAGE_LENGTH = 4096;
const EXECUTION_TIMEOUT = 1200000; // 20 minutes

// Track conversation state - first message starts new, subsequent messages continue
let hasActiveConversation = false;

// Initialize WhatsApp client with persistent auth
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// QR Code Authentication
client.on('qr', (qr) => {
  console.log('\n📱 Scan this QR code with WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\nOpen WhatsApp > Settings > Linked Devices > Link a Device\n');
});

client.on('ready', () => {
  console.log('✅ WhatsApp bot is ready!');
  console.log(`📁 Workspace: ${WORKSPACE}`);
  console.log('📝 Send "/claude <task>" to yourself to execute commands\n');
});

client.on('authenticated', () => {
  console.log('🔐 Authentication successful');
});

client.on('auth_failure', (message) => {
  console.error('❌ Authentication failed:', message);
});

client.on('disconnected', (reason) => {
  console.log('📴 Client disconnected:', reason);
});

// Message Handling (Self-Messages Only)
client.on('message_create', async (message) => {
  // Debug: Log ALL messages to see what's coming through
  console.log(`[DEBUG] Message received - from: ${message.from}, fromMe: ${message.fromMe}, body: ${message.body.substring(0, 50)}`);

  // Only process messages from self (sent by you)
  if (!message.fromMe) {
    console.log('[DEBUG] Skipping - not from self');
    return;
  }

  // Check for /claude command
  if (!message.body.startsWith(COMMAND_PREFIX)) {
    console.log('[DEBUG] Skipping - no /claude prefix');
    return;
  }

  const task = message.body.slice(COMMAND_PREFIX.length).trim();
  if (!task) {
    await message.reply('⚠️ Please provide a task. Usage: /claude <task>');
    return;
  }

  // Check for explicit "new" command to start fresh conversation
  const startNew = task.startsWith('--new ') || task.startsWith('-n ');
  const actualTask = startNew ? task.replace(/^(--new|-n)\s+/, '') : task;

  // Auto-continue after first message (unless --new flag used)
  const continueConversation = hasActiveConversation && !startNew;

  console.log(`\n📥 Received task: ${actualTask}`);
  console.log(`📎 Continue conversation: ${continueConversation}`);
  console.log(`⏳ Executing...`);

  // Send acknowledgment
  await message.reply('🤖 Processing your request...');

  try {
    const startTime = Date.now();
    const response = await executeClaudeTask(actualTask, continueConversation);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    // Mark that we now have an active conversation for future --continue
    hasActiveConversation = true;

    console.log(`✅ Task completed in ${duration}s`);

    // Send response with completion time
    const footer = `\n\n⏱️ Completed in ${duration}s`;
    await sendChunkedResponse(message, response + footer);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    await message.reply(`❌ Error: ${error.message}`);
  }
});

/**
 * Execute a task using Claude Code CLI
 * @param {string} task - The task to execute
 * @param {boolean} continueConversation - Whether to continue the previous conversation
 */
function executeClaudeTask(task, continueConversation = false) {
  return new Promise((resolve, reject) => {
    let output = '';
    let errorOutput = '';

    console.log('[DEBUG] Spawning claude process...');
    console.log(`[DEBUG] Task: ${task}`);
    console.log(`[DEBUG] Continue: ${continueConversation}`);
    console.log(`[DEBUG] CWD: ${WORKSPACE}`);

    // Spawn Claude Code process
    // Wrap task in quotes to preserve spaces when shell parses the command
    const quotedTask = `"${task.replace(/"/g, '\\"')}"`;
    console.log(`[DEBUG] Quoted task: ${quotedTask}`);

    // Build arguments array
    const args = [
      '-p', quotedTask,
      '--dangerously-skip-permissions',
      '--print'
    ];

    // Add -c flag to continue previous conversation
    if (continueConversation) {
      args.unshift('-c');
      console.log('[DEBUG] Adding -c flag to continue conversation');
    }

    const claude = spawn('claude', args, {
      cwd: WORKSPACE,
      shell: true,
      env: { ...process.env }
    });

    console.log(`[DEBUG] Process spawned with PID: ${claude.pid}`);

    // Close stdin to prevent waiting for input
    claude.stdin.end();

    // Set timeout
    const timeout = setTimeout(() => {
      claude.kill('SIGTERM');
      reject(new Error('Task timed out after 20 minutes'));
    }, EXECUTION_TIMEOUT);

    claude.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log(`[DEBUG] stdout (${chunk.length} bytes)`);
      output += chunk;
      process.stdout.write(chunk);
    });

    claude.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    claude.on('close', (code) => {
      console.log(`[DEBUG] Process closed with code: ${code}`);
      clearTimeout(timeout);

      if (code === 0) {
        resolve(output.trim() || 'Task completed successfully.');
      } else {
        reject(new Error(errorOutput.trim() || `Process exited with code ${code}`));
      }
    });

    claude.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

/**
 * Send response in chunks (WhatsApp has 4096 char limit)
 */
async function sendChunkedResponse(message, response) {
  const chunks = [];
  let remaining = response;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_MESSAGE_LENGTH) {
      chunks.push(remaining);
      break;
    }

    // Find a good break point (prefer newline, then space)
    let breakPoint = remaining.lastIndexOf('\n', MAX_MESSAGE_LENGTH);
    if (breakPoint === -1 || breakPoint < MAX_MESSAGE_LENGTH / 2) {
      breakPoint = remaining.lastIndexOf(' ', MAX_MESSAGE_LENGTH);
    }
    if (breakPoint === -1) {
      breakPoint = MAX_MESSAGE_LENGTH;
    }

    chunks.push(remaining.slice(0, breakPoint));
    remaining = remaining.slice(breakPoint).trim();
  }

  // Add part numbers if multiple chunks
  if (chunks.length > 1) {
    for (let i = 0; i < chunks.length; i++) {
      chunks[i] = `📄 Part ${i + 1}/${chunks.length}\n\n${chunks[i]}`;
    }
  }

  // Send each chunk with retry logic
  for (const chunk of chunks) {
    await sendWithRetry(message, chunk);
    // Small delay between chunks to avoid rate limiting
    if (chunks.length > 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

/**
 * Send message with retry logic
 */
async function sendWithRetry(message, text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await message.reply(text);
      return;
    } catch (error) {
      console.warn(`Retry ${i + 1}/${retries} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down...');
  await client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down...');
  await client.destroy();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the client
console.log('🚀 Starting WhatsApp-Claude Bridge...\n');
client.initialize();
