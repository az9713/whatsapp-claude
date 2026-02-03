import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";

interface CatsAndDogsProps {
  title?: string;
  catFacts?: string[];
  dogFacts?: string[];
}

const CatIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
    {/* Cat face */}
    <circle cx="50" cy="55" r="35" />
    {/* Ears */}
    <polygon points="20,35 15,5 40,25" />
    <polygon points="80,35 85,5 60,25" />
    {/* Eyes */}
    <ellipse cx="35" cy="50" rx="8" ry="10" fill="#1a1a2e" />
    <ellipse cx="65" cy="50" rx="8" ry="10" fill="#1a1a2e" />
    {/* Nose */}
    <polygon points="50,62 45,68 55,68" fill="#ff9999" />
    {/* Whiskers */}
    <line x1="10" y1="60" x2="35" y2="65" stroke="#fff" strokeWidth="2" />
    <line x1="10" y1="70" x2="35" y2="70" stroke="#fff" strokeWidth="2" />
    <line x1="90" y1="60" x2="65" y2="65" stroke="#fff" strokeWidth="2" />
    <line x1="90" y1="70" x2="65" y2="70" stroke="#fff" strokeWidth="2" />
  </svg>
);

const DogIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
    {/* Dog face */}
    <ellipse cx="50" cy="55" rx="35" ry="30" />
    {/* Ears */}
    <ellipse cx="15" cy="40" rx="15" ry="25" />
    <ellipse cx="85" cy="40" rx="15" ry="25" />
    {/* Eyes */}
    <circle cx="35" cy="50" r="8" fill="#1a1a2e" />
    <circle cx="65" cy="50" r="8" fill="#1a1a2e" />
    {/* Nose */}
    <ellipse cx="50" cy="65" rx="10" ry="8" fill="#2d2d2d" />
    {/* Tongue */}
    <ellipse cx="50" cy="80" rx="8" ry="10" fill="#ff6b6b" />
  </svg>
);

const PawPrint: React.FC<{ x: number; y: number; rotation: number; opacity: number }> = ({
  x,
  y,
  rotation,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `rotate(${rotation}deg)`,
      opacity,
      fontSize: 40,
    }}
  >
    🐾
  </div>
);

export const CatsAndDogs: React.FC<CatsAndDogsProps> = ({
  title = "Cats vs Dogs",
  catFacts = [
    "Cats sleep 12-16 hours a day",
    "A cat's purr vibrates at 25-150 Hz",
    "Cats can rotate their ears 180°",
  ],
  dogFacts = [
    "Dogs have 300 million smell receptors",
    "A dog's nose print is unique",
    "Dogs dream just like humans",
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Generate paw prints
  const pawPrints = Array.from({ length: 12 }, (_, i) => ({
    x: Math.sin(i * 1.2) * 800 + 960,
    y: Math.cos(i * 0.8) * 400 + 540,
    rotation: i * 30,
  }));

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        overflow: "hidden",
      }}
    >
      {/* Animated paw prints background */}
      {pawPrints.map((paw, i) => {
        const pawOpacity = interpolate(
          frame - i * 8,
          [0, 20, 60, 80],
          [0, 0.15, 0.15, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <PawPrint
            key={i}
            x={paw.x + Math.sin(frame * 0.02 + i) * 20}
            y={paw.y + Math.cos(frame * 0.02 + i) * 20}
            rotation={paw.rotation + frame * 0.5}
            opacity={pawOpacity}
          />
        );
      })}

      {/* Title sequence */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
              <CatIcon size={200} color="#f093fb" />
            </div>
            <h1
              style={{
                fontSize: 120,
                fontWeight: 900,
                fontFamily: "Inter, sans-serif",
                background: "linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
              }}
            >
              {title}
            </h1>
            <div style={{ transform: `translateX(${(1 - titleProgress) * 100}px)` }}>
              <DogIcon size={200} color="#4facfe" />
            </div>
          </div>

          <p
            style={{
              fontSize: 36,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Inter, sans-serif",
              marginTop: 40,
              opacity: interpolate(frame, [30, 50], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Fun facts about our favorite pets!
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* Cat facts section */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 80,
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
            <CatIcon size={100} color="#f093fb" />
            <h2
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#f093fb",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Cat Facts
            </h2>
            <span style={{ fontSize: 60 }}>🐱</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {catFacts.map((fact, index) => {
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
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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

      {/* Dog facts section */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 80,
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
            <DogIcon size={100} color="#4facfe" />
            <h2
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#4facfe",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Dog Facts
            </h2>
            <span style={{ fontSize: 60 }}>🐕</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {dogFacts.map((fact, index) => {
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
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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
                  <CatIcon size={150} color="#f093fb" />
                  <span style={{ fontSize: 100 }}>❤️</span>
                  <DogIcon size={150} color="#4facfe" />
                </div>
                <h2
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    marginTop: 50,
                    opacity: interpolate(outroFrame, [20, 40], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  Both are amazing! 🐾
                </h2>
              </>
            );
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
