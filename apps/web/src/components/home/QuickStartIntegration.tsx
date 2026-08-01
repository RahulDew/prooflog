import { Check } from "lucide-react";
import { CodeBlock } from "../CodeBlock";
import { CODE_INTEGRATION_CONTENT } from "../../constants/home.constants";

import { useTheme } from "../../context/ThemeContext";

export function QuickStartIntegration() {
  const { isDark } = useTheme();
  return (
    <section className="py-20 gsap-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 text-left space-y-6">
          <span className="section-tag-blue">
            {CODE_INTEGRATION_CONTENT.tag}
          </span>
          <h2 className="text-3xl font-extrabold">{CODE_INTEGRATION_CONTENT.title}</h2>
          <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            {CODE_INTEGRATION_CONTENT.description}
          </p>
          <div className="space-y-3">
            {CODE_INTEGRATION_CONTENT.features.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium">
                <div className="w-4 h-4 bg-emerald-500/10 border border-emerald-500/40 grid place-items-center shrink-0 rounded-[2px]">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor Window */}
        <div className="lg:col-span-7">
          <CodeBlock
            title="prooflog-server.ts"
            language="typescript"
            isDark={isDark}
            code={CODE_INTEGRATION_CONTENT.codeSnippet}
          />
        </div>
      </div>
    </section>
  );
}
