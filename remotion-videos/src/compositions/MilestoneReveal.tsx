import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";

interface Milestone {
  label: string;
  value: string | number;
  icon?: string;
}

interface MilestoneRevealProps {
  title: string;
  milestones: Milestone[];
  celebrationText?: string;
}

export const MilestoneReveal: React.FC<MilestoneRevealProps> = ({
  title,
  milestones,
  celebrationText = "What a journey!",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title animation
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate timing for milestones
  const milestonesStart = 45;
  const framesPerMilestone = Math.floor(
    (durationInFrames - milestonesStart - 90) / milestones.length
  );

  // Celebration text at the end
  const celebrationStart = durationInFrames - 90;
  const celebrationOpacity = interpolate(
    frame,
    [celebrationStart, celebrationStart + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const celebrationScale = spring({
    frame: frame - celebrationStart,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // Background particles
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const speed = 0.5 + (i % 3) * 0.3;
    const radius = 200 + Math.sin(frame * 0.02 + i) * 50;
    const x = Math.cos(angle + frame * 0.005 * speed) * radius;
    const y = Math.sin(angle + frame * 0.005 * speed) * radius;
    const size = 4 + (i % 4) * 2;
    const opacity = 0.1 + (i % 3) * 0.1;

    return { x, y, size, opacity, hue: (i * 18 + frame * 0.5) % 360 };
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated background particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `hsla(${p.hue}, 70%, 60%, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 2}px hsla(${p.hue}, 70%, 60%, 0.3)`,
          }}
        />
      ))}

      {/* Radial glow behind content */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "Inter, sans-serif",
            color: "#fff",
            textAlign: "center",
            margin: 0,
            textShadow: "0 4px 30px rgba(99,102,241,0.5)",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            width: interpolate(frame, [20, 50], [0, 200], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
            height: 4,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
            borderRadius: 2,
            margin: "20px auto 0",
          }}
        />
      </div>

      {/* Milestones grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 40,
          maxWidth: 1400,
          padding: "0 60px",
          marginTop: 60,
        }}
      >
        {milestones.map((milestone, index) => {
          const milestoneStart = milestonesStart + index * framesPerMilestone;

          const cardSpring = spring({
            frame: frame - milestoneStart,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const cardOpacity = interpolate(
            frame - milestoneStart,
            [0, 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Number counting animation
          const countProgress = interpolate(
            frame - milestoneStart,
            [0, 40],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
          );

          const displayValue =
            typeof milestone.value === "number"
              ? Math.floor(milestone.value * countProgress).toLocaleString()
              : milestone.value;

          // Shimmer effect
          const shimmerX = interpolate(
            (frame - milestoneStart) % 60,
            [0, 60],
            [-100, 400],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={index}
              style={{
                opacity: cardOpacity,
                transform: `scale(${cardSpring}) translateY(${(1 - cardSpring) * 40}px)`,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 24,
                padding: "40px 50px",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                minWidth: 280,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Shimmer overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: shimmerX,
                  width: 100,
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  transform: "skewX(-20deg)",
                  pointerEvents: "none",
                }}
              />

              {/* Icon */}
              {milestone.icon && (
                <div
                  style={{
                    fontSize: 48,
                    marginBottom: 16,
                  }}
                >
                  {milestone.icon}
                </div>
              )}

              {/* Value */}
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  fontFamily: "Inter, sans-serif",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 12,
                }}
              >
                {displayValue}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {milestone.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: celebrationOpacity,
          transform: `scale(${Math.max(0, celebrationScale)})`,
        }}
      >
        <p
          style={{
            fontSize: 42,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            color: "#a5b4fc",
            textAlign: "center",
            margin: 0,
          }}
        >
          {celebrationText}
        </p>
      </div>

      {/* Corner decorations */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 60,
          height: 60,
          borderTop: "3px solid rgba(99,102,241,0.5)",
          borderLeft: "3px solid rgba(99,102,241,0.5)",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          width: 60,
          height: 60,
          borderTop: "3px solid rgba(99,102,241,0.5)",
          borderRight: "3px solid rgba(99,102,241,0.5)",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          width: 60,
          height: 60,
          borderBottom: "3px solid rgba(99,102,241,0.5)",
          borderLeft: "3px solid rgba(99,102,241,0.5)",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          width: 60,
          height: 60,
          borderBottom: "3px solid rgba(99,102,241,0.5)",
          borderRight: "3px solid rgba(99,102,241,0.5)",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
