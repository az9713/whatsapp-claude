import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface GitHubRecapProps {
  username: string;
  commits: number;
  prs: number;
  issues: number;
  repos: string[];
}

export const GitHubRecap: React.FC<GitHubRecapProps> = ({
  username,
  commits,
  prs,
  issues,
  repos,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation phases
  const headerIn = spring({ frame, fps, config: { damping: 15 } });
  const statsStart = 60;
  const reposStart = 300;

  // Stats data
  const stats = [
    { label: "Commits", value: commits, icon: "📝", color: "#4ade80" },
    { label: "Pull Requests", value: prs, icon: "🔀", color: "#60a5fa" },
    { label: "Issues", value: issues, icon: "📋", color: "#f472b6" },
  ];

  // Contribution graph simulation
  const weeks = 12;
  const days = 7;

  return (
    <AbsoluteFill
      style={{
        background: "#0d1117",
        padding: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          marginBottom: 60,
          opacity: headerIn,
          transform: `translateY(${(1 - headerIn) * -30}px)`,
        }}
      >
        {/* GitHub logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 50,
          }}
        >
          🐙
        </div>
        <div>
          <h1
            style={{
              fontSize: 56,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {username}'s GitHub Recap
          </h1>
          <p style={{ fontSize: 24, color: "#8b949e", margin: "8px 0 0 0" }}>
            Weekly Activity Summary
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 40, marginBottom: 60 }}>
        {stats.map((stat, index) => {
          const delay = statsStart + index * 30;
          const statSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12 },
          });

          const countProgress = interpolate(
            frame - delay - 15,
            [0, 45],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const displayValue = Math.floor(stat.value * countProgress);

          return (
            <div
              key={stat.label}
              style={{
                flex: 1,
                background: "#161b22",
                borderRadius: 16,
                padding: 30,
                border: "1px solid #30363d",
                opacity: statSpring,
                transform: `scale(${statSpring}) translateY(${(1 - statSpring) * 30}px)`,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: stat.color,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {displayValue}
              </div>
              <div style={{ fontSize: 20, color: "#8b949e" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Contribution graph */}
      <div
        style={{
          background: "#161b22",
          borderRadius: 16,
          padding: 30,
          border: "1px solid #30363d",
          marginBottom: 40,
        }}
      >
        <div style={{ color: "#8b949e", marginBottom: 20, fontSize: 18 }}>
          Contribution Activity
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[...Array(weeks)].map((_, week) => (
            <div key={week} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[...Array(days)].map((_, day) => {
                const cellFrame = frame - 150 - week * 3 - day;
                const cellOpacity = interpolate(cellFrame, [0, 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const intensity = Math.random();
                const color =
                  intensity > 0.7
                    ? "#39d353"
                    : intensity > 0.4
                    ? "#26a641"
                    : intensity > 0.2
                    ? "#006d32"
                    : "#0e4429";

                return (
                  <div
                    key={day}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      background: color,
                      opacity: cellOpacity,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Top repos */}
      <div>
        <div style={{ color: "#8b949e", marginBottom: 20, fontSize: 18 }}>
          Top Repositories
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {repos.map((repo, index) => {
            const delay = reposStart + index * 20;
            const repoSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 15 },
            });

            return (
              <div
                key={repo}
                style={{
                  background: "#161b22",
                  borderRadius: 12,
                  padding: "16px 24px",
                  border: "1px solid #30363d",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: repoSpring,
                  transform: `translateX(${(1 - repoSpring) * 30}px)`,
                }}
              >
                <span style={{ fontSize: 24 }}>📁</span>
                <span style={{ color: "#58a6ff", fontSize: 20 }}>{repo}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
