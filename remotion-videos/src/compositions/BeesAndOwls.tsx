import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";

interface BeesAndOwlsProps {
  title?: string;
  beeFacts?: string[];
  owlFacts?: string[];
}

const BeeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
    {/* Bee body */}
    <ellipse cx="50" cy="55" rx="25" ry="20" fill="#FFD700" />
    {/* Stripes */}
    <rect x="30" y="45" width="40" height="6" fill="#1a1a1a" />
    <rect x="30" y="55" width="40" height="6" fill="#1a1a1a" />
    <rect x="30" y="65" width="40" height="6" fill="#1a1a1a" />
    {/* Head */}
    <circle cx="50" cy="30" r="15" fill="#1a1a1a" />
    {/* Eyes */}
    <circle cx="44" cy="28" r="4" fill="#fff" />
    <circle cx="56" cy="28" r="4" fill="#fff" />
    {/* Antennae */}
    <line x1="42" y1="18" x2="35" y2="8" stroke="#1a1a1a" strokeWidth="3" />
    <line x1="58" y1="18" x2="65" y2="8" stroke="#1a1a1a" strokeWidth="3" />
    <circle cx="35" cy="6" r="3" fill="#1a1a1a" />
    <circle cx="65" cy="6" r="3" fill="#1a1a1a" />
    {/* Wings */}
    <ellipse cx="30" cy="45" rx="15" ry="10" fill="rgba(255,255,255,0.6)" />
    <ellipse cx="70" cy="45" rx="15" ry="10" fill="rgba(255,255,255,0.6)" />
    {/* Stinger */}
    <polygon points="50,75 45,85 55,85" fill="#1a1a1a" />
  </svg>
);

const OwlIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
    {/* Owl body */}
    <ellipse cx="50" cy="60" rx="30" ry="35" />
    {/* Ear tufts */}
    <polygon points="25,25 20,5 35,20" />
    <polygon points="75,25 80,5 65,20" />
    {/* Face disc */}
    <circle cx="50" cy="45" r="25" fill="#D4A574" />
    {/* Eyes */}
    <circle cx="40" cy="42" r="12" fill="#FFD700" />
    <circle cx="60" cy="42" r="12" fill="#FFD700" />
    <circle cx="40" cy="42" r="6" fill="#1a1a1a" />
    <circle cx="60" cy="42" r="6" fill="#1a1a1a" />
    {/* Beak */}
    <polygon points="50,50 45,60 55,60" fill="#FF8C00" />
    {/* Chest pattern */}
    <ellipse cx="50" cy="75" rx="15" ry="12" fill="#E8D5B7" />
    {/* Feet */}
    <ellipse cx="40" cy="92" rx="8" ry="4" fill="#FF8C00" />
    <ellipse cx="60" cy="92" rx="8" ry="4" fill="#FF8C00" />
  </svg>
);

const Honeycomb: React.FC<{ x: number; y: number; size: number; opacity: number }> = ({
  x,
  y,
  size,
  opacity,
}) => (
  <svg
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
    }}
    width={size}
    height={size}
    viewBox="0 0 100 100"
  >
    <polygon
      points="50,5 90,25 90,75 50,95 10,75 10,25"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="2"
    />
  </svg>
);

const Star: React.FC<{ x: number; y: number; size: number; opacity: number }> = ({
  x,
  y,
  size,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontSize: size,
      opacity,
    }}
  >
    ✨
  </div>
);

