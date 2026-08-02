import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/Button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  isDark?: boolean;
  className?: string;
}

const KEYWORDS = new Set([
  "import", "export", "from", "const", "let", "var", "await", "async",
  "function", "class", "className", "interface", "type", "new", "if",
  "else", "return", "try", "catch", "typeof", "public", "readonly",
  "extends", "implements", "default"
]);

const BOOLEANS = new Set(["true", "false", "null", "undefined"]);

const GLOBALS = new Set([
  "ProofLog", "ProofLogModule", "ProofLogError", "TimeoutError", "NetworkError",
  "AuthenticationError", "ValidationError", "RateLimitError", "ServerError",
  "console", "process", "env", "Math", "JSON", "Error", "Object", "Array",
  "Promise", "Record", "req", "res", "app"
]);

export function CodeBlock({
  code,
  language = "typescript",
  title,
  showLineNumbers,
  isDark: propIsDark,
  className = ""
}: CodeBlockProps) {
  const { isDark: themeIsDark } = useTheme();
  const isDark = propIsDark ?? themeIsDark;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const lines = code.trim().split("\n");
  const isTerminal =
    language.toLowerCase() === "terminal" ||
    language.toLowerCase() === "bash" ||
    language.toLowerCase() === "sh";

  const displayLineNumbers = showLineNumbers ?? (!isTerminal && lines.length > 1);

  return (
    <div
      className={`rounded-[4px] border overflow-hidden transition-colors ${
        isDark
          ? "bg-[#0a0a0c] border-zinc-800 text-zinc-100"
          : "bg-zinc-50 border-zinc-300 text-zinc-900 shadow-sm"
      } ${className}`}
    >
      {/* Header bar */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b ${
          isDark ? "border-zinc-800 bg-black/40" : "border-zinc-300 bg-zinc-200/60"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500" />
          <span
            className={`ml-2 text-xs font-mono ${
              isDark ? "text-zinc-400" : "text-zinc-600 font-medium"
            }`}
          >
            {title || language}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          className="h-8 px-3 text-[11px]"
        >
          {copied ? <span className="text-emerald-500 font-semibold">Copied</span> : <span>Copy</span>}
        </Button>
      </div>

      {/* Code container */}
      <div
        className={`p-4 overflow-x-auto text-xs font-mono leading-relaxed ${
          isDark ? "text-zinc-300" : "text-zinc-800"
        }`}
      >
        <pre className="font-mono">
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              {displayLineNumbers && (
                <span
                  className={`w-8 shrink-0 text-right pr-4 select-none border-r mr-4 ${
                    isDark
                      ? "text-zinc-600 border-zinc-800/60"
                      : "text-zinc-400 border-zinc-300"
                  }`}
                >
                  {idx + 1}
                </span>
              )}
              <span className="whitespace-pre flex-1">
                {highlightLine(line, language, isDark)}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function highlightLine(line: string, language: string, isDark: boolean): React.ReactNode {
  const lang = language.toLowerCase();

  // Terminal / Bash mode
  if (lang === "terminal" || lang === "bash" || lang === "sh") {
    if (line.trim().startsWith("#")) {
      return <span className="text-zinc-500 italic">{line}</span>;
    }

    const tokens: React.ReactNode[] = [];
    let remaining = line;

    // Check leading prompt $
    const promptMatch = remaining.match(/^(\s*)(\$)/);
    if (promptMatch) {
      if (promptMatch[1]) tokens.push(promptMatch[1]);
      tokens.push(
        <span
          key="prompt"
          className={`${isDark ? "text-orange-500" : "text-orange-600"} font-bold select-none`}
        >
          $
        </span>
      );
      remaining = remaining.slice(promptMatch[0].length);
    }

    const parts = remaining.split(
      /(\b(?:pnpm|npm|yarn|bun|add|install|run|build)\b|@[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*)/g
    );

    parts.forEach((part, i) => {
      if (
        ["pnpm", "npm", "yarn", "bun", "add", "install", "run", "build"].includes(
          part
        )
      ) {
        tokens.push(
          <span
            key={i}
            className={`${isDark ? "text-blue-400" : "text-blue-600"} font-medium`}
          >
            {part}
          </span>
        );
      } else if (part.startsWith("@")) {
        tokens.push(
          <span
            key={i}
            className={`${isDark ? "text-emerald-400" : "text-emerald-600"} font-mono font-medium`}
          >
            {part}
          </span>
        );
      } else {
        tokens.push(
          <span key={i} className={isDark ? "text-zinc-300" : "text-zinc-800"}>
            {part}
          </span>
        );
      }
    });

    return <>{tokens}</>;
  }

  // Handle single-line comments //
  const commentIndex = line.indexOf("//");
  if (commentIndex !== -1) {
    const codePart = line.slice(0, commentIndex);
    const commentPart = line.slice(commentIndex);
    return (
      <>
        {tokenizeCode(codePart, isDark)}
        <span className="text-zinc-500 italic">{commentPart}</span>
      </>
    );
  }

  return tokenizeCode(line, isDark);
}

function tokenizeCode(text: string, isDark: boolean): React.ReactNode {
  if (!text) return null;

  const regex =
    /('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|@[A-Za-z0-9_]+|\b\d+(?:\.\d+)?\b|[A-Za-z0-9_$]+|[^\s\w]+|\s+)/g;

  const matches = text.match(regex);
  if (!matches) return <span className={isDark ? "text-zinc-300" : "text-zinc-800"}>{text}</span>;

  let searchPos = 0;
  return matches.map((token, idx) => {
    const tokenPos = text.indexOf(token, searchPos);
    if (tokenPos !== -1) searchPos = tokenPos + token.length;

    // 1. Strings ('...', "...", `...`) -> Green
    if (
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("`") && token.endsWith("`"))
    ) {
      return (
        <span key={idx} className={isDark ? "text-emerald-400" : "text-emerald-600 font-medium"}>
          {token}
        </span>
      );
    }

    // 2. Decorators (@Module) -> Green
    if (token.startsWith("@")) {
      return (
        <span key={idx} className={`${isDark ? "text-emerald-400" : "text-emerald-600"} font-medium`}>
          {token}
        </span>
      );
    }

    // 3. Keywords -> Blue
    if (KEYWORDS.has(token)) {
      return (
        <span key={idx} className={`${isDark ? "text-blue-400" : "text-blue-600"} font-medium`}>
          {token}
        </span>
      );
    }

    // 4. Globals / Classes -> Blue
    if (GLOBALS.has(token)) {
      return (
        <span key={idx} className={`${isDark ? "text-blue-400" : "text-blue-600"} font-medium`}>
          {token}
        </span>
      );
    }

    // 5. Booleans / null -> Blue
    if (BOOLEANS.has(token)) {
      return (
        <span key={idx} className={`${isDark ? "text-blue-400" : "text-blue-600"} font-medium`}>
          {token}
        </span>
      );
    }

    // 6. Numbers -> Orange
    if (/^\d+(\.\d+)?$/.test(token)) {
      return (
        <span key={idx} className={`${isDark ? "text-orange-400" : "text-orange-600"} font-mono`}>
          {token}
        </span>
      );
    }

    // 7. Identifiers -> Gray / Blue for functions
    if (/^[A-Za-z0-9_$]+$/.test(token)) {
      const remainingAfter = text.slice(searchPos).trimStart();
      if (remainingAfter.startsWith("(")) {
        return (
          <span key={idx} className={`${isDark ? "text-blue-400" : "text-blue-600"} font-medium`}>
            {token}
          </span>
        );
      }
      return (
        <span key={idx} className={isDark ? "text-zinc-300" : "text-zinc-800"}>
          {token}
        </span>
      );
    }

    // 8. Punctuation / Operators / Whitespace -> Gray
    return (
      <span key={idx} className={isDark ? "text-zinc-400" : "text-zinc-500"}>
        {token}
      </span>
    );
  });
}
