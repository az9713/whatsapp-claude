# WhatsApp-Claude Agent System

> **For Claude Code**: This is the main project documentation. Read this file first to understand the project structure and capabilities.

## What This Project Does

This project creates a bridge between **WhatsApp** (the messaging app on your phone) and **Claude Code** (an AI coding assistant). When you send a message starting with `/claude` to yourself on WhatsApp, the system:

1. Receives your message via the WhatsApp bot
2. Sends your request to Claude Code
3. Claude Code executes the task (browse web, create videos, send emails, etc.)
4. Returns the result back to your WhatsApp

## Key Capabilities

| Capability | What It Does | Example Command |
|------------|--------------|-----------------|
| **Browser Automation** | Control Chrome to browse websites | `/claude go to twitter and search for AI news` |
| **Video Creation** | Generate professional videos with Remotion | `/claude create a 15-second intro video` |
| **Voice Generation** | Create voice-overs with OpenAI TTS | `/claude generate voice saying "hello world"` |
| **Avatar Videos** | Create lip-synced talking head videos | `/claude create avatar video with script "..."` |
| **Email Automation** | Send and read Gmail | `/claude send email to john@email.com` |
| **Task Scheduling** | Schedule recurring tasks | `/claude schedule daily at 9am to check news` |

## Project Structure

```
whatsapp-claude/
├── whatsapp-bot.js          # Main entry point - the WhatsApp bridge
├── package.json             # Node.js dependencies
├── .env                     # API keys (NEVER commit this!)
├── .mcp.json               # MCP server configuration
│
├── .claude/
│   ├── settings.json       # Claude Code permissions
│   └── skills/             # 12 skill definitions
│       ├── x-navigation/   # Browse Twitter/X
│       ├── x-research/     # Research on Twitter
│       ├── x-posting/      # Post tweets
│       ├── video-understanding/  # Download & transcribe videos
│       ├── video-research/ # Research for video content
│       ├── video-script/   # Write video scripts
│       ├── video-render/   # Render Remotion videos
│       ├── tts/            # Text-to-speech
│       ├── youtube-upload/ # Upload to YouTube
│       ├── gmail/          # Email automation
│       ├── schedule-job/   # Cron scheduling
│       └── avatar-video/   # AI avatar generation
│
├── remotion-videos/        # Video generation project
│   ├── package.json        # Remotion dependencies
│   ├── remotion.config.ts  # Remotion settings
│   └── src/
│       ├── Root.tsx        # Composition registry
│       ├── index.ts        # Entry point
│       ├── compositions/   # 12 video templates
│       └── components/     # Reusable components
│
├── video-pipeline/         # Python video processing
│   ├── requirements.txt    # Python dependencies
│   ├── voice_generator.py  # OpenAI TTS
│   ├── storage_manager.py  # CDN upload
│   ├── video_generator.py  # OmniHuman avatar
│   ├── video_retriever.py  # Download videos
│   └── post_processor.py   # FFmpeg mixing
│
├── scripts/
│   └── tts.js             # Node.js TTS wrapper
│
├── assets/
│   ├── music/             # Background music files
│   └── downloads/         # Downloaded content
│
├── output/                # Generated content goes here
│
└── docs/                  # Documentation
    ├── QUICK_START.md     # Start here for quick wins
    ├── USER_GUIDE.md      # Complete user manual
    ├── DEVELOPER_GUIDE.md # For developers
    ├── INSTALLATION.md    # Step-by-step setup
    ├── ARCHITECTURE.md    # System design
    ├── TROUBLESHOOTING.md # Problem solving
    ├── SKILLS_REFERENCE.md # All skills documented
    └── GLOSSARY.md        # Terms explained
```

## Quick Commands Reference

### Starting the System
```bash
npm start                    # Start WhatsApp bot
```

### Conversation Memory

The bot automatically continues your conversation after the first message:

```
/claude create a video about space       # Starts new conversation
/claude make it 30 seconds               # Continues (remembers "space video")
/claude add some epic music              # Still continues
/claude --new what is 2+2                # Starts FRESH conversation
```

**Timeout**: Tasks have 20 minutes to complete (good for video rendering).

### Video Creation
```bash
cd remotion-videos
npx remotion studio          # Preview videos in browser
npx remotion render <name>   # Render a video
```

### Voice Generation
```bash
node scripts/tts.js "text" output.mp3 --voice nova
```

## Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [HOW_IT_WORKS.md](docs/HOW_IT_WORKS.md) | **Start Here** - Demystifies the iPhone-to-laptop magic | Everyone |
| [QUICK_START.md](docs/QUICK_START.md) | Get running in 5 minutes with examples | Everyone |
| [USER_GUIDE.md](docs/USER_GUIDE.md) | Complete usage instructions | End users |
| [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Extend and modify the system | Developers |
| [INSTALLATION.md](docs/INSTALLATION.md) | Step-by-step setup | Everyone |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical system design | Developers |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Fix common problems | Everyone |
| [SKILLS_REFERENCE.md](docs/SKILLS_REFERENCE.md) | All skills explained | Everyone |
| [GLOSSARY.md](docs/GLOSSARY.md) | Technical terms explained | Beginners |

## Environment Variables

These must be set in the `.env` file:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | For text-to-speech voice generation |
| `FAL_KEY` | Optional | For AI avatar video generation |
| `WORKSPACE` | Optional | Working directory (defaults to current) |

## Key Files to Understand

1. **`whatsapp-bot.js`** - The main program that:
   - Connects to WhatsApp Web
   - Listens for messages starting with `/claude`
   - Executes Claude Code commands
   - Returns responses

2. **`.claude/skills/*/SKILL.md`** - Each skill defines:
   - What the skill does
   - What tools it can use
   - Step-by-step instructions

3. **`remotion-videos/src/compositions/`** - Video templates:
   - React components that define video content
   - Each composition = one video type

## Common Tasks

### Add a New Skill
1. Create directory: `.claude/skills/my-skill/`
2. Create file: `SKILL.md` with YAML frontmatter
3. Define allowed tools and instructions

### Add a New Video Composition
1. Create file: `remotion-videos/src/compositions/MyVideo.tsx`
2. Register in `remotion-videos/src/Root.tsx`
3. Test with `npx remotion studio`

### Modify Permissions
Edit `.claude/settings.json` to add/remove allowed commands.

## Safety Notes

- The bot runs with `--dangerously-skip-permissions` flag
- Only responds to messages from yourself (self-messages)
- Never commit `.env` file with API keys
- Be careful with scheduled tasks - they run automatically

## Getting Help

1. Read the documentation in `docs/` folder
2. Check `docs/TROUBLESHOOTING.md` for common issues
3. Review `docs/GLOSSARY.md` for unfamiliar terms
