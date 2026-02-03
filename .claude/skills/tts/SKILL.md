---
name: tts
description: Generate voice-over audio using OpenAI TTS. Use when creating narration or voice for videos.
allowed-tools:
  - Bash
  - Write
---

# TTS Voice Generation

Generate high-quality voice-over audio using OpenAI's Text-to-Speech API.

## Available Voices

| Voice | Description | Best For |
|-------|-------------|----------|
| alloy | Neutral, balanced | General purpose |
| echo | Warm, conversational | Podcasts, casual |
| fable | Expressive, animated | Storytelling |
| onyx | Deep, authoritative | Professional, news |
| nova | Clear, friendly | Tutorials, explainers |
| shimmer | Soft, gentle | Meditation, calm content |

## Usage

### Command Line

```bash
node scripts/tts.js "Your text here" output/voiceover.mp3 --voice nova
```

### With Different Voices

```bash
# Professional narrator
node scripts/tts.js "Welcome to our presentation" output/intro.mp3 --voice onyx

# Friendly tutorial
node scripts/tts.js "Let me show you how this works" output/tutorial.mp3 --voice nova

# Storytelling
node scripts/tts.js "Once upon a time..." output/story.mp3 --voice fable
```

### From Script File

```bash
# Read script from file and generate audio
node scripts/tts.js "$(cat output/scripts/my-script.txt)" output/narration.mp3 --voice nova
```

## Model Options

| Model | Quality | Speed | Cost |
|-------|---------|-------|------|
| tts-1 | Good | Fast | Lower |
| tts-1-hd | Best | Slower | Higher |

Default: `tts-1-hd` (high quality)

## Tips

### Pacing

- Add periods for natural pauses
- Use commas for brief pauses
- Add "..." for longer pauses

### Pronunciation

- Spell out acronyms: "API" → "A P I"
- Use phonetic spelling for unusual words
- Numbers are read naturally: "1000" → "one thousand"

### Chunking Long Text

For scripts over 4096 characters:
1. Split into logical chunks (paragraphs)
2. Generate audio for each chunk
3. Concatenate with ffmpeg

```bash
# Concatenate audio files
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output/full-narration.mp3

# filelist.txt format:
# file 'chunk1.mp3'
# file 'chunk2.mp3'
```

## Output

- Format: MP3
- Sample rate: 24000 Hz
- Channels: Mono
- Bitrate: 128 kbps (approximate)

## Cost Estimate

~$0.015 per 1000 characters for tts-1-hd

| Script Length | Approx Cost |
|---------------|-------------|
| 500 chars | $0.0075 |
| 1000 chars | $0.015 |
| 5000 chars | $0.075 |
