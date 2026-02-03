# Complete Developer Guide

> **Audience**: Developers who want to understand, modify, or extend the WhatsApp-Claude system. This guide assumes you have programming experience (C, C++, Java) but may be new to web development, Node.js, React, or Python.

## Table of Contents

1. [Introduction for Traditional Developers](#introduction-for-traditional-developers)
2. [Technology Stack Explained](#technology-stack-explained)
3. [Project Architecture](#project-architecture)
4. [Setting Up Your Development Environment](#setting-up-your-development-environment)
5. [Understanding the Codebase](#understanding-the-codebase)
6. [How to Modify the WhatsApp Bot](#how-to-modify-the-whatsapp-bot)
7. [How to Create New Skills](#how-to-create-new-skills)
8. [How to Create Video Compositions](#how-to-create-video-compositions)
9. [How to Add New Python Pipeline Steps](#how-to-add-new-python-pipeline-steps)
10. [Testing Your Changes](#testing-your-changes)
11. [Debugging Guide](#debugging-guide)
12. [Common Development Tasks](#common-development-tasks)

---

## Introduction for Traditional Developers

### From C/C++/Java to Modern Web Development

If you're coming from traditional languages, here are the key differences:

| Concept | C/C++/Java | This Project |
|---------|------------|--------------|
| **Compilation** | Compile before running | JavaScript runs directly (interpreted) |
| **Entry Point** | `main()` function | `whatsapp-bot.js` (script starts executing from top) |
| **Package Manager** | Manual linking or Maven/Gradle | npm (Node Package Manager) |
| **Dependencies** | Header files, libraries | `node_modules/` folder (auto-managed by npm) |
| **Syntax** | Strongly typed | JavaScript: loosely typed; TypeScript: typed |
| **Asynchronous** | Threads, callbacks | async/await, Promises (like futures) |
| **Memory** | Manual or garbage collected | Garbage collected (like Java) |

### Key Concepts You Need to Understand

#### 1. Node.js
Node.js is like the JVM but for JavaScript. It lets you run JavaScript outside a browser.

```javascript
// This is JavaScript that runs on your computer (not in a browser)
const fs = require('fs');  // Like #include <stdio.h>
fs.readFileSync('file.txt');  // Like fopen/fread
```

#### 2. npm (Node Package Manager)
npm is like Maven for Java or pip for Python. It downloads and manages libraries.

```bash
npm install          # Downloads dependencies defined in package.json
npm start           # Runs the "start" script from package.json
```

#### 3. async/await
Modern JavaScript handles asynchronous operations differently than threads:

```javascript
// Instead of threads, JavaScript uses async/await
async function fetchData() {
    const result = await someAsyncOperation();  // Waits without blocking
    return result;
}
```

#### 4. React & JSX
React is a way to write UI components. JSX looks like HTML inside JavaScript:

```jsx
// This is JSX - HTML-like syntax in JavaScript
function VideoTitle({ text }) {
    return <h1 style={{ color: 'white' }}>{text}</h1>;
}
```

#### 5. TypeScript
TypeScript is JavaScript with types (like going from Python to Java):

```typescript
// TypeScript adds types to JavaScript
function greet(name: string): string {
    return `Hello, ${name}`;
}
```

---

## Technology Stack Explained

### Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     WhatsApp-Claude System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Node.js       │  │   Remotion      │  │   Python        │ │
│  │   (Bot + TTS)   │  │   (Videos)      │  │   (AI Pipeline) │ │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤ │
│  │ whatsapp-bot.js │  │ React + TS      │  │ OpenAI SDK      │ │
│  │ scripts/tts.js  │  │ compositions/   │  │ fal.ai SDK      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Node.js Components

**File: `whatsapp-bot.js`**
- Language: JavaScript
- Purpose: Main entry point, WhatsApp connection
- Libraries: whatsapp-web.js, child_process

**File: `scripts/tts.js`**
- Language: JavaScript
- Purpose: Text-to-speech wrapper
- Libraries: openai

### Remotion Video Components

**Directory: `remotion-videos/`**
- Language: TypeScript (JavaScript with types)
- Framework: React + Remotion
- Purpose: Video generation

**Key files:**
- `src/Root.tsx` - Registers all compositions
- `src/compositions/*.tsx` - Video templates
- `src/components/*.tsx` - Reusable UI pieces

### Python Components

**Directory: `video-pipeline/`**
- Language: Python 3.10+
- Purpose: AI avatar video generation
- Libraries: openai, fal-client, requests

---

## Project Architecture

### Data Flow

```
User sends WhatsApp message
         │
         ▼
┌─────────────────────────────────┐
│     whatsapp-bot.js             │
│  • Receives message             │
│  • Checks for /claude prefix    │
│  • Spawns Claude Code process   │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│     Claude Code CLI             │
│  • Parses the request           │
│  • Reads relevant skills        │
│  • Executes tools               │
└─────────────────────────────────┘
         │
         ├──────────────────┬──────────────────┐
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Browser Tools   │ │ File Tools      │ │ Video/Audio     │
│ (MCP Chrome)    │ │ (Read/Write)    │ │ (Remotion/TTS)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│     Response sent back          │
│  • Output captured              │
│  • Chunked if too long          │
│  • Sent via WhatsApp            │
└─────────────────────────────────┘
```

### Directory Structure Deep Dive

```
whatsapp-claude/
│
├── whatsapp-bot.js              # ENTRY POINT - Start here
│   └── Responsibilities:
│       • WhatsApp Web connection
│       • Message listening
│       • Claude Code spawning
│       • Response handling
│
├── package.json                 # PROJECT MANIFEST
│   └── Defines:
│       • Project name, version
│       • Dependencies to install
│       • Scripts (npm start, etc.)
│
├── .env                         # SECRETS (never commit!)
│   └── Contains:
│       • OPENAI_API_KEY
│       • FAL_KEY
│
├── .claude/
│   ├── settings.json            # PERMISSIONS
│   │   └── What commands Claude can run
│   │
│   └── skills/                  # SKILL DEFINITIONS
│       └── <skill-name>/
│           └── SKILL.md         # Instructions for Claude
│
├── remotion-videos/             # VIDEO PROJECT
│   ├── package.json             # Separate dependencies
│   ├── remotion.config.ts       # Remotion settings
│   ├── tsconfig.json            # TypeScript config
│   └── src/
│       ├── index.ts             # Registers Root
│       ├── Root.tsx             # Composition registry
│       ├── compositions/        # Video templates
│       │   └── *.tsx
│       └── components/          # Reusable parts
│           └── *.tsx
│
├── video-pipeline/              # PYTHON AI PIPELINE
│   ├── requirements.txt         # Python dependencies
│   └── *.py                     # Pipeline scripts
│
├── scripts/
│   └── tts.js                   # Node.js TTS helper
│
├── assets/                      # INPUT FILES
│   ├── music/                   # Background music
│   └── downloads/               # Downloaded content
│
└── output/                      # OUTPUT FILES
    └── *.mp4, *.mp3, etc.
```

---

## Setting Up Your Development Environment

### Step 1: Install Required Software

#### Node.js (Required)

Node.js runs JavaScript outside browsers. Download from: https://nodejs.org

```bash
# Verify installation
node --version    # Should show v18 or higher
npm --version     # Should show 9 or higher
```

**For C/C++ developers**: Think of Node.js as a runtime like the JVM, and npm as a package manager like Maven.

#### Python (Required for avatar videos)

Download from: https://python.org

```bash
# Verify installation
python --version   # Should show 3.10 or higher
pip --version      # Package manager for Python
```

#### Git (Required)

For version control. Download from: https://git-scm.com

```bash
git --version
```

#### Visual Studio Code (Recommended)

Best editor for this project. Download from: https://code.visualstudio.com

**Recommended extensions:**
- ESLint (JavaScript linting)
- Prettier (Code formatting)
- TypeScript (Better TS support)
- Python (Python support)

### Step 2: Clone and Install

```bash
# Clone the repository
git clone <repository-url> whatsapp-claude
cd whatsapp-claude

# Install Node.js dependencies
npm install

# Install Remotion dependencies
cd remotion-videos
npm install
cd ..

# Install Python dependencies
pip install -r video-pipeline/requirements.txt
```

### Step 3: Configure Environment

Create `.env` file:

```bash
# Copy the template
cp .env.example .env

# Edit with your keys
# Use any text editor to add your API keys
```

### Step 4: Verify Installation

```bash
# Test WhatsApp bot
npm start
# Should show QR code

# Test Remotion (in another terminal)
cd remotion-videos
npx remotion studio
# Should open browser at localhost:3000

# Test Python
python video-pipeline/voice_generator.py --help
# Should show usage instructions
```

---

## Understanding the Codebase

### Reading whatsapp-bot.js

Let's break down the main file section by section:

```javascript
// === IMPORTS ===
// These are like #include statements in C
const { Client, LocalAuth } = require('whatsapp-web.js');
// Client: The WhatsApp connection class
// LocalAuth: Saves login credentials so you don't scan QR every time

const qrcode = require('qrcode-terminal');
// Displays QR code in terminal

const { spawn } = require('child_process');
// spawn: Creates a new process (like fork() in C)

require('dotenv').config();
// Loads .env file into process.env
```

```javascript
// === CONFIGURATION ===
const WORKSPACE = process.env.WORKSPACE || process.cwd();
// process.env.WORKSPACE: Read from .env file
// process.cwd(): Current working directory (like getcwd())

const COMMAND_PREFIX = '/claude ';
// Messages must start with this to be processed

const MAX_MESSAGE_LENGTH = 4096;
// WhatsApp's limit - we split longer messages
```

```javascript
// === CLIENT INITIALIZATION ===
const client = new Client({
    authStrategy: new LocalAuth(),  // Save credentials locally
    puppeteer: {
        headless: true,  // Don't show browser window
        args: ['--no-sandbox']  // Required on some systems
    }
});
// This creates the WhatsApp connection object
```

```javascript
// === EVENT HANDLERS ===
// These are like callback functions registered for events

client.on('qr', (qr) => {
    // Called when QR code needs to be displayed
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    // Called when connection is established
    console.log('✅ WhatsApp bot is ready!');
});

client.on('message_create', async (message) => {
    // Called for EVERY message (sent or received)
    // This is where the main logic lives
});
```

```javascript
// === MAIN LOGIC (message_create handler) ===
client.on('message_create', async (message) => {
    // Check if message is from self
    const isFromSelf = message.fromMe ||
        message.from.endsWith('@lid') ||
        message.from.endsWith('@c.us');

    if (!isFromSelf) return;  // Ignore messages from others

    // Check for /claude prefix
    if (!message.body.startsWith(COMMAND_PREFIX)) return;

    // Extract the actual task
    const task = message.body.slice(COMMAND_PREFIX.length).trim();

    // Execute via Claude Code
    const response = await executeClaudeTask(task);

    // Send response back
    await sendChunkedResponse(message, response);
});
```

```javascript
// === EXECUTE CLAUDE TASK ===
function executeClaudeTask(task) {
    return new Promise((resolve, reject) => {
        // spawn() creates a new process (like fork + exec in C)
        const claude = spawn('claude', [
            '-p', task,                          // The task to run
            '--dangerously-skip-permissions',   // Auto-approve actions
            '--print'                            // Output mode
        ], {
            cwd: WORKSPACE,  // Working directory
            shell: true      // Run in shell
        });

        let output = '';

        // Capture stdout (like pipe reading in C)
        claude.stdout.on('data', (data) => {
            output += data.toString();
        });

        // When process exits
        claude.on('close', (code) => {
            if (code === 0) {
                resolve(output);  // Success
            } else {
                reject(new Error('Process failed'));
            }
        });
    });
}
```

### Reading a Remotion Composition

Let's understand `ClaudeCodeIntro.tsx`:

```tsx
// === IMPORTS ===
import React from "react";
// React is the UI framework (like Qt or GTK for C++)

import {
    AbsoluteFill,    // Full-screen container
    useCurrentFrame, // Current frame number (0, 1, 2, ...)
    useVideoConfig,  // Video settings (fps, duration, etc.)
    spring,          // Physics-based animation
    interpolate,     // Map one value range to another
} from "remotion";
// Remotion provides video-specific components and hooks
```

```tsx
// === COMPONENT PROPS (Interface) ===
interface ClaudeCodeIntroProps {
    title: string;    // Required string prop
    subtitle: string; // Required string prop
}
// This is TypeScript - defines what data this component expects
// Like a struct in C
```

```tsx
// === THE COMPONENT ===
export const ClaudeCodeIntro: React.FC<ClaudeCodeIntroProps> = ({
    title,
    subtitle,
}) => {
    // Get current frame (called 30 times per second at 30fps)
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Create a spring animation
    // spring() returns a number from 0 to 1 (smoothly)
    const titleSpring = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    // Return the visual content (JSX)
    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(...)',
            display: 'flex',
            alignItems: 'center',
        }}>
            <h1 style={{
                transform: `scale(${titleSpring})`,
                // titleSpring goes from 0 to 1
                // So the title scales from 0% to 100%
            }}>
                {title}
            </h1>
        </AbsoluteFill>
    );
};
```

### Reading a Python Pipeline Script

Let's understand `voice_generator.py`:

```python
#!/usr/bin/env python3
# Shebang: tells system to use python3 to run this

"""
Docstring: Describes what this module does
"""

# === IMPORTS ===
import argparse  # Command-line argument parsing (like getopt in C)
import os
import sys
from pathlib import Path  # Modern path handling

from openai import OpenAI  # OpenAI SDK
```

```python
# === CONSTANTS ===
VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
VALID_MODELS = ["tts-1", "tts-1-hd"]
```

```python
# === MAIN FUNCTION ===
def generate_voice(text: str, output_path: str, voice: str = "nova") -> str:
    """
    Type hints: text is a string, returns a string
    Like function signatures in C: char* generate_voice(char* text, ...)
    """

    # Initialize API client
    client = OpenAI()  # Reads OPENAI_API_KEY from environment

    # Call the API
    response = client.audio.speech.create(
        model="tts-1-hd",
        voice=voice,
        input=text
    )

    # Save to file
    response.stream_to_file(output_path)

    return output_path
```

```python
# === COMMAND LINE INTERFACE ===
def main():
    # argparse is Python's way to handle CLI arguments
    parser = argparse.ArgumentParser(description="Generate TTS")
    parser.add_argument("text", help="Text to speak")
    parser.add_argument("output", help="Output file path")
    parser.add_argument("--voice", default="nova", choices=VALID_VOICES)

    args = parser.parse_args()

    generate_voice(args.text, args.output, args.voice)

# This runs main() when script is executed directly
if __name__ == "__main__":
    main()
```

---

## How to Modify the WhatsApp Bot

### Change the Command Prefix

Edit `whatsapp-bot.js`:

```javascript
// Change from:
const COMMAND_PREFIX = '/claude ';

// To (for example):
const COMMAND_PREFIX = '!ai ';
```

### Add a New Direct Command

Add before the Claude execution:

```javascript
client.on('message_create', async (message) => {
    // ... existing checks ...

    // Add custom commands
    if (message.body === '/status') {
        await message.reply('Bot is running!');
        return;
    }

    if (message.body === '/help') {
        await message.reply('Send /claude <task> to run a command');
        return;
    }

    // ... rest of Claude handling ...
});
```

### Add Logging

```javascript
const fs = require('fs');

function log(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;

    console.log(logLine);
    fs.appendFileSync('bot.log', logLine);
}

// Use throughout:
log(`Received task: ${task}`);
```

### Change Timeout Duration

```javascript
// Change from:
const EXECUTION_TIMEOUT = 600000; // 10 minutes

// To:
const EXECUTION_TIMEOUT = 300000; // 5 minutes
```

---

## How to Create New Skills

### Skill Structure

Each skill is a directory with a `SKILL.md` file:

```
.claude/skills/my-new-skill/
└── SKILL.md
```

### SKILL.md Format

```yaml
---
name: my-new-skill
description: What this skill does. Shown when Claude decides which skill to use.
allowed-tools:
  - Bash
  - Read
  - Write
---

# My New Skill

Instructions for Claude on how to use this skill.

## When to Use

Describe scenarios when this skill should be used.

## Steps

1. First step
2. Second step
3. Third step

## Examples

Example commands and expected outcomes.
```

### Example: Creating a "daily-summary" Skill

**Step 1: Create directory**
```bash
mkdir -p .claude/skills/daily-summary
```

**Step 2: Create SKILL.md**

```markdown
---
name: daily-summary
description: Create a daily summary of activities, todos, and calendar events. Use when asked for a daily briefing or morning summary.
allowed-tools:
  - Bash
  - Read
  - Write
  - mcp__claude-in-chrome__*
---

# Daily Summary Skill

Generate a morning briefing with key information for the day.

## What This Skill Does

1. Checks the current date and time
2. Lists any scheduled tasks
3. Summarizes recent files in output/
4. Optionally checks email for important messages

## Workflow

### Step 1: Get Current Date
```bash
date +"%A, %B %d, %Y"
```

### Step 2: Check Scheduled Tasks
```bash
crontab -l
```

### Step 3: List Recent Output Files
```bash
ls -lt output/ | head -10
```

### Step 4: Generate Summary
Create a markdown summary at output/daily-summary-YYYY-MM-DD.md

## Output Format

```markdown
# Daily Summary - [Date]

## Today's Date
[Full date and day of week]

## Scheduled Tasks
[List of cron jobs]

## Recent Files
[List of recent output files]

## Notes
[Any additional information]
```
```

**Step 3: Test the skill**
```
/claude give me a daily summary
```

---

## How to Create Video Compositions

### Step 1: Create the Component File

Create `remotion-videos/src/compositions/MyComposition.tsx`:

```tsx
import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
} from "remotion";

// Define props interface (what data this video needs)
interface MyCompositionProps {
    title: string;
    backgroundColor?: string;  // ? means optional
}

// Define the component
export const MyComposition: React.FC<MyCompositionProps> = ({
    title,
    backgroundColor = "#1a1a2e",  // Default value
}) => {
    // Get current frame (0, 1, 2, ... up to duration)
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Create animations
    // spring() creates smooth motion from 0 to 1
    const titleScale = spring({
        frame,
        fps,
        config: { damping: 12 },
    });

    // interpolate() maps frame range to value range
    // Frames 0-30 map to opacity 0-1
    const titleOpacity = interpolate(
        frame,
        [0, 30],  // Input range (frames)
        [0, 1],   // Output range (opacity)
        { extrapolateRight: "clamp" }  // Don't go beyond 1
    );

    // Return the visual content
    return (
        <AbsoluteFill
            style={{
                backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1
                style={{
                    fontSize: 100,
                    color: "white",
                    fontFamily: "Inter, sans-serif",
                    transform: `scale(${titleScale})`,
                    opacity: titleOpacity,
                }}
            >
                {title}
            </h1>
        </AbsoluteFill>
    );
};
```

### Step 2: Register in Root.tsx

Edit `remotion-videos/src/Root.tsx`:

```tsx
// Add import at the top
import { MyComposition } from "./compositions/MyComposition";

// Add Composition in the RemotionRoot function
export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* ... existing compositions ... */}

            <Composition
                id="MyComposition"           // ID used for rendering
                component={MyComposition}     // The component
                durationInFrames={150}        // 5 seconds at 30fps
                fps={30}                      // Frames per second
                width={1920}                  // Video width
                height={1080}                 // Video height
                defaultProps={{               // Default values
                    title: "Hello World",
                    backgroundColor: "#1a1a2e",
                }}
            />
        </>
    );
};
```

### Step 3: Preview and Test

```bash
cd remotion-videos
npx remotion studio
```

Open http://localhost:3000 and find your composition in the sidebar.

### Step 4: Render

```bash
npx remotion render MyComposition ../output/my-video.mp4
```

### Animation Techniques

#### Spring Animation (Bouncy)
```tsx
const scale = spring({
    frame,
    fps,
    config: {
        damping: 12,     // Lower = more bouncy
        stiffness: 100,  // Higher = faster
    },
});
```

#### Linear Interpolation
```tsx
// Fade in over first 30 frames
const opacity = interpolate(frame, [0, 30], [0, 1]);

// Move from left to center
const x = interpolate(frame, [0, 60], [-500, 0]);
```

#### Delayed Animation
```tsx
// Start animation after frame 30
const delayedScale = spring({
    frame: frame - 30,  // Subtract delay
    fps,
    config: { damping: 12 },
});
```

---

## How to Add New Python Pipeline Steps

### Creating a New Pipeline Script

Create `video-pipeline/my_processor.py`:

```python
#!/usr/bin/env python3
"""
My Custom Processor

What it does and how to use it.

Usage: python my_processor.py input.mp4 output.mp4
"""

import argparse
import os
import sys
from pathlib import Path


def process_video(input_path: str, output_path: str, option: str = "default") -> str:
    """
    Process a video file.

    Args:
        input_path: Path to input video
        output_path: Path for output video
        option: Processing option

    Returns:
        Path to the output file
    """
    # Validate input
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input not found: {input_path}")

    # Ensure output directory exists
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    # Your processing logic here
    print(f"Processing {input_path}...")

    # Example: Use FFmpeg for video processing
    import subprocess
    result = subprocess.run([
        "ffmpeg", "-y",
        "-i", input_path,
        # Add your FFmpeg options here
        output_path
    ], capture_output=True, text=True)

    if result.returncode != 0:
        raise Exception(f"FFmpeg error: {result.stderr}")

    print(f"Output saved to: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Process video files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python my_processor.py input.mp4 output.mp4
  python my_processor.py input.mp4 output.mp4 --option custom
        """
    )

    parser.add_argument("input", help="Input video file")
    parser.add_argument("output", help="Output video file")
    parser.add_argument(
        "--option",
        default="default",
        help="Processing option (default: default)"
    )

    args = parser.parse_args()

    try:
        process_video(args.input, args.output, args.option)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

### Adding Dependencies

Edit `video-pipeline/requirements.txt`:

```
# Existing dependencies
openai>=1.0.0
fal-client>=0.4.0
requests>=2.31.0

# Add your new dependencies
pillow>=10.0.0  # Image processing
moviepy>=1.0.0  # Video editing
```

Install:
```bash
pip install -r video-pipeline/requirements.txt
```

---

## Testing Your Changes

### Testing the WhatsApp Bot

1. Make your changes
2. Restart the bot: `npm start`
3. Send a test message from your phone
4. Check terminal for errors

### Testing Remotion Compositions

1. Start preview server: `npx remotion studio`
2. Find your composition in the sidebar
3. Scrub through the timeline
4. Adjust props in the right panel

### Testing Python Scripts

```bash
# Test with --help
python video-pipeline/my_processor.py --help

# Test with sample data
python video-pipeline/my_processor.py test_input.mp4 test_output.mp4
```

### Testing Skills

```
/claude use the <skill-name> skill to <task>
```

---

## Debugging Guide

### JavaScript Debugging

**Add console.log statements:**
```javascript
console.log('Variable value:', variable);
console.log('Object:', JSON.stringify(object, null, 2));
```

**Check for errors:**
```javascript
try {
    await riskyOperation();
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}
```

### TypeScript/React Debugging

**Check browser console:**
Open DevTools (F12) when running `npx remotion studio`

**Add logging in components:**
```tsx
const MyComponent = (props) => {
    console.log('Props:', props);
    console.log('Frame:', useCurrentFrame());
    return <div>...</div>;
};
```

### Python Debugging

**Add print statements:**
```python
print(f"Variable: {variable}")
print(f"Type: {type(variable)}")
```

**Use debugger:**
```python
import pdb; pdb.set_trace()  # Stops execution here
```

---

## Common Development Tasks

### Task: Add a New Voice Option

1. Edit `scripts/tts.js`, add voice to `validVoices` array
2. Edit `.claude/skills/tts/SKILL.md`, document new voice
3. Test: `node scripts/tts.js "test" output.mp3 --voice newvoice`

### Task: Change Video Resolution

Edit `remotion-videos/src/Root.tsx`:

```tsx
<Composition
    width={1280}   // Change from 1920
    height={720}   // Change from 1080
    ...
/>
```

### Task: Add New WhatsApp Command Handler

Edit `whatsapp-bot.js`:

```javascript
client.on('message_create', async (message) => {
    // Add before Claude handling
    if (message.body.startsWith('/mycommand ')) {
        const arg = message.body.slice('/mycommand '.length);
        // Handle your command
        await message.reply(`You said: ${arg}`);
        return;
    }

    // Existing Claude handling...
});
```

### Task: Modify Permissions

Edit `.claude/settings.json`:

```json
{
    "permissions": {
        "allow": [
            "Bash(npm *)",
            "Bash(node *)",
            "Bash(my-new-command *)",  // Add new allowed command
            // ...
        ]
    }
}
```

---

## Next Steps

1. **Read the Architecture Guide**: [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Review Skills Reference**: [SKILLS_REFERENCE.md](SKILLS_REFERENCE.md)
3. **Check Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. **Learn the Glossary**: [GLOSSARY.md](GLOSSARY.md)
