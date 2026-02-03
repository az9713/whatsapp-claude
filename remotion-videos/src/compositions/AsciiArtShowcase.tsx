import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";

interface AsciiArtShowcaseProps {
  title?: string;
  subtitle?: string;
}

// ASCII art pieces to showcase
const ASCII_ART = {
  cat: `
  /\\_/\\
 ( o.o )
  > ^ <
 /|   |\\
(_|   |_)`,
  rocket: `
    /\\
   /  \\
  |    |
  |    |
  |    |
 /|    |\\
/_|____|_\\
  /_\\/_\\`,
  heart: `
  .:::.   .:::.
 :::::::.:::::::
 :::::::::::::::
 ':::::::::::::'
   ':::::::::'
     ':::::'
       ':'`,
  computer: `
 .-------------------.
 |  .-------------.  |
 |  |    ASCII    |  |
 |  |     ART     |  |
 |  '-------------'  |
 '------------------'
       /""""""""\\
      / ________ \\`,
  wave: `
~^~^~^~^~^~^~^~^~^~^
^~^~^~^~^~^~^~^~^~^~
~^~^~^~^~^~^~^~^~^~^`,
};

const ASCII_FACTS = [
  "ASCII art dates back to the 1960s",
  "Used 95 printable characters",
  "Popular in early email & BBS systems",
  "Still used in code comments today",
];

export const AsciiArtShowcase: React.FC<AsciiArtShowcaseProps> = ({
  title = "The Art of ASCII",
  subtitle = "When Characters Become Art",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase timings
  const introEnd = 90; // 3 seconds
  const galleryStart = 90;
  const galleryEnd = 540; // 18 seconds total for gallery
  const factsStart = 540;
  const factsEnd = 720;
  const outroStart = 720;

  // Intro animations
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Matrix rain effect for background
  const matrixChars = "01アイウエオカキクケコサシスセソタチツテト";
  const columns = 40;
  const rows = 20;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        fontFamily: "'Fira Code', 'Courier New', monospace",
        overflow: "hidden",
      }}
    >
      {/* Matrix rain background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          fontSize: 20,
          color: "#00ff00",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          lineHeight: 1.2,
        }}
      >
        {Array.from({ length: columns * rows }).map((_, i) => {
          const col = i % columns;
          const row = Math.floor(i / columns);
          const offset = (frame * 2 + col * 7 + row * 3) % 100;
          const charIndex = Math.floor(offset) % matrixChars.length;
          const opacity = interpolate(offset, [0, 50, 100], [0.3, 1, 0.3]);
          return (
            <span
              key={i}
              style={{
                opacity,
                transform: `translateY(${(frame * 0.5 + col * 10) % 50}px)`,
              }}
            >
              {matrixChars[charIndex]}
            </span>
          );
        })}
      </div>

      {/* Intro Sequence */}
      <Sequence from={0} durationInFrames={introEnd}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Decorative ASCII border */}
          <div
            style={{
              fontSize: 24,
              color: "#00ff88",
              opacity: interpolate(frame, [0, 20], [0, 0.6]),
              marginBottom: 20,
            }}
          >
            ╔══════════════════════════════════════════╗
          </div>

          {/* Main title */}
          <h1
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              transform: `scale(${titleSpring})`,
              textShadow: "0 0 40px rgba(0,255,136,0.5), 0 0 80px rgba(0,255,136,0.3)",
              letterSpacing: 8,
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 36,
              color: "#00ff88",
              margin: "30px 0",
              opacity: subtitleOpacity,
              fontStyle: "italic",
            }}
          >
            {subtitle}
          </p>

          {/* Bottom border */}
          <div
            style={{
              fontSize: 24,
              color: "#00ff88",
              opacity: interpolate(frame, [0, 20], [0, 0.6]),
              marginTop: 20,
            }}
          >
            ╚══════════════════════════════════════════╝
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ASCII Art Gallery */}
      <Sequence from={galleryStart} durationInFrames={galleryEnd - galleryStart}>
        <AsciiGallery frame={frame - galleryStart} fps={fps} />
      </Sequence>

      {/* Facts Sequence */}
      <Sequence from={factsStart} durationInFrames={factsEnd - factsStart}>
        <FactsSequence frame={frame - factsStart} fps={fps} facts={ASCII_FACTS} />
      </Sequence>

      {/* Outro */}
      <Sequence from={outroStart} durationInFrames={durationInFrames - outroStart}>
        <OutroSequence frame={frame - outroStart} fps={fps} />
      </Sequence>

      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* CRT vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// Gallery component showing ASCII art pieces
