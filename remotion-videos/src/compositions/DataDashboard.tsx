import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface Stat {
  label: string;
  value: number;
}

interface DataDashboardProps {
  stats: Stat[];
}

export const DataDashboard: React.FC<DataDashboardProps> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)",
        padding: 80,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontSize: 64,
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          marginBottom: 60,
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        Dashboard
      </h1>

      {/* Stats grid */}
      <div
        style={{
          display: "flex",
          gap: 40,
          flex: 1,
        }}
      >
        {stats.map((stat, index) => {
          const delay = index * 15;
          const cardSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 80 },
          });

          // Animated counter
          const countProgress = interpolate(
            frame - delay - 20,
            [0, 60],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const displayValue = Math.floor(stat.value * countProgress);

          return (
            <div
              key={stat.label}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 24,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transform: `scale(${cardSpring}) translateY(${(1 - cardSpring) * 50}px)`,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Value */}
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 800,
                  color: "#00d4ff",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {displayValue.toLocaleString()}
                {stat.label === "Growth" && "%"}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 28,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Inter, sans-serif",
                  marginTop: 16,
                }}
              >
                {stat.label}
              </div>

              {/* Animated bar */}
              <div
                style={{
                  width: "100%",
                  height: 8,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  marginTop: 24,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${countProgress * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #00d4ff, #7b2ff7)",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
