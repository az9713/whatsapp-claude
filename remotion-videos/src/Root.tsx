import { Composition } from "remotion";

// Compositions from claude-code-remotion
import { ClaudeCodeIntro } from "./compositions/ClaudeCodeIntro";
import { DataDashboard } from "./compositions/DataDashboard";
import { KineticTypography } from "./compositions/KineticTypography";
import { ProductShowcase } from "./compositions/ProductShowcase";
import { CountdownTimer } from "./compositions/CountdownTimer";
import { CodeWalkthrough } from "./compositions/CodeWalkthrough";

// New unique compositions
import { CodeExplainer } from "./compositions/CodeExplainer";
import { GitHubRecap } from "./compositions/GitHubRecap";
import { ThreadToVideo } from "./compositions/ThreadToVideo";
import { Audiogram } from "./compositions/Audiogram";
import { VerticalShort } from "./compositions/VerticalShort";
import { NewsVideo } from "./compositions/NewsVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* === FROM claude-code-remotion === */}

      <Composition
        id="ClaudeCodeIntro"
        component={ClaudeCodeIntro}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Claude Code",
          subtitle: "AI-Powered Development",
        }}
      />

      <Composition
        id="DataDashboard"
        component={DataDashboard}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          stats: [
            { label: "Users", value: 10000 },
            { label: "Revenue", value: 50000 },
            { label: "Growth", value: 150 },
          ],
        }}
      />

      <Composition
        id="KineticTypography"
        component={KineticTypography}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          quote: "The future of software development is here.",
          author: "Claude",
        }}
      />

      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Key Features",
          features: [
            "AI-Powered Automation",
            "Browser Control",
            "Video Generation",
            "Smart Scheduling",
          ],
        }}
      />

      <Composition
        id="CountdownTimer"
        component={CountdownTimer}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          countFrom: 3,
          endText: "GO!",
        }}
      />

      <Composition
        id="CodeWalkthrough"
        component={CodeWalkthrough}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          code: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
          language: "javascript",
        }}
      />

      {/* === NEW UNIQUE COMPOSITIONS === */}

      <Composition
        id="CodeExplainer"
        component={CodeExplainer}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          code: `async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}`,
          language: "javascript",
          explanation: "Fetches JSON data from an API endpoint",
        }}
      />

      <Composition
        id="GitHubRecap"
        component={GitHubRecap}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          username: "developer",
          commits: 150,
          prs: 23,
          issues: 45,
          repos: ["awesome-project", "cool-lib"],
        }}
      />

      <Composition
        id="ThreadToVideo"
        component={ThreadToVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          tweets: [
            { author: "@developer", text: "Let me tell you about AI agents...", avatar: "" },
            { author: "@developer", text: "They can automate your workflow!", avatar: "" },
          ],
        }}
      />

      <Composition
        id="Audiogram"
        component={Audiogram}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          audioSrc: "",
          transcript: "Welcome to the podcast...",
          speakerName: "Host",
        }}
      />

      <Composition
        id="VerticalShort"
        component={VerticalShort}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "Quick Tip",
          content: "Did you know AI can help you code faster?",
          caption: "Follow for more tips!",
        }}
      />

      <Composition
        id="NewsVideo"
        component={NewsVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headline: "AI News Update",
          story: "Today's top story in artificial intelligence...",
          source: "AI Daily",
        }}
      />
    </>
  );
};
