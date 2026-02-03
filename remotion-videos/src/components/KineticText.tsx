import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface KineticTextProps {
  text: string;
  style?: React.CSSProperties;
  animation?: "word-by-word" | "char-by-char" | "fade-up" | "scale" | "slide";
  staggerDelay?: number;
  startFrame?: number;
  highlightWords?: string[];
  highlightColor?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  style,
  animation = "word-by-word",
  staggerDelay = 5,
  startFrame = 0,
  highlightWords = [],
  highlightColor = "#60a5fa",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");
  const chars = text.split("");

  const renderWordByWord = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * staggerDelay;
        const wordSpring = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 12, stiffness: 100 },
        });

        const isHighlighted = highlightWords.some(
          (hw) => word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <span
            key={i}
            style={{
              opacity: wordSpring,
              transform: `translateY(${(1 - wordSpring) * 20}px)`,
              color: isHighlighted ? highlightColor : "inherit",
              fontWeight: isHighlighted ? 700 : "inherit",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );

  const renderCharByChar = () => (
    <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
      {chars.map((char, i) => {
        const charStart = startFrame + i * (staggerDelay / 3);
        const charSpring = spring({
          frame: frame - charStart,
          fps,
          config: { damping: 15, stiffness: 120 },
        });

        return (
          <span
            key={i}
            style={{
              opacity: charSpring,
              transform: `translateY(${(1 - charSpring) * 15}px)`,
              display: char === " " ? "inline" : "inline-block",
              minWidth: char === " " ? "0.25em" : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );

  const renderFadeUp = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * staggerDelay;
        const opacity = interpolate(frame - wordStart, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(frame - wordStart, [0, 15], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );

  const renderScale = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * staggerDelay;
        const scaleSpring = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 10, stiffness: 150 },
        });

        return (
          <span
            key={i}
            style={{
              opacity: scaleSpring,
              transform: `scale(${scaleSpring})`,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );

  const renderSlide = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * staggerDelay;
        const slideSpring = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 15, stiffness: 80 },
        });

        const direction = i % 2 === 0 ? -1 : 1;

        return (
          <span
            key={i}
            style={{
              opacity: slideSpring,
              transform: `translateX(${(1 - slideSpring) * 50 * direction}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );

  switch (animation) {
    case "char-by-char":
      return renderCharByChar();
    case "fade-up":
      return renderFadeUp();
    case "scale":
      return renderScale();
    case "slide":
      return renderSlide();
    case "word-by-word":
    default:
      return renderWordByWord();
  }
};

// Typewriter effect component
interface TypewriterProps {
  text: string;
  style?: React.CSSProperties;
  startFrame?: number;
  charsPerFrame?: number;
  cursorColor?: string;
  showCursor?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  style,
  startFrame = 0,
  charsPerFrame = 0.5,
  cursorColor = "#60a5fa",
  showCursor = true,
}) => {
  const frame = useCurrentFrame();

  const visibleChars = Math.floor((frame - startFrame) * charsPerFrame);
  const visibleText = text.substring(0, Math.min(visibleChars, text.length));
  const isComplete = visibleChars >= text.length;

  // Cursor blink
  const cursorVisible = Math.sin(frame * 0.2) > 0 || !isComplete;

  return (
    <span style={style}>
      {visibleText}
      {showCursor && (
        <span
          style={{
            display: "inline-block",
            width: "0.1em",
            height: "1em",
            background: cursorColor,
            marginLeft: "0.05em",
            opacity: cursorVisible ? 1 : 0,
            verticalAlign: "text-bottom",
          }}
        />
      )}
    </span>
  );
};
