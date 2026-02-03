import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";

interface NewsVideoProps {
  headline: string;
  story: string;
  source: string;
}

export const NewsVideo: React.FC<NewsVideoProps> = ({
  headline,
  story,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Break story into segments for pacing
  const sentences = story.split(/(?<=[.!?])\s+/);
  const framesPerSentence = Math.floor((durationInFrames - 180) / sentences.length);

  const currentSentenceIndex = Math.min(
    Math.floor((frame - 90) / framesPerSentence),
    sentences.length - 1
  );

  // Breaking news animation
  const breakingSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  // Headline animation
  const headlineOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Current time display
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "linear-gradient(90deg, #dc2626 0%, #991b1b 100%)",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          justifyContent: "space-between",
          transform: `translateY(${(1 - breakingSpring) * -80}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              color: "#dc2626",
              padding: "8px 20px",
              fontWeight: 800,
              fontSize: 20,
              fontFamily: "Inter, sans-serif",
              borderRadius: 4,
            }}
          >
            BREAKING
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {source}
          </span>
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 24,
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        >
          {timeString}
        </div>
      </div>

      {/* Main content area */}
      <div
        style={{
          position: "absolute",
          top: 80,
          bottom: 160,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          padding: 60,
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.2,
            marginBottom: 60,
            opacity: headlineOpacity,
            transform: `translateY(${(1 - headlineOpacity) * 30}px)`,
          }}
        >
          {headline}
        </h1>

        {/* Story content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 20,
              padding: 50,
              borderLeft: "4px solid #dc2626",
            }}
          >
            {frame >= 90 && currentSentenceIndex >= 0 && (
              <p
                style={{
                  fontSize: 36,
                  color: "#e5e7eb",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {sentences[currentSentenceIndex]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          height: 80,
          background: "#1f1f1f",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
            animation: "none",
            transform: `translateX(${-frame * 2}px)`,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <React.Fragment key={i}>
              <span style={{ color: "#dc2626", fontSize: 24 }}>●</span>
              <span
                style={{
                  color: "#fff",
                  fontSize: 24,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {headline}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Source logo area */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            📰
          </div>
          <span
            style={{
              color: "#9ca3af",
              fontSize: 18,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Powered by AI
          </span>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {sentences.map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background:
                  i <= currentSentenceIndex ? "#dc2626" : "rgba(255,255,255,0.2)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
