import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface CountdownTimerProps {
  countFrom: number;
  endText: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  countFrom,
  endText,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const framesPerNumber = Math.floor((durationInFrames - 60) / (countFrom + 1));

  // Determine current number
  const currentIndex = Math.floor(frame / framesPerNumber);
  const isEndText = currentIndex >= countFrom;
  const displayNumber = isEndText ? endText : String(countFrom - currentIndex);

  // Animation within each number
  const frameInSegment = frame % framesPerNumber;
  const numberSpring = spring({
    frame: frameInSegment,
    fps,
    config: { damping: 8, stiffness: 120 },
  });

  // Exit animation
  const exitProgress = interpolate(
    frameInSegment,
    [framesPerNumber - 15, framesPerNumber],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background pulse
  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.02;

  // Color based on number
  const colors: Record<string, string> = {
    "3": "#ff6b6b",
    "2": "#feca57",
    "1": "#48dbfb",
    [endText]: "#1dd1a1",
  };
  const color = colors[displayNumber] || "#fff";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${color}22 0%, #0a0a0a 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${pulseScale})`,
      }}
    >
      {/* Ripple effect */}
      {[...Array(3)].map((_, i) => {
        const rippleProgress = interpolate(
          (frameInSegment + i * 10) % 30,
          [0, 30],
          [0, 1]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 200 + rippleProgress * 400,
              height: 200 + rippleProgress * 400,
              borderRadius: "50%",
              border: `2px solid ${color}`,
              opacity: 1 - rippleProgress,
            }}
          />
        );
      })}

      {/* Main number/text */}
      <div
        style={{
          fontSize: isEndText ? 200 : 400,
          fontWeight: 900,
          color: color,
          fontFamily: "Inter, sans-serif",
          transform: `scale(${numberSpring * (1 - exitProgress * 0.5)}) rotate(${exitProgress * 15}deg)`,
          opacity: 1 - exitProgress * 0.8,
          textShadow: `0 0 100px ${color}`,
        }}
      >
        {displayNumber}
      </div>

      {/* Particles on GO */}
      {isEndText &&
        [...Array(30)].map((_, i) => {
          const angle = (i / 30) * Math.PI * 2;
          const distance = interpolate(frameInSegment, [0, 30], [0, 500]);
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: color,
                transform: `translate(${x}px, ${y}px)`,
                opacity: 1 - frameInSegment / 60,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
