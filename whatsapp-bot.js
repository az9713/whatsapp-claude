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
const EXECUTION_TIMEOUT = 600000; // 10 minutes

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
  // Only process messages from self
  // Linked devices use @lid suffix, primary device uses @c.us
  const isFromSelf = message.fromMe ||
    message.from.endsWith('@lid') ||
    message.from.endsWith('@c.us');

  if (!isFromSelf) return;

  // Check for /claude command
  if (!message.body.startsWith(COMMAND_PREFIX)) return;

  const task = message.body.slice(COMMAND_PREFIX.length).trim();
  if (!task) {
    await message.reply('⚠️ Please provide a task. Usage: /claude <task>');
    return;
  }

  console.log(`\n📥 Received task: ${task}`);
  console.log(`⏳ Executing...`);

  // Send acknowledgment
  await message.reply('🤖 Processing your request...');

  try {
    const startTime = Date.now();
    const response = await executeClaudeTask(task);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

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
 */
function executeClaudeTask(task) {
  return new Promise((resolve, reject) => {
    let output = '';
    let errorOutput = '';

    // Spawn Claude Code process
    const claude = spawn('claude', [
      '-p', task,
      '--dangerously-skip-permissions',
      '--print'
    ], {
      cwd: WORKSPACE,
      shell: true,
      env: { ...process.env }
    });

    // Set timeout
    const timeout = setTimeout(() => {
      claude.kill('SIGTERM');
      reject(new Error('Task timed out after 10 minutes'));
    }, EXECUTION_TIMEOUT);

    claude.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      // Stream progress to console
      process.stdout.write(chunk);
    });

    claude.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    claude.on('close', (code) => {
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
