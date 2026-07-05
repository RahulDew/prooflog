import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Copy, Check } from "lucide-react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npm i @prooflog/node");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  return (
    <div className="relative pt-[64px] min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(820px_540px_at_50%_-8%,rgba(59,130,246,0.1),transparent_70%),radial-gradient(680px_480px_at_86%_12%,rgba(249,115,22,0.04),transparent_70%)]" />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage:
            "radial-gradient(900px 720px at 50% 0%, rgb(0, 0, 0) 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(900px 720px at 50% 0%, rgb(0, 0, 0) 35%, transparent 80%)",
        }}
      />

      <main className="relative z-10">
        <header className="max-w-7xl mx-auto px-6 pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-[12.5px] text-blue-300 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
            ProofLog SDK v0.1.2 is now live
          </div>

          <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-tight font-extrabold max-w-[860px] mx-auto text-gray-50">
            Immutable Audit Logs.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Zero Trust Required.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-[620px] mx-auto mt-6 leading-relaxed">
            Cryptographically secure logging for Node.js & NestJS. Every log
            entry is cryptographically linked, creating a verifiable chain of
            custody for your most sensitive operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/docs"
              className="h-[46px] px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center no-underline shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.45)]"
            >
              Start Building
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleCopy}
              className="h-[46px] px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors flex items-center gap-2.5 w-full sm:w-auto justify-center cursor-pointer relative group"
            >
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>npm install @prooflog/node</span>
              <span className="w-px h-4 bg-white/10 mx-1 shrink-0" />
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
              )}
            </button>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="rounded-2xl border border-white/10 bg-[#0c0b10]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-2 text-xs font-mono text-zinc-500">
                prooflog-demo.ts
              </div>
            </div>
            <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300">
              <pre>
                <code className="text-blue-400">import</code> {"{ ProofLog }"}{" "}
                <code className="text-blue-400">from</code>{" "}
                <code className="text-emerald-300">'@prooflog/node'</code>;
                <br />
                <br />
                <code className="text-zinc-500">
                  {"// 1. Initialize the client"}
                </code>
                <br />
                <code className="text-blue-400">const</code> log ={" "}
                <code className="text-blue-400">new</code> ProofLog({"{"}{" "}
                apiKey: <code className="text-emerald-300">'YOUR_API_KEY'</code>{" "}
                {"}"});
                <br />
                <br />
                <code className="text-zinc-500">
                  {"// 2. Ingest an immutable log"}
                </code>
                <br />
                <code className="text-blue-400">await</code> log.ingest(
                <code className="text-emerald-300">'org_123'</code>, {"{"}
                <br />
                {"  "}action:{" "}
                <code className="text-emerald-300">'user.login'</code>,<br />
                {"  "}actor: {"{"} id:{" "}
                <code className="text-emerald-300">'usr_1'</code> {"}"},<br />
                {"  "}metadata: {"{"} ip:{" "}
                <code className="text-emerald-300">'192.168.1.1'</code> {"}"}
                <br />
                {"}"});
                <br />
                <br />
                <code className="text-zinc-500">
                  {"// 3. Verify the hash chain cryptographically"}
                </code>
                <br />
                <code className="text-blue-400">const</code> result ={" "}
                <code className="text-blue-400">await</code> log.verify(
                <code className="text-emerald-300">'org_123'</code>);
                <br />
                console.log(result.valid);{" "}
                <code className="text-zinc-500">{"// true"}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
