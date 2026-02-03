import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface CodeExplainerProps {
  code: string;
  language: string;
  explanation: string;
}

export const CodeExplainer: React.FC<CodeExplainerProps> = ({
  code,
  language,
  explanation,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const lines = code.split("\n");
  const framesPerLine = Math.floor((durationInFrames - 120) / lines.length);

  // Current highlighted line
  const currentLine = Math.min(
    Math.floor((frame - 60) / framesPerLine),
    lines.length - 1
  );

  // Simple syntax highlighting
  const highlightCode = (text: string): React.ReactNode => {
    const keywords = ["function", "const", "let", "var", "return", "async", "await", "if", "else", "for", "while", "class", "import", "export", "from"];
    const parts = text.split(/(\s+)/);

    return parts.map((part, i) => {
      if (keywords.includes(part)) {
        return <span key={i} style={{ color: "#c678dd" }}>{part}</span>;
      }
      if (part.match(/^["'`].*["'`]$/)) {
        return <span key={i} style={{ color: "#98c379" }}>{part}</span>;
      }
      if (part.match(/^\d+$/)) {
        return <span key={i} style={{ color: "#d19a66" }}>{part}</span>;
      }
      return part;
    });
  };

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
      }}
    >
      {/* Code panel (left) */}
      <div
        style={{
          flex: 1.2,
          padding: 60,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 30,
            opacity: interpolate(frame, [0, 20], [0, 1]),
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
          <span style={{ marginLeft: 16, color: "#6b7280", fontSize: 16 }}>{language}</span>
        </div>

        {/* Code */}
        <div
          style={{
            background: "#0d1117",
            borderRadius: 16,
            padding: 40,
            flex: 1,
            fontFamily: "'Fira Code', monospace",
            fontSize: 24,
            lineHeight: 1.8,
          }}
        >
          {lines.map((line, i) => {
            const isHighlighted = i === currentLine && frame >= 60;
            const lineSpring = spring({
              frame: frame - 60 - i * 3,
              fps,
              config: { damping: 20, stiffness: 100 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  background: isHighlighted ? "rgba(99, 179, 237, 0.15)" : "transparent",
                  borderLeft: isHighlighted ? "3px solid #63b3ed" : "3px solid transparent",
                  padding: "4px 16px",
                  marginLeft: -16,
                  borderRadius: 4,
                  opacity: lineSpring,
                  transform: `translateX(${(1 - lineSpring) * 20}px)`,
                }}
              >
                <span style={{ color: "#4b5563", marginRight: 24, minWidth: 30 }}>
                  {i + 1}
                </span>
                <span style={{ color: "#e5e7eb" }}>
                  {highlightCode(line)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation panel (right) */}
      <div
        style={{
          flex: 0.8,
          padding: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 20,
            padding: 40,
            opacity: interpolate(frame, [30, 60], [0, 1]),
            transform: `translateY(${interpolate(frame, [30, 60], [30, 0])}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 32,
              color: "#63b3ed",
              fontFamily: "Inter, sans-serif",
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            Explanation
          </h2>
          <p
            style={{
              fontSize: 24,
              color: "#e5e7eb",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.6,
            }}
          >
            {explanation}
          </p>

          {/* Line indicator */}
          {frame >= 60 && (
            <div
              style={{
                marginTop: 40,
                padding: 20,
                background: "rgba(99, 179, 237, 0.1)",
                borderRadius: 12,
                borderLeft: "3px solid #63b3ed",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: 16 }}>
                Currently viewing line {currentLine + 1}
              </span>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
