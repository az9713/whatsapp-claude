# System Architecture

> **Audience**: Developers who want to understand how the system works internally.

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Component Deep Dive](#component-deep-dive)
3. [Data Flow](#data-flow)
4. [Technology Decisions](#technology-decisions)
5. [Security Model](#security-model)
6. [Scalability Considerations](#scalability-considerations)

---

## High-Level Overview

### System Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           WhatsApp-Claude System                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐   │
│  │   Phone     │ ──1───▶ │  WhatsApp Web    │ ──2───▶ │  whatsapp-bot   │   │
│  │ (WhatsApp)  │ ◀──8─── │  (puppeteer)     │ ◀──7─── │  (Node.js)      │   │
│  └─────────────┘         └──────────────────┘         └────────┬────────┘   │
│                                                                 │            │
│                                                                3│            │
│                                                                 ▼            │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         Claude Code CLI                               │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │                        Tool Dispatcher                          │ │   │
│  │  └────────┬────────────────┬────────────────┬────────────────┬────┘ │   │
│  │           │                │                │                │       │   │
│  │          4│               4│               4│               4│       │   │
│  │           ▼                ▼                ▼                ▼       │   │
│  │  ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐  │   │
│  │  │   Bash     │   │   Read/    │   │  Browser   │   │  External  │  │   │
│  │  │   Tool     │   │   Write    │   │   MCP      │   │   APIs     │  │   │
│  │  └──────┬─────┘   └──────┬─────┘   └──────┬─────┘   └──────┬─────┘  │   │
│  │         │                │                │                │        │   │
│  └─────────┼────────────────┼────────────────┼────────────────┼────────┘   │
│           5│               5│               5│               5│            │
│            ▼                ▼                ▼                ▼            │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐        │
│  │ Remotion   │   │ File       │   │ Chrome     │   │ OpenAI/    │        │
│  │ (Video)    │   │ System     │   │ Browser    │   │ fal.ai     │        │
│  └────────────┘   └────────────┘   └────────────┘   └────────────┘        │
│                                                                            │
│                                        6                                   │
│                      ◀─────────────────────────────────────────────────    │
│                              Results flow back up                          │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────────┘

Flow:
1. User sends WhatsApp message
2. puppeteer receives via WhatsApp Web
3. Bot spawns Claude Code process
4. Claude Code dispatches to appropriate tools
5. Tools execute (files, browser, external APIs)
6. Results collected
7. Results returned to bot
8. Bot sends reply via WhatsApp
```

### Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Phone | User interface | WhatsApp |
| whatsapp-bot.js | Message bridge | Node.js, whatsapp-web.js |
| Claude Code | Task execution | Anthropic CLI |
| Skills | Task instructions | Markdown files |
| Remotion | Video generation | React, TypeScript |
| video-pipeline | Avatar generation | Python |
| Browser MCP | Web automation | Chrome extension |

---

## Component Deep Dive

### WhatsApp Bot (`whatsapp-bot.js`)

**Purpose**: Bridge between WhatsApp and Claude Code

**How it works**:

```
┌─────────────────────────────────────────────────────────────┐
│                    whatsapp-bot.js                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  WhatsApp Client                       │ │
│  │  • Uses puppeteer to run Chrome headless              │ │
│  │  • Connects to web.whatsapp.com                       │ │
│  │  • Maintains session in .wwebjs_auth/                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  Event Handlers                        │ │
│  │  • on('qr') - Display QR code                         │ │
│  │  • on('ready') - Connected                            │ │
│  │  • on('message_create') - Process messages            │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  Message Filter                        │ │
│  │  • Check if from self (fromMe, @lid, @c.us)           │ │
│  │  • Check for /claude prefix                           │ │
│  │  • Extract task string                                │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  Claude Executor                       │ │
│  │  • spawn('claude', ['-p', task, ...])                 │ │
│  │  • Capture stdout/stderr                              │ │
│  │  • Handle timeout (10 minutes)                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  Response Handler                      │ │
│  │  • Split long responses (4096 char limit)             │ │
│  │  • Add part numbers (Part 1/3, etc.)                  │ │
│  │  • Retry on failure                                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Design Decisions**:

1. **Headless Chrome**: WhatsApp Web requires a browser; puppeteer runs Chrome without UI
2. **Self-messages only**: Security feature - only processes messages you send to yourself
3. **Child process**: Claude runs as separate process for isolation
4. **Chunking**: WhatsApp has 4096 char limit; long responses are split

### Skills System (`.claude/skills/`)

**Purpose**: Provide Claude with instructions for specific tasks

**Structure**:
```
.claude/skills/
├── skill-name/
│   └── SKILL.md      # Instructions and metadata
```

**SKILL.md Format**:
```yaml
---
name: skill-name
description: When to use this skill
allowed-tools:
  - Tool1
  - Tool2
---

# Instructions in Markdown

Claude reads these instructions when the skill is invoked.
```

**How Claude Uses Skills**:

1. User sends a request
2. Claude analyzes the request
3. Claude checks available skills
4. If a skill matches, Claude reads its SKILL.md
5. Claude follows the instructions

### Remotion Video System

**Purpose**: Generate videos programmatically using React

**Architecture**:
```
┌─────────────────────────────────────────────────────────────┐
│                    Remotion System                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Root.tsx - Composition Registry                       │ │
│  │  • Registers all available videos                      │ │
│  │  • Defines duration, fps, dimensions                   │ │
│  │  • Sets default props                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Compositions (*.tsx)                                  │ │
│  │  • React components                                    │ │
│  │  • Use useCurrentFrame() for animation                │ │
│  │  • Return JSX for each frame                          │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Remotion Renderer                                     │ │
│  │  • Renders each frame as image                        │ │
│  │  • Encodes frames to video (FFmpeg)                   │ │
│  │  • Outputs MP4 file                                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**How Rendering Works**:

1. Remotion calls your component for frame 0
2. Component returns JSX (React elements)
3. JSX is rendered to an image
4. Repeat for frames 1, 2, 3... up to duration
5. Images are encoded into video using FFmpeg

### Python Video Pipeline

**Purpose**: Generate AI avatar videos

**Pipeline Flow**:
```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│   Text     │───▶│  OpenAI    │───▶│   Upload   │───▶│ OmniHuman  │───▶│   Final    │
│   Input    │    │    TTS     │    │  to CDN    │    │   v1.5     │    │   Video    │
└────────────┘    └────────────┘    └────────────┘    └────────────┘    └────────────┘
     │                  │                 │                  │                │
     │                  │                 │                  │                │
     ▼                  ▼                 ▼                  ▼                ▼
  Script          voice.mp3         CDN URLs            avatar.mp4       final.mp4
                                   (audio+image)       (lip-synced)    (with music)
```

**Script Responsibilities**:

| Script | Input | Output | External Service |
|--------|-------|--------|-----------------|
| voice_generator.py | Text | MP3 audio | OpenAI TTS API |
| storage_manager.py | Files | CDN URLs | fal.ai storage |
| video_generator.py | URLs | Video URL | fal.ai OmniHuman |
| video_retriever.py | URL | Local file | HTTP download |
| post_processor.py | Video + Music | Final video | FFmpeg |

---

## Data Flow

### Message Processing Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Message Processing Flow                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  1. User types: /claude create a countdown video                             │
│                                                                               │
│  2. WhatsApp delivers to bot via web.whatsapp.com                            │
│                                                                               │
│  3. Bot checks:                                                               │
│     ✓ Is from self? (message.fromMe or @lid/@c.us suffix)                   │
│     ✓ Starts with "/claude "?                                                │
│     → Extract task: "create a countdown video"                               │
│                                                                               │
│  4. Bot spawns Claude:                                                        │
│     spawn('claude', ['-p', 'create a countdown video', ...])                 │
│                                                                               │
│  5. Claude processes:                                                         │
│     → Reads skills to find video-render                                      │
│     → Determines to use Remotion                                             │
│     → Executes: npx remotion render CountdownTimer output/video.mp4          │
│                                                                               │
│  6. Remotion renders:                                                         │
│     → Frame 0, 1, 2, ... 210 (7 seconds at 30fps)                           │
│     → Encodes to MP4                                                         │
│                                                                               │
│  7. Claude returns:                                                           │
│     "Video created at output/video.mp4"                                      │
│                                                                               │
│  8. Bot sends response to WhatsApp                                           │
│                                                                               │
│  9. User receives message on phone                                           │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### File Locations

```
Input Sources:
┌─────────────────────────────────────────────────────────────┐
│  assets/music/       ← Background music files               │
│  assets/downloads/   ← Downloaded videos/audio              │
│  assets/avatar.png   ← Avatar images                        │
└─────────────────────────────────────────────────────────────┘

Output Destinations:
┌─────────────────────────────────────────────────────────────┐
│  output/             ← All generated content                │
│  output/*.mp4        ← Rendered videos                      │
│  output/*.mp3        ← Generated audio                      │
│  output/*.md         ← Research reports, scripts            │
└─────────────────────────────────────────────────────────────┘

Temporary/Session:
┌─────────────────────────────────────────────────────────────┐
│  .wwebjs_auth/       ← WhatsApp session data                │
│  node_modules/       ← Installed packages                   │
│  remotion-videos/out/← Remotion render cache               │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Decisions

### Why Node.js for the Bot?

| Consideration | Decision |
|--------------|----------|
| whatsapp-web.js library | Best WhatsApp Web library is in JavaScript |
| Event-driven nature | Node.js excels at event-based I/O |
| Process spawning | Easy to spawn Claude CLI as child process |
| Package ecosystem | npm has vast library selection |

### Why React/Remotion for Videos?

| Consideration | Decision |
|--------------|----------|
| Declarative animations | Describe what you want, not how to animate |
| Component reuse | Share components across compositions |
| Familiar syntax | Most developers know React |
| Frame-perfect control | useCurrentFrame() gives exact frame number |

### Why Python for Pipeline?

| Consideration | Decision |
|--------------|----------|
| AI library support | OpenAI and fal.ai have excellent Python SDKs |
| Data processing | Python excels at sequential data pipelines |
| Script simplicity | Each step is a standalone script |

### Why Skills as Markdown?

| Consideration | Decision |
|--------------|----------|
| Human readable | Easy to read and understand |
| Claude native | Claude excels at following written instructions |
| Version control friendly | Easy to diff and review changes |
| No compilation | Changes take effect immediately |

---

## Security Model

### Authentication Flow

```
┌────────────────────────────────────────────────────────────┐
│                   Security Boundaries                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  WhatsApp Auth:                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  • QR code scan links to your WhatsApp account       │ │
│  │  • Session stored locally in .wwebjs_auth/           │ │
│  │  • Only processes self-messages                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Claude Auth:                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  • claude auth login - one-time browser auth         │ │
│  │  • Credentials stored in ~/.claude/                  │ │
│  │  • API calls authenticated automatically             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  API Keys:                                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  • Stored in .env file (not committed)               │ │
│  │  • Read via dotenv at runtime                        │ │
│  │  • Never logged or transmitted                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Permission Model

```
┌────────────────────────────────────────────────────────────┐
│               .claude/settings.json                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  "permissions": {                                          │
│      "allow": [                                            │
│          "Bash(npm *)",    ← Allow npm commands            │
│          "Bash(node *)",   ← Allow node commands           │
│          "Bash(python *)", ← Allow python commands         │
│          "Read(*)",        ← Allow reading any file        │
│          "Write(*)",       ← Allow writing any file        │
│      ],                                                    │
│      "deny": [                                             │
│          "Read(.env)",     ← Cannot read secrets           │
│          "Read(.env.*)",   ← Cannot read any .env file     │
│      ]                                                     │
│  }                                                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Trust Boundaries

```
Trusted:
• Your WhatsApp account (you control it)
• Local file system (your computer)
• Claude Code (authenticated with your account)

Semi-Trusted:
• Browser sessions (logged into your accounts)
• External APIs (authenticated with your keys)

Untrusted:
• Internet content (web pages, downloads)
• Other WhatsApp users (filtered out)
```

---

## Scalability Considerations

### Current Limitations

| Aspect | Limit | Reason |
|--------|-------|--------|
| Concurrent tasks | 1 | Single Claude process at a time |
| Message rate | ~1/sec | WhatsApp rate limiting |
| Video render | CPU-bound | Remotion uses local CPU |
| Session | Single user | One WhatsApp account per bot |

### Potential Improvements

**For higher throughput**:
- Queue system for multiple tasks
- Worker pool for parallel rendering
- Cloud rendering for videos

**For multiple users**:
- Separate bot instances per user
- Centralized task queue
- User authentication layer

### Resource Usage

```
Typical Resource Usage:

Idle:
• Bot: ~50MB RAM (Node.js + Puppeteer)
• No CPU usage

Processing text:
• Bot: ~100MB RAM
• Claude: ~200MB RAM
• Low CPU usage

Rendering video:
• Remotion: ~500MB-2GB RAM
• High CPU usage (100% during render)
• FFmpeg: Additional ~100MB

Avatar generation:
• Minimal local resources
• Processing happens on fal.ai servers
```
