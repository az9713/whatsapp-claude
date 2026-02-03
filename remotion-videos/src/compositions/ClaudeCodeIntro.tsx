import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface ClaudeCodeIntroProps {
  title: string;
  subtitle: string;
}

export const ClaudeCodeIntro: React.FC<ClaudeCodeIntroProps> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo/title spring animation
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [30, 60], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Background gradient animation
  const gradientAngle = interpolate(frame, [0, 210], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, #1a1a2e, #16213e, #0f3460)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated background particles */}
      {[...Array(20)].map((_, i) => {
        const particleX = interpolate(
          frame,
          [0, 210],
          [Math.random() * 1920, Math.random() * 1920]
        );
        const particleY = interpolate(
          frame,
          [0, 210],
          [1080 + 50, -50]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: particleX,
              top: particleY + i * 50,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`,
            }}
          />
        );
      })}

      {/* Main title */}
      <h1
        style={{
          fontSize: 120,
          fontWeight: 800,
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          transform: `scale(${titleSpring})`,
          textShadow: "0 4px 30px rgba(255,255,255,0.3)",
          margin: 0,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 40,
          color: "rgba(255,255,255,0.8)",
          fontFamily: "Inter, sans-serif",
          marginTop: 20,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        {subtitle}
      </p>

      {/* Glowing accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          width: interpolate(frame, [60, 120], [0, 400], {
            extrapolateRight: "clamp",
          }),
          height: 4,
          background: "linear-gradient(90deg, #00d4ff, #7b2ff7)",
          borderRadius: 2,
          boxShadow: "0 0 20px #00d4ff",
        }}
      />
    </AbsoluteFill>
  );
};
