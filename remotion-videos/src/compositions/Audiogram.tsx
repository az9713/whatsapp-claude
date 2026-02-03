import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface AudiogramProps {
  audioSrc: string;
  transcript: string;
  speakerName: string;
}

export const Audiogram: React.FC<AudiogramProps> = ({
  audioSrc,
  transcript,
  speakerName,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Simulated waveform bars
  const barCount = 60;
  const bars = [...Array(barCount)].map((_, i) => {
    // Create a pseudo-random but consistent pattern
    const seed = i * 7 + frame * 0.5;
    const height = 20 + Math.abs(Math.sin(seed * 0.1)) * 80 + Math.sin(seed * 0.3 + frame * 0.1) * 30;
    return Math.min(100, Math.max(10, height));
  });

  // Word animation for transcript
  const words = transcript.split(" ");
  const framesPerWord = Math.floor((durationInFrames - 60) / words.length);
  const visibleWords = Math.floor((frame - 30) / framesPerWord);

  // Progress bar
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Speaker info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 60,
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 50,
            boxShadow: "0 4px 30px rgba(102, 126, 234, 0.4)",
          }}
        >
          🎙️
        </div>

        <div>
          <h1
            style={{
              fontSize: 48,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {speakerName}
          </h1>
          <p style={{ fontSize: 24, color: "#9ca3af", margin: "8px 0 0 0" }}>
            Podcast Episode
          </p>
        </div>
      </div>

      {/* Waveform visualization */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          height: 200,
          marginBottom: 60,
        }}
      >
        {bars.map((height, i) => {
          const delay = Math.abs(i - barCount / 2) * 0.5;
          const animatedHeight = interpolate(
            frame - delay,
            [0, 30],
            [10, height],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Color gradient based on position
          const hue = 250 + (i / barCount) * 60;

          return (
            <div
              key={i}
              style={{
                width: 8,
                height: animatedHeight,
                background: `linear-gradient(180deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue}, 70%, 40%) 100%)`,
                borderRadius: 4,
                transition: "height 0.1s ease",
              }}
            />
          );
        })}
      </div>

      {/* Transcript */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 20,
          padding: 40,
          maxWidth: 1200,
          width: "100%",
          minHeight: 200,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignContent: "flex-start",
        }}
      >
        {words.slice(0, visibleWords + 1).map((word, i) => {
          const isCurrentWord = i === visibleWords;
          return (
            <span
              key={i}
              style={{
                fontSize: 32,
                color: isCurrentWord ? "#60a5fa" : "#fff",
                fontFamily: "Inter, sans-serif",
                fontWeight: isCurrentWord ? 600 : 400,
                background: isCurrentWord ? "rgba(96, 165, 250, 0.2)" : "transparent",
                padding: isCurrentWord ? "4px 8px" : "4px 0",
                borderRadius: 6,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          right: 80,
          height: 8,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            borderRadius: 4,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
