import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface ProductShowcaseProps {
  title: string;
  features: string[];
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title,
  features,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 100,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Left side - Title */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            opacity: interpolate(frame, [0, 20], [0, 1]),
            transform: `translateX(${interpolate(frame, [0, 20], [-50, 0])}px)`,
          }}
        >
          {title}
        </h1>
      </div>

      {/* Right side - Features */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        {features.map((feature, index) => {
          const delay = 30 + index * 20;
          const featureSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 80 },
          });

          const checkProgress = interpolate(
            frame - delay - 10,
            [0, 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: featureSpring,
                transform: `translateX(${(1 - featureSpring) * 100}px)`,
              }}
            >
              {/* Checkmark */}
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{
                    opacity: checkProgress,
                    transform: `scale(${checkProgress})`,
                  }}
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    fill="#4ade80"
                  />
                </svg>
              </div>

              {/* Feature text */}
              <span
                style={{
                  fontSize: 36,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                }}
              >
                {feature}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
