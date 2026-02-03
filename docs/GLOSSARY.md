# Glossary

> **Purpose**: Explanations of technical terms used in this project. If you encounter an unfamiliar term, look it up here.

---

## A

### API (Application Programming Interface)
A way for programs to communicate with each other. When this project uses the "OpenAI API", it's sending requests to OpenAI's servers and getting responses back.

**Example**: Your phone uses APIs to get weather data, social media feeds, etc.

### API Key
A secret password that lets your program access an API. Keep these private!

**Example**: `OPENAI_API_KEY=sk-abc123...` in your .env file

### async/await
A way to handle operations that take time (like network requests) without freezing the program. Instead of waiting, the program can do other things and come back when the operation is done.

**Comparison**: Like ordering food at a restaurant. You don't stand at the kitchen door waiting - you sit down and the waiter brings it when ready.

### Avatar
In this project, a portrait image used to create a talking-head video. The AI makes the avatar's lips move to match the audio.

---

## B

### Bash
A command-line shell - the program that runs commands in your terminal. When you type `npm start`, Bash (or a similar shell) executes it.

**Common Bash commands**:
- `ls` - list files
- `cd` - change directory
- `mkdir` - make directory

### Bot
A program that performs automated tasks. The WhatsApp bot listens for messages and responds automatically.

---

## C

### CDN (Content Delivery Network)
A network of servers that stores and delivers files quickly. fal.ai uses a CDN to store audio and images for avatar generation.

### Child Process
A program started by another program. When the WhatsApp bot runs Claude Code, Claude Code is a "child process" of the bot.

### CLI (Command Line Interface)
A text-based way to interact with a program by typing commands. Claude Code is a CLI tool - you run it by typing `claude` in the terminal.

**Opposite**: GUI (Graphical User Interface) - clicking buttons and icons

### Composition (Remotion)
A video template in Remotion. Each composition defines one type of video - its duration, size, and what appears in each frame.

**Example**: `ClaudeCodeIntro` is a composition that creates a 7-second branded intro.

### Cron
A time-based job scheduler in Unix/Linux. It runs commands at specified times automatically.

**Format**: `minute hour day month weekday command`
**Example**: `0 9 * * *` means "at 9:00 AM every day"

---

## D

### Dependency
A package or library that your project needs to work. Listed in `package.json` (Node.js) or `requirements.txt` (Python).

**Example**: `whatsapp-web.js` is a dependency - the bot needs it to connect to WhatsApp.

### dotenv
A library that loads settings from a `.env` file into your program. Keeps secrets out of your code.

---

## E

### Environment Variable
A value stored outside your code that your program can read. Used for configuration and secrets.

**Example**: `OPENAI_API_KEY` is an environment variable

### Event-Driven
A programming style where code runs in response to events (things happening). The WhatsApp bot is event-driven - it responds to message events.

---

## F

### FFmpeg
A command-line tool for processing video and audio files. Remotion uses it to encode videos, and the pipeline uses it to add music.

**Common uses**:
- Convert video formats
- Extract audio from video
- Combine audio and video

### fps (Frames Per Second)
How many images are shown per second in a video. 30 fps means 30 images per second.

**Video math**: A 7-second video at 30 fps = 210 frames

---

## G

### Git
Version control software that tracks changes to your code. Like "save points" that you can return to.

**Common commands**:
- `git clone` - download a project
- `git pull` - update from server
- `git push` - upload changes

### GitHub
A website that hosts Git repositories (project folders). Like a cloud storage for code.

---

## H

### Headless Browser
A web browser running without a visible window. The WhatsApp bot uses a headless Chrome browser to connect to WhatsApp Web.

**Why headless?**: Faster and uses less memory than showing a window.

### Hook (Code)
A special function that gets called at specific times. In React/Remotion, `useCurrentFrame()` is a hook that tells you the current frame number.

### Hook (Event)
In Claude Code, hooks are commands that run automatically when certain events happen (like after a file is written).

---

## I

### Interpolation
Calculating values between two points. In animation, it creates smooth transitions.

**Example**: Interpolating opacity from 0 to 1 over 30 frames makes something fade in smoothly.

---

## J

### JavaScript (JS)
A programming language originally for web browsers, now also used for servers (Node.js). This project uses JavaScript for the WhatsApp bot.

### JSON (JavaScript Object Notation)
A text format for storing structured data. Used in package.json, settings.json, etc.

**Example**:
```json
{
    "name": "example",
    "version": "1.0.0"
}
```

### JSX
A syntax that lets you write HTML-like code in JavaScript. Used in React components.

**Example**:
```jsx
<h1 style={{ color: 'white' }}>Hello</h1>
```

---

## L

### Library
Pre-written code you can use in your project. Saves you from writing everything yourself.

**Example**: `whatsapp-web.js` is a library for connecting to WhatsApp.

