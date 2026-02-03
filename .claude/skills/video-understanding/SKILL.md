---
name: video-understanding
description: Download videos and transcribe their content. Use when asked to understand, summarize, or analyze a video.
allowed-tools:
  - Bash
  - Read
  - Write
---

# Video Understanding Skill

Download videos and transcribe their content for analysis.

## Prerequisites

- yt-dlp installed (`pip install yt-dlp` or `brew install yt-dlp`)
- ffmpeg installed (`brew install ffmpeg` or `apt install ffmpeg`)
- Whisper installed (`pip install openai-whisper`)

## Pipeline

### 1. Download Video

```bash
# Download video with yt-dlp
yt-dlp -o "assets/downloads/%(title)s.%(ext)s" "<VIDEO_URL>"

# For best quality
yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" \
  -o "assets/downloads/%(title)s.%(ext)s" "<VIDEO_URL>"

# For audio only (faster)
yt-dlp -x --audio-format mp3 \
  -o "assets/downloads/%(title)s.%(ext)s" "<VIDEO_URL>"
```

### 2. Extract Audio (if downloaded video)

```bash
ffmpeg -i "assets/downloads/video.mp4" \
  -vn -acodec mp3 -ab 128k \
  "assets/downloads/audio.mp3"
```

### 3. Transcribe with Whisper

```bash
# Basic transcription
whisper "assets/downloads/audio.mp3" \
  --model base \
  --output_format txt \
  --output_dir output/

# Higher quality (slower)
whisper "assets/downloads/audio.mp3" \
  --model medium \
  --output_format all \
  --output_dir output/

# With timestamps
whisper "assets/downloads/audio.mp3" \
  --model base \
  --output_format srt \
  --output_dir output/
```

### 4. Read and Analyze Transcript

```
Read the generated transcript file from output/
Summarize key points
Extract quotes and timestamps
Identify speakers if multiple
```

## Model Options

| Model  | Size  | Speed  | Quality |
|--------|-------|--------|---------|
| tiny   | 39M   | Fastest| Lower   |
| base   | 74M   | Fast   | Good    |
| small  | 244M  | Medium | Better  |
| medium | 769M  | Slow   | High    |
| large  | 1550M | Slowest| Highest |

## Output Formats

- `txt` - Plain text transcript
- `srt` - SubRip subtitles with timestamps
- `vtt` - WebVTT subtitles
- `json` - Detailed JSON with word-level timing
- `all` - All formats

## Tips

- Use `base` model for speed, `medium` for accuracy
- Add `--language en` to force English detection
- Use `--task translate` to translate to English
- Check `assets/downloads/` for downloaded files
- Store transcripts in `output/transcripts/`
