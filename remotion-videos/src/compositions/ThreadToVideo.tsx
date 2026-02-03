import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";

interface Tweet {
  author: string;
  text: string;
  avatar: string;
}

interface ThreadToVideoProps {
  tweets: Tweet[];
}

const TweetCard: React.FC<{ tweet: Tweet; index: number }> = ({ tweet, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Word-by-word animation
  const words = tweet.text.split(" ");
  const framesPerWord = 8;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 100,
      }}
    >
      {/* Thread indicator */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 100,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(frame, [0, 15], [0, 1]),
        }}
      >
        <div
          style={{
            background: "#1da1f2",
            padding: "8px 16px",
            borderRadius: 20,
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Thread
        </div>
        <span style={{ color: "#71767b", fontSize: 18 }}>
          {index + 1} / Thread
        </span>
      </div>

      {/* Tweet card */}
      <div
        style={{
          background: "#000",
          borderRadius: 24,
          padding: 50,
          maxWidth: 900,
          width: "100%",
          border: "1px solid #2f3336",
          transform: `scale(${cardSpring}) translateY(${(1 - cardSpring) * 50}px)`,
        }}
      >
        {/* Author row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            {tweet.avatar || "👤"}
          </div>

          {/* Name and handle */}
          <div>
            <div
              style={{
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {tweet.author.replace("@", "")}
            </div>
            <div
              style={{
                color: "#71767b",
                fontFamily: "Inter, sans-serif",
                fontSize: 18,
              }}
            >
              {tweet.author}
            </div>
          </div>

          {/* Verified badge */}
          <div
            style={{
              background: "#1da1f2",
              width: 24,
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -8,
            }}
          >
            ✓
          </div>
        </div>

        {/* Tweet text with word animation */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            lineHeight: 1.5,
          }}
        >
          {words.map((word, i) => {
            const wordStart = 15 + i * framesPerWord;
            const wordSpring = spring({
              frame: frame - wordStart,
              fps,
              config: { damping: 15, stiffness: 100 },
            });

            return (
              <span
                key={i}
                style={{
                  fontSize: 36,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  opacity: wordSpring,
                  transform: `translateY(${(1 - wordSpring) * 20}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Engagement stats */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 40,
            paddingTop: 24,
            borderTop: "1px solid #2f3336",
            opacity: interpolate(frame, [60, 80], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {[
            { icon: "💬", label: "Reply" },
            { icon: "🔄", label: "Repost" },
            { icon: "❤️", label: "Like" },
            { icon: "📊", label: "Views" },
          ].map((action) => (
            <div
              key={action.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#71767b",
                fontSize: 18,
              }}
            >
              <span style={{ fontSize: 22 }}>{action.icon}</span>
              <span>{action.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ThreadToVideo: React.FC<ThreadToVideoProps> = ({ tweets }) => {
  const { durationInFrames } = useVideoConfig();
  const framesPerTweet = Math.floor(durationInFrames / tweets.length);

  return (
    <>
      {tweets.map((tweet, index) => (
        <Sequence
          key={index}
          from={index * framesPerTweet}
          durationInFrames={framesPerTweet}
        >
          <TweetCard tweet={tweet} index={index} />
        </Sequence>
      ))}
    </>
  );
};