### Lip-sync
Making a character's mouth movements match spoken audio. OmniHuman does this for avatar videos.

---

## M

### Markdown
A simple text format for creating formatted documents. Files end in `.md`.

**Example**:
```markdown
# Heading
**bold** and *italic*
- bullet point
```

### MCP (Model Context Protocol)
A way for Claude to interact with external tools like browsers. The Chrome extension uses MCP.

### Module
A file containing code that can be imported into other files. Helps organize large projects.

---

## N

### Node.js
A program that runs JavaScript outside of web browsers. Allows JavaScript to be used for servers and desktop apps.

### npm (Node Package Manager)
A tool for installing and managing JavaScript libraries. Comes with Node.js.

**Commands**:
- `npm install` - install dependencies
- `npm start` - run the project

---

## O

### OmniHuman
An AI model by fal.ai that creates lip-synced avatar videos from an image and audio file.

---

## P

### Package
A bundle of code that you can install and use. Same as a "library" or "module".

### package.json
A file that describes a Node.js project - its name, dependencies, scripts, etc.

### PATH
A system setting that tells your computer where to find programs. When you type `node`, your computer looks in PATH to find the Node.js program.

### pip
Python's package manager. Like npm for Python.

**Command**: `pip install package-name`

### Process
A running program. When you start the bot, it becomes a process on your computer.

### Promise
A JavaScript object representing an operation that will complete in the future. Used for async operations.

### Props (Properties)
Data passed to a React/Remotion component. Like function parameters.

**Example**: `<Video title="Hello" />` - "Hello" is a prop

### Puppeteer
A Node.js library that controls Chrome browser programmatically. The WhatsApp bot uses it.

### Python
A programming language used for the avatar video pipeline in this project.

---

## Q

### QR Code
A square barcode that stores information. Used to link your phone to the WhatsApp bot.

---

## R

### React
A JavaScript library for building user interfaces. Remotion uses React for creating video compositions.

### Remotion
A framework for creating videos using React. Videos are code - you write components that render each frame.

### Repository (Repo)
A project folder managed by Git. Contains all code and history.

### REST API
A common type of web API that uses HTTP methods (GET, POST, etc.) to communicate.

---

## S

### SDK (Software Development Kit)
A collection of tools and libraries for using a service. OpenAI's SDK makes it easy to use their API.

### Shell
A program that runs commands. Bash is a shell. The terminal is where you interact with the shell.

### Skill (Claude Code)
A set of instructions that tells Claude how to perform a specific task. Stored in SKILL.md files.

### spawn
A Node.js function that starts a new process. The bot uses it to run Claude Code.

### Spring Animation
A physics-based animation that acts like a spring - bouncy and natural-looking. Used in Remotion.

---

## T

### Terminal
An application for typing commands. Also called "console" or "command prompt".

### Thread (Twitter)
A series of connected tweets, where each tweet replies to the previous one.

### TTS (Text-to-Speech)
Converting written text into spoken audio. OpenAI provides TTS voices.

### TypeScript (TS)
JavaScript with added types. Helps catch errors before running code.

**Example**:
```typescript
function greet(name: string): string {  // types specified
    return `Hello, ${name}`;
}
```

---

## U

### URL (Uniform Resource Locator)
A web address. `https://twitter.com` is a URL.

### useCurrentFrame
A Remotion hook that returns the current frame number (0, 1, 2, ...). Used for animations.

---

## V

### Variable
A named storage location for data in a program.

**JavaScript**: `const name = "Claude";`
**Python**: `name = "Claude"`

### Voice (TTS)
A character preset for text-to-speech. Each voice sounds different (nova, onyx, echo, etc.).

---

## W

### WebSocket
A technology for real-time communication between programs. WhatsApp Web uses WebSockets.

### Whisper
An AI model by OpenAI that transcribes audio to text. Used in video-understanding skill.

---

## Y

### YAML
A text format for configuration files. Used in skill SKILL.md frontmatter.

**Example**:
```yaml
name: my-skill
description: What it does
```

### yt-dlp
A command-line tool for downloading videos from YouTube and other sites.

---

## Quick Reference by Category

### Languages
- **JavaScript/JS** - Main language for bot and TTS
- **TypeScript/TS** - JavaScript with types (Remotion)
- **Python** - Avatar pipeline
- **JSX** - HTML-like syntax in React

### Tools
- **npm** - Node.js package manager
- **pip** - Python package manager
- **Git** - Version control
- **FFmpeg** - Video/audio processing
- **yt-dlp** - Video downloading

### Frameworks
- **Node.js** - JavaScript runtime
- **React** - UI components
- **Remotion** - Video generation

### Services
- **OpenAI** - TTS and AI
- **fal.ai** - Avatar generation
- **WhatsApp Web** - Messaging

### Concepts
- **API** - Program communication
- **async/await** - Non-blocking operations
- **Event-driven** - Respond to events
- **Headless** - No visible UI
