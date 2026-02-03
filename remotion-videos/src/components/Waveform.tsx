import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface WaveformProps {
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  minHeight?: number;
  maxHeight?: number;
  color?: string;
  gradientColors?: [string, string];
  style?: React.CSSProperties;
  animated?: boolean;
  animationSpeed?: number;
}

export const Waveform: React.FC<WaveformProps> = ({
  barCount = 40,
  barWidth = 6,
  barGap = 3,
  minHeight = 10,
  maxHeight = 100,
  color,
  gradientColors = ["#667eea", "#764ba2"],
  style,
  animated = true,
  animationSpeed = 0.1,
}) => {
  const frame = useCurrentFrame();

  // Generate bar heights with pseudo-random but animated pattern
  const bars = [...Array(barCount)].map((_, i) => {
    // Base pattern from position
    const basePattern = Math.sin(i * 0.3) * 0.5 + 0.5;

    // Animation offset
    const animOffset = animated
      ? Math.sin(i * 0.2 + frame * animationSpeed) * 0.3
      : 0;

    // Secondary wave for complexity
    const secondaryWave = Math.sin(i * 0.7 + frame * animationSpeed * 0.5) * 0.2;

    // Combine and clamp
    const heightRatio = Math.max(0.1, Math.min(1, basePattern + animOffset + secondaryWave));

    return minHeight + heightRatio * (maxHeight - minHeight);
  });

  // Calculate total width
  const totalWidth = barCount * barWidth + (barCount - 1) * barGap;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: barGap,
        height: maxHeight,
        ...style,
      }}
    >
      {bars.map((height, i) => {
        // Fade in animation for initial appearance
        const fadeIn = interpolate(frame - i * 0.5, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Calculate color position for gradient
        const colorPosition = i / (barCount - 1);

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: height * fadeIn,
              borderRadius: barWidth / 2,
              background: color
                ? color
                : `linear-gradient(180deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
              opacity: 0.7 + (height / maxHeight) * 0.3,
              transition: animated ? "height 0.1s ease" : "none",
            }}
          />
        );
      })}
    </div>
  );
};

// Circular waveform variant
interface CircularWaveformProps {
  radius?: number;
  barCount?: number;
  barWidth?: number;
  minBarHeight?: number;
  maxBarHeight?: number;
  color?: string;
  animated?: boolean;
}

export const CircularWaveform: React.FC<CircularWaveformProps> = ({
  radius = 100,
  barCount = 32,
  barWidth = 4,
  minBarHeight = 10,
  maxBarHeight = 40,
  color = "#667eea",
  animated = true,
}) => {
  const frame = useCurrentFrame();

  const bars = [...Array(barCount)].map((_, i) => {
    const angle = (i / barCount) * Math.PI * 2;

    // Height calculation
    const baseHeight = Math.sin(i * 0.5) * 0.5 + 0.5;
    const animOffset = animated ? Math.sin(i * 0.3 + frame * 0.1) * 0.3 : 0;
    const height = minBarHeight + (baseHeight + animOffset) * (maxBarHeight - minBarHeight);

    // Position calculation
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return { angle, height, x, y };
  });

  const size = (radius + maxBarHeight) * 2 + 20;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: barWidth,
            height: bar.height,
            background: color,
            borderRadius: barWidth / 2,
            transformOrigin: "center bottom",
            transform: `
              translate(-50%, -100%)
              rotate(${bar.angle + Math.PI / 2}rad)
              translateY(${-radius}px)
            `,
          }}
        />
      ))}
    </div>
  );
};
