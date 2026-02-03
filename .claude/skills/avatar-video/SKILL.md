---
name: avatar-video
description: Generate lip-synced avatar video from text using OmniHuman v1.5. Use when creating talking-head or avatar videos.
allowed-tools:
  - Bash
  - Read
  - Write
---

# Avatar Video Generation

Generate lip-synced avatar videos from text using the OmniHuman v1.5 pipeline.

## Prerequisites

- Python 3.10+
- OpenAI API key (for TTS)
- fal.ai API key (for OmniHuman)
- Avatar image (portrait, clear face)

## Pipeline Overview

```
Text → TTS → Audio → CDN Upload → OmniHuman → Video → Post-Processing → Final Video
```

## Step-by-Step Commands

### 1. Generate Voice-Over

```bash
python video-pipeline/voice_generator.py "Your script text here" output/voice.mp3
```

Options:
- `--voice nova` (default: nova)
- Available: alloy, echo, fable, onyx, nova, shimmer

### 2. Upload to CDN

```bash
python video-pipeline/storage_manager.py output/voice.mp3 assets/avatar.png
```

Returns:
- Audio URL
- Image URL

### 3. Generate Avatar Video

```bash
python video-pipeline/video_generator.py <audio_url> <image_url>
```

Returns:
- Job ID
- Video URL (when complete)

OmniHuman v1.5 settings:
- Resolution: 720p
- FPS: 25
- Face enhancement: enabled

### 4. Download Generated Video

```bash
python video-pipeline/video_retriever.py <video_url> output/avatar.mp4
```

### 5. Post-Processing (Optional)

Add background music:

```bash
python video-pipeline/post_processor.py output/avatar.mp4 assets/music/bg.mp3 output/final.mp4
```

Options:
- `--music-volume 0.15` (15% volume, default)
- `--trim-start 0` (trim seconds from start)
- `--trim-end 0` (trim seconds from end)

## Full Pipeline Example

```bash
# Step 1: Generate voice
python video-pipeline/voice_generator.py "Hello! Welcome to my channel. Today I'm going to show you something amazing." output/voice.mp3 --voice nova

# Step 2: Upload to CDN (capture URLs)
URLS=$(python video-pipeline/storage_manager.py output/voice.mp3 assets/avatar.png)
AUDIO_URL=$(echo "$URLS" | grep audio | cut -d' ' -f2)
IMAGE_URL=$(echo "$URLS" | grep image | cut -d' ' -f2)

# Step 3: Generate video
VIDEO_URL=$(python video-pipeline/video_generator.py "$AUDIO_URL" "$IMAGE_URL")

# Step 4: Download
python video-pipeline/video_retriever.py "$VIDEO_URL" output/avatar.mp4

# Step 5: Add music
python video-pipeline/post_processor.py output/avatar.mp4 assets/music/background.mp3 output/final.mp4
```

## Avatar Image Guidelines

For best results:
- Portrait orientation preferred
- Clear, well-lit face
- Neutral expression
- Front-facing
- Minimum 512x512 pixels
- Supported formats: PNG, JPG

## Output Quality

| Setting | Value |
|---------|-------|
| Resolution | 720p (1280x720) |
| FPS | 25 |
| Codec | H.264 |
| Audio | AAC 128kbps |

## Cost Estimate

| Component | Cost |
|-----------|------|
| OpenAI TTS (1000 chars) | ~$0.015 |
| fal.ai OmniHuman (per video) | ~$0.10-0.50 |

## Tips

- Keep scripts under 2 minutes for best quality
- Use clear, well-paced speech in script
- Test with short clips first
- Store avatar images in assets/ for reuse
- Check fal.ai queue status for busy times
