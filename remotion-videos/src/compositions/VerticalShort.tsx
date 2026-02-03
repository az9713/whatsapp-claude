import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface VerticalShortProps {
  title: string;
  content: string;
  caption: string;
}

export const VerticalShort: React.FC<VerticalShortProps> = ({
  title,
  content,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation phases
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Content word animation
  const words = content.split(" ");
  const contentStart = 30;
  const framesPerWord = 6;

  // Caption fade in at end
  const captionOpacity = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames - 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background gradient animation
  const gradientProgress = frame / durationInFrames;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${180 + gradientProgress * 30}deg, #0f0f23 0%, #1a1a3e 50%, #2d1b4e 100%)`,
        display: "flex",
        flexDirection: "column",
        padding: 60,
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Title */}
      <div
        style={{
          marginTop: 100,
          marginBottom: 80,
          transform: `scale(${titleSpring}) translateY(${(1 - titleSpring) * 30}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
            textShadow: "0 4px 30px rgba(139,92,246,0.5)",
            margin: 0,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            width: 100,
            height: 6,
            background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
            borderRadius: 3,
            margin: "30px auto 0",
          }}
        />
      </div>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 30,
            padding: 50,
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 16,
              lineHeight: 1.6,
            }}
          >
            {words.map((word, i) => {
              const wordStart = contentStart + i * framesPerWord;
              const wordSpring = spring({
                frame: frame - wordStart,
                fps,
                config: { damping: 15, stiffness: 100 },
              });

              return (
                <span
                  key={i}
                  style={{
                    fontSize: 48,
                    fontWeight: 600,
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    opacity: wordSpring,
                    transform: `translateY(${(1 - wordSpring) * 30}px) scale(${wordSpring})`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Caption / CTA */}
      <div
        style={{
          marginBottom: 120,
          textAlign: "center",
          opacity: captionOpacity,
        }}
      >
        <p
          style={{
            fontSize: 36,
            color: "#a5b4fc",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          }}
        >
          {caption}
        </p>
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 60,
          right: 60,
          display: "flex",
          gap: 8,
        }}
      >
        {[...Array(5)].map((_, i) => {
          const segmentProgress = (frame / durationInFrames) * 5;
          const isActive = i < segmentProgress;
          const isCurrent = i === Math.floor(segmentProgress);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: isActive
                  ? "linear-gradient(90deg, #8b5cf6, #3b82f6)"
                  : "rgba(255,255,255,0.2)",
                overflow: "hidden",
              }}
            >
              {isCurrent && (
                <div
                  style={{
                    width: `${(segmentProgress % 1) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
