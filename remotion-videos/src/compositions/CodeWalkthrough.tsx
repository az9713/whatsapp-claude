import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface CodeWalkthroughProps {
  code: string;
  language: string;
}

export const CodeWalkthrough: React.FC<CodeWalkthroughProps> = ({
  code,
  language,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const lines = code.split("\n");
  const charsPerFrame = code.length / (durationInFrames - 60);
  const visibleChars = Math.floor(frame * charsPerFrame);

  // Build visible code with typewriter effect
  let charCount = 0;
  const visibleLines = lines.map((line) => {
    const lineStart = charCount;
    charCount += line.length + 1; // +1 for newline
    const lineEnd = charCount;

    if (visibleChars < lineStart) return "";
    if (visibleChars >= lineEnd) return line;
    return line.substring(0, visibleChars - lineStart);
  });

  // Simple syntax highlighting
  const highlight = (text: string): React.ReactNode[] => {
    const patterns = [
      { regex: /(function|const|let|var|return|async|await|if|else|for|while)/g, color: "#c678dd" },
      { regex: /(".*?"|'.*?'|`.*?`)/g, color: "#98c379" },
      { regex: /(\d+)/g, color: "#d19a66" },
      { regex: /(\/\/.*$)/gm, color: "#5c6370" },
      { regex: /(\(|\)|\{|\}|\[|\])/g, color: "#abb2bf" },
    ];

    let result = text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Simple tokenization
    const tokens: { text: string; color: string; index: number }[] = [];

    patterns.forEach(({ regex, color }) => {
      let match;
      const r = new RegExp(regex);
      const testStr = text;
      let tempStr = testStr;
      let offset = 0;

      while ((match = r.exec(tempStr)) !== null) {
        tokens.push({
          text: match[0],
          color,
          index: match.index + offset,
        });
        offset += match.index + match[0].length;
        tempStr = tempStr.substring(match.index + match[0].length);
      }
    });

    // Sort by index and render
    tokens.sort((a, b) => a.index - b.index);

    if (tokens.length === 0) {
      return [text];
    }

    tokens.forEach((token, i) => {
      if (token.index > lastIndex) {
        elements.push(text.substring(lastIndex, token.index));
      }
      elements.push(
        <span key={i} style={{ color: token.color }}>
          {token.text}
        </span>
      );
      lastIndex = token.index + token.text.length;
    });

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements;
  };

  // Cursor blink
  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        background: "#282c34",
        padding: 60,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Window header */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          opacity: interpolate(frame, [0, 15], [0, 1]),
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#ff5f56",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#ffbd2e",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#27c93f",
          }}
        />
        <span
          style={{
            marginLeft: 20,
            color: "#5c6370",
            fontSize: 14,
            fontFamily: "monospace",
          }}
        >
          {language}
        </span>
      </div>

      {/* Code area */}
      <div
        style={{
          flex: 1,
          background: "#1e2127",
          borderRadius: 12,
          padding: 40,
          fontFamily: "'Fira Code', monospace",
          fontSize: 28,
          lineHeight: 1.6,
          color: "#abb2bf",
          overflow: "hidden",
        }}
      >
        <pre style={{ margin: 0 }}>
          {visibleLines.map((line, i) => (
            <div key={i} style={{ minHeight: "1.6em" }}>
              <span style={{ color: "#5c6370", marginRight: 30 }}>
                {String(i + 1).padStart(2, " ")}
              </span>
              {highlight(line)}
              {i === visibleLines.length - 1 &&
                line.length < lines[i].length && (
                  <span
                    style={{
                      background: "#528bff",
                      opacity: cursorOpacity,
                    }}
                  >
                    {" "}
                  </span>
                )}
            </div>
          ))}
        </pre>
      </div>
    </AbsoluteFill>
  );
};