const AsciiGallery: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const artPieces = Object.entries(ASCII_ART);
  const pieceDuration = 90; // 3 seconds per piece

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {artPieces.map(([name, art], index) => {
        const pieceStart = index * pieceDuration;
        const pieceEnd = pieceStart + pieceDuration;
        const isActive = frame >= pieceStart && frame < pieceEnd;
        const localFrame = frame - pieceStart;

        if (!isActive) return null;

        const scale = spring({
          frame: localFrame,
          fps,
          config: { damping: 15, stiffness: 100 },
        });

        const opacity = interpolate(
          localFrame,
          [0, 15, pieceDuration - 15, pieceDuration],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Typewriter effect for ASCII art
        const artLines = art.trim().split("\n");
        const totalChars = art.length;
        const charsToShow = Math.floor(
          interpolate(localFrame, [0, 45], [0, totalChars], {
            extrapolateRight: "clamp",
          })
        );

        let charCount = 0;
        const visibleArt = artLines
          .map((line) => {
            const lineStart = charCount;
            charCount += line.length + 1;
            if (charsToShow <= lineStart) return "";
            if (charsToShow >= charCount) return line;
            return line.substring(0, charsToShow - lineStart);
          })
          .join("\n");

        return (
          <div
            key={name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            {/* Art label */}
            <div
              style={{
                fontSize: 28,
                color: "#00ff88",
                marginBottom: 30,
                textTransform: "uppercase",
                letterSpacing: 6,
                opacity: interpolate(localFrame, [30, 45], [0, 1]),
              }}
            >
              ── {name.toUpperCase()} ──
            </div>

            {/* ASCII art display */}
            <pre
              style={{
                fontSize: 48,
                lineHeight: 1.1,
                color: "#fff",
                textShadow: "0 0 20px rgba(0,255,136,0.8), 0 0 40px rgba(0,255,136,0.4)",
                margin: 0,
                padding: 40,
                background: "rgba(0,0,0,0.5)",
                borderRadius: 20,
                border: "2px solid rgba(0,255,136,0.3)",
              }}
            >
              {visibleArt}
              <span
                style={{
                  opacity: Math.sin(localFrame * 0.3) > 0 ? 1 : 0,
                  color: "#00ff88",
                }}
              >
                █
              </span>
            </pre>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Facts sequence component
const FactsSequence: React.FC<{ frame: number; fps: number; facts: string[] }> = ({
  frame,
  fps,
  facts,
}) => {
  const factDuration = 45; // 1.5 seconds per fact

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 48,
          color: "#00ff88",
          marginBottom: 60,
          letterSpacing: 4,
        }}
      >
        ▓▓ FUN FACTS ▓▓
      </div>

      {facts.map((fact, index) => {
        const factStart = index * factDuration;
        const localFrame = frame - factStart;
        const isActive = localFrame >= 0;

        const slideIn = spring({
          frame: Math.max(0, localFrame),
          fps,
          config: { damping: 15, stiffness: 80 },
        });

        const opacity = interpolate(localFrame, [-10, 0, factDuration], [0, 1, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={index}
            style={{
              fontSize: 36,
              color: "#fff",
              marginBottom: 25,
              opacity: isActive ? opacity : 0,
              transform: `translateX(${(1 - slideIn) * 100}px)`,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span style={{ color: "#00ff88" }}>►</span>
            {fact}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Outro component
const OutroSequence: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const glowPulse = Math.sin(frame * 0.15) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <pre
        style={{
          fontSize: 36,
          color: "#00ff88",
          textShadow: `0 0 ${20 * glowPulse}px rgba(0,255,136,0.8)`,
          transform: `scale(${scale})`,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {`
╔═══════════════════════════════════╗
║                                   ║
║   ████████╗██╗  ██╗███████╗       ║
║   ╚══██╔══╝██║  ██║██╔════╝       ║
║      ██║   ███████║█████╗         ║
║      ██║   ██╔══██║██╔══╝         ║
║      ██║   ██║  ██║███████╗       ║
║      ╚═╝   ╚═╝  ╚═╝╚══════╝       ║
║                                   ║
║   ███████╗███╗   ██╗██████╗       ║
║   ██╔════╝████╗  ██║██╔══██╗      ║
║   █████╗  ██╔██╗ ██║██║  ██║      ║
║   ██╔══╝  ██║╚██╗██║██║  ██║      ║
║   ███████╗██║ ╚████║██████╔╝      ║
║   ╚══════╝╚═╝  ╚═══╝╚═════╝       ║
║                                   ║
╚═══════════════════════════════════╝
        `}
      </pre>

      <p
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          marginTop: 40,
          opacity: interpolate(frame, [30, 60], [0, 1]),
        }}
      >
        Created with Remotion
      </p>
    </AbsoluteFill>
  );
};
