#!/usr/bin/env node

/**
 * OpenAI TTS Wrapper
 *
 * Usage: node scripts/tts.js "Your text here" output/voiceover.mp3 --voice nova
 *
 * Available voices: alloy, echo, fable, onyx, nova, shimmer
 * Model: tts-1-hd (high quality)
 */

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node scripts/tts.js "text" output.mp3 [--voice voice_name]');
  console.error('');
  console.error('Options:');
  console.error('  --voice    Voice to use (default: nova)');
  console.error('             Available: alloy, echo, fable, onyx, nova, shimmer');
  console.error('  --model    Model to use (default: tts-1-hd)');
  console.error('             Available: tts-1, tts-1-hd');
  console.error('');
  console.error('Examples:');
  console.error('  node scripts/tts.js "Hello world" output/hello.mp3');
  console.error('  node scripts/tts.js "Professional intro" output/intro.mp3 --voice onyx');
  process.exit(1);
}

const text = args[0];
const outputPath = args[1];

// Parse options
let voice = 'nova';
let model = 'tts-1-hd';

for (let i = 2; i < args.length; i++) {
  if (args[i] === '--voice' && args[i + 1]) {
    voice = args[i + 1];
    i++;
  } else if (args[i] === '--model' && args[i + 1]) {
    model = args[i + 1];
    i++;
  }
}

// Validate voice
const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
if (!validVoices.includes(voice)) {
  console.error(`Invalid voice: ${voice}`);
  console.error(`Available voices: ${validVoices.join(', ')}`);
  process.exit(1);
}

// Validate model
const validModels = ['tts-1', 'tts-1-hd'];
if (!validModels.includes(model)) {
  console.error(`Invalid model: ${model}`);
  console.error(`Available models: ${validModels.join(', ')}`);
  process.exit(1);
}

async function generateTTS() {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI();

    console.log(`Generating TTS...`);
    console.log(`  Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    console.log(`  Voice: ${voice}`);
    console.log(`  Model: ${model}`);
    console.log(`  Output: ${outputPath}`);

    // Generate speech
    const response = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: text
    });

    // Convert response to buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(outputPath, buffer);

    console.log(`\n✅ Audio generated successfully!`);
    console.log(`   File: ${outputPath}`);
    console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB`);
    console.log(`   Characters: ${text.length}`);

  } catch (error) {
    if (error.code === 'ENOENT' || error.message?.includes('OPENAI_API_KEY')) {
      console.error('Error: OPENAI_API_KEY environment variable not set');
      console.error('Set it with: export OPENAI_API_KEY=your_key_here');
    } else {
      console.error('Error generating TTS:', error.message);
    }
    process.exit(1);
  }
}

generateTTS();
