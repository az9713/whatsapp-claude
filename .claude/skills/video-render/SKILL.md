---
name: video-render
description: Render videos using Remotion compositions. Use when creating or generating videos.
allowed-tools:
  - Bash
  - Read
  - Write
---

# Video Rendering with Remotion

Render videos using the Remotion project's compositions.

## Available Compositions

### From claude-code-remotion (Copied)

| Composition | Duration | Description |
|-------------|----------|-------------|
| ClaudeCodeIntro | 7s (210 frames) | Branded opener with spring animations |
| DataDashboard | 12s (360 frames) | Animated charts and counting numbers |
| KineticTypography | 14s (420 frames) | Quote animation with text effects |
| ProductShowcase | 15s (450 frames) | Feature list with checkmarks |
| CountdownTimer | 7s (210 frames) | 3-2-1-GO countdown |
| CodeWalkthrough | 16s (480 frames) | Syntax-highlighted code display |

### New Unique Compositions

| Composition | Description |
|-------------|-------------|
| CodeExplainer | Code tutorial with line-by-line highlighting |
| GitHubRecap | GitHub activity recap with animated graphs |
| ThreadToVideo | Tweet thread to video conversion |
| Audiogram | Audio visualization with waveform |
| VerticalShort | 9:16 short-form (TikTok/Reels/Shorts) |
| NewsVideo | AI news format with B-roll |

## Render Commands

### Basic Render

```bash
cd remotion-videos && npx remotion render <CompositionId> ../output/video.mp4
```

### With Input Props

```bash
cd remotion-videos && npx remotion render <CompositionId> ../output/video.mp4 \
  --props='{"title": "Hello World", "subtitle": "Demo"}'
```

### Specific Frame Range

```bash
cd remotion-videos && npx remotion render <CompositionId> ../output/video.mp4 \
  --frames=0-100
```

### Different Resolution

```bash
# Vertical (9:16) for shorts
cd remotion-videos && npx remotion render VerticalShort ../output/short.mp4 \
  --width=1080 --height=1920

# Square for Instagram
cd remotion-videos && npx remotion render <CompositionId> ../output/square.mp4 \
  --width=1080 --height=1080
```

### Quality Settings

```bash
# High quality (slower)
cd remotion-videos && npx remotion render <CompositionId> ../output/video.mp4 \
  --crf=18

# Lower quality (faster, smaller file)
cd remotion-videos && npx remotion render <CompositionId> ../output/video.mp4 \
  --crf=28
```

## Composition Props

### CodeExplainer

```json
{
  "code": "function hello() { return 'world'; }",
  "language": "javascript",
  "explanation": "This function returns a greeting"
}
```

### GitHubRecap

```json
{
  "username": "github-user",
  "commits": 150,
  "prs": 23,
  "issues": 45,
  "repos": ["repo1", "repo2"]
}
```

### ThreadToVideo

```json
{
  "tweets": [
    {"author": "@user", "text": "First tweet", "avatar": "url"},
    {"author": "@user", "text": "Second tweet", "avatar": "url"}
  ]
}
```

### Audiogram

```json
{
  "audioSrc": "path/to/audio.mp3",
  "transcript": "The spoken text...",
  "speakerName": "Speaker Name"
}
```

## Preview Before Rendering

```bash
cd remotion-videos && npx remotion studio
```

Opens browser preview at http://localhost:3000

## Tips

- Use CRF 18-23 for quality/size balance
- Preview with `remotion studio` first
- Check output directory exists: `mkdir -p output`
- Render times vary by composition complexity
- Use `--log=verbose` for debugging
