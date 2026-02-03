import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SyntaxHighlightProps {
  code: string;
  language: string;
  typewriter?: boolean;
  startFrame?: number;
  endFrame?: number;
}

// Token types and colors (One Dark theme)
const TOKEN_COLORS: Record<string, string> = {
  keyword: "#c678dd",
  string: "#98c379",
  number: "#d19a66",
  comment: "#5c6370",
  function: "#61afef",
  variable: "#e06c75",
  operator: "#56b6c2",
  punctuation: "#abb2bf",
  default: "#abb2bf",
};

// Simple tokenizer
function tokenize(code: string, language: string): Array<{ text: string; type: string }> {
  const tokens: Array<{ text: string; type: string }> = [];

  const patterns: Record<string, RegExp> = {
    keyword: /\b(function|const|let|var|return|if|else|for|while|class|import|export|from|async|await|new|this|try|catch|throw|finally|switch|case|break|continue|default|typeof|instanceof)\b/,
    string: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/,
    number: /\b\d+(\.\d+)?\b/,
    comment: /(\/\/.*$|\/\*[\s\S]*?\*\/)/m,
    function: /\b([a-zA-Z_]\w*)\s*(?=\()/,
    operator: /([+\-*/%=<>!&|^~?:])/,
    punctuation: /([{}[\]();,.])/,
  };

  let remaining = code;
  while (remaining.length > 0) {
    let matched = false;

    for (const [type, regex] of Object.entries(patterns)) {
      const match = remaining.match(new RegExp(`^${regex.source}`));
      if (match) {
        tokens.push({ text: match[0], type });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Check for whitespace
      const wsMatch = remaining.match(/^(\s+)/);
      if (wsMatch) {
        tokens.push({ text: wsMatch[0], type: "default" });
        remaining = remaining.slice(wsMatch[0].length);
      } else {
        // Single character fallback
        tokens.push({ text: remaining[0], type: "default" });
        remaining = remaining.slice(1);
      }
    }
  }

  return tokens;
}

export const SyntaxHighlight: React.FC<SyntaxHighlightProps> = ({
  code,
  language,
  typewriter = false,
  startFrame = 0,
  endFrame = 100,
}) => {
  const frame = useCurrentFrame();

  const tokens = tokenize(code, language);
  const totalChars = code.length;

  // Calculate visible characters for typewriter effect
  const visibleChars = typewriter
    ? Math.floor(
        interpolate(frame, [startFrame, endFrame], [0, totalChars], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      )
    : totalChars;

  // Build visible tokens
  let charCount = 0;
  const visibleTokens = tokens.map((token) => {
    const tokenStart = charCount;
    charCount += token.text.length;

    if (visibleChars < tokenStart) {
      return { ...token, text: "" };
    }
    if (visibleChars >= charCount) {
      return token;
    }
    return { ...token, text: token.text.substring(0, visibleChars - tokenStart) };
  });

  return (
    <pre
      style={{
        margin: 0,
        fontFamily: "'Fira Code', 'Consolas', monospace",
        fontSize: "inherit",
        lineHeight: "inherit",
      }}
    >
      {visibleTokens.map((token, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[token.type] || TOKEN_COLORS.default }}>
          {token.text}
        </span>
      ))}
      {typewriter && visibleChars < totalChars && (
        <span
          style={{
            background: "#528bff",
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
          }}
        >
          {" "}
        </span>
      )}
    </pre>
  );
};