export const BeesAndOwls: React.FC<BeesAndOwlsProps> = ({
  title = "Bees & Owls",
  beeFacts = [
    "Bees can fly up to 15 mph",
    "A single bee produces 1/12 tsp of honey in its lifetime",
    "Bees communicate through dance",
  ],
  owlFacts = [
    "Owls can rotate their heads 270°",
    "Owls have 3 eyelids",
    "Some owls can hear prey under snow",
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate honeycomb pattern
  const honeycombs = Array.from({ length: 8 }, (_, i) => ({
    x: Math.sin(i * 0.9) * 700 + 900,
    y: Math.cos(i * 1.1) * 350 + 500,
    size: 60 + (i % 3) * 20,
  }));

  // Generate stars for night section
  const stars = Array.from({ length: 15 }, (_, i) => ({
    x: Math.random() * 1800 + 60,
    y: Math.random() * 900 + 90,
    size: 20 + Math.random() * 20,
  }));

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #87CEEB 0%, #FFE4B5 30%, #2C1810 70%, #0a0a1a 100%)",
        overflow: "hidden",
      }}
    >
      {/* Animated honeycombs background (visible in bee section) */}
      <Sequence from={90} durationInFrames={180}>
        {honeycombs.map((comb, i) => {
          const combOpacity = interpolate(
            frame - 90 - i * 10,
            [0, 30, 150, 180],
            [0, 0.3, 0.3, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <Honeycomb
              key={i}
              x={comb.x + Math.sin(frame * 0.02 + i) * 15}
              y={comb.y + Math.cos(frame * 0.02 + i) * 15}
              size={comb.size}
              opacity={combOpacity}
            />
          );
        })}
      </Sequence>

      {/* Animated stars background (visible in owl section) */}
      <Sequence from={270} durationInFrames={180}>
        {stars.map((star, i) => {
          const starOpacity = interpolate(
            frame - 270,
            [0, 30, 150, 180],
            [0, 0.4 + Math.sin(frame * 0.1 + i) * 0.2, 0.4 + Math.sin(frame * 0.1 + i) * 0.2, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <Star
              key={i}
              x={star.x}
              y={star.y}
              size={star.size}
              opacity={starOpacity}
            />
          );
        })}
      </Sequence>

      {/* Title sequence */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, #FFE4B5 0%, #87CEEB 50%, #1a1a3e 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 60,
              transform: `scale(${titleProgress})`,
            }}
          >
            <div style={{ transform: `translateX(${(1 - titleProgress) * -100}px)` }}>
              <BeeIcon size={200} color="#FFD700" />
            </div>
            <h1
              style={{
                fontSize: 120,
                fontWeight: 900,
                fontFamily: "Inter, sans-serif",
                background: "linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #8B4513 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
              }}
            >
              {title}
            </h1>
            <div style={{ transform: `translateX(${(1 - titleProgress) * 100}px)` }}>
              <OwlIcon size={200} color="#8B4513" />
            </div>
          </div>

          <p
            style={{
              fontSize: 36,
              color: "rgba(0,0,0,0.7)",
              fontFamily: "Inter, sans-serif",
              marginTop: 40,
              opacity: interpolate(frame, [30, 50], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Day meets night in nature's wonders!
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* Bee facts section - Daytime theme */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 80,
            background: "linear-gradient(180deg, #87CEEB 0%, #FFE4B5 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              marginBottom: 60,
            }}
          >
            <BeeIcon size={100} color="#FFD700" />
            <h2
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#B8860B",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Bee Facts
            </h2>
            <span style={{ fontSize: 60 }}>🐝</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {beeFacts.map((fact, index) => {
              const factFrame = frame - 90;
              const delay = index * 40;
              const factSpring = spring({
                frame: factFrame - delay,
                fps,
                config: { damping: 15, stiffness: 80 },
              });

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 30,
                    opacity: factSpring,
                    transform: `translateX(${(1 - factSpring) * 200}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      color: "#1a1a1a",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 42,
                      color: "#2C1810",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {fact}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Flying bee animation */}
          <div
            style={{
              position: "absolute",
              right: interpolate(frame - 90, [0, 180], [1920, -200]),
              top: 150 + Math.sin(frame * 0.15) * 50,
              transform: `rotate(${Math.sin(frame * 0.2) * 10}deg)`,
            }}
          >
            <BeeIcon size={80} color="#FFD700" />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Owl facts section - Nighttime theme */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 80,
            background: "linear-gradient(180deg, #1a1a3e 0%, #0a0a1a 100%)",
          }}
        >
          {/* Moon */}
          <div
            style={{
              position: "absolute",
              top: 60,
              right: 120,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #FFFACD, #F0E68C)",
              boxShadow: "0 0 60px rgba(255,250,205,0.5)",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              marginBottom: 60,
            }}
          >
            <OwlIcon size={100} color="#8B4513" />
            <h2
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#DEB887",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Owl Facts
            </h2>
            <span style={{ fontSize: 60 }}>🦉</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {owlFacts.map((fact, index) => {
              const factFrame = frame - 270;
              const delay = index * 40;
              const factSpring = spring({
                frame: factFrame - delay,
                fps,
                config: { damping: 15, stiffness: 80 },
              });

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 30,
                    opacity: factSpring,
                    transform: `translateX(${(1 - factSpring) * -200}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #DEB887 0%, #8B4513 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 42,
                      color: "#fff",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {fact}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={450} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(90deg, #FFE4B5 0%, #1a1a3e 100%)",
          }}
        >
          {(() => {
            const outroFrame = frame - 450;
            const outroSpring = spring({
              frame: outroFrame,
              fps,
              config: { damping: 10, stiffness: 100 },
            });

            return (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 40,
                    transform: `scale(${outroSpring})`,
                  }}
                >
                  <BeeIcon size={150} color="#FFD700" />
                  <span style={{ fontSize: 100 }}>🌸</span>
                  <OwlIcon size={150} color="#8B4513" />
                </div>
                <h2
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    background: "linear-gradient(90deg, #FFD700, #8B4513)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "Inter, sans-serif",
                    marginTop: 50,
                    opacity: interpolate(outroFrame, [20, 40], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  Day or night, nature amazes! 🌿
                </h2>
              </>
            );
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
