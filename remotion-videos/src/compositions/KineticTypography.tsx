import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface KineticTypographyProps {
  quote: string;
  author: string;
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  quote,
  author,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const words = quote.split(" ");
  const framesPerWord = Math.floor((durationInFrames - 60) / words.length);

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 100,
      }}
    >
      {/* Quote */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          maxWidth: 1400,
        }}
      >
        {words.map((word, index) => {
          const wordStart = index * framesPerWord;
          const wordSpring = spring({
            frame: frame - wordStart,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const wordOpacity = interpolate(
            frame - wordStart,
            [0, 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Highlight effect for key words
          const isKeyWord = ["future", "software", "here"].some((key) =>
            word.toLowerCase().includes(key)
          );

          return (
            <span
              key={index}
              style={{
                fontSize: 72,
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                color: isKeyWord ? "#00d4ff" : "#fff",
                opacity: wordOpacity,
                transform: `scale(${wordSpring}) translateY(${(1 - wordSpring) * 30}px)`,
                textShadow: isKeyWord ? "0 0 30px rgba(0,212,255,0.5)" : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Author */}
      <div
        style={{
          marginTop: 80,
          fontSize: 36,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "Inter, sans-serif",
          opacity: interpolate(
            frame,
            [durationInFrames - 60, durationInFrames - 30],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ),
        }}
      >
        — {author}
      </div>

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          fontSize: 200,
          color: "rgba(255,255,255,0.03)",
          fontFamily: "Georgia, serif",
        }}
      >
        "
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 80,
          fontSize: 200,
          color: "rgba(255,255,255,0.03)",
          fontFamily: "Georgia, serif",
          transform: "rotate(180deg)",
        }}
      >
        "
      </div>
    </AbsoluteFill>
  );
};
