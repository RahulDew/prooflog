import { ARCHITECTURE_STEPS } from "../../constants/home.constants";

interface ArchitectureFlowProps {
  isDark: boolean;
}

export function ArchitectureFlow({ isDark }: ArchitectureFlowProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Architecture</span>
        <h2 className="text-3xl font-extrabold mt-1">Continuous Cryptographic Proof System</h2>
        <p className={`text-sm mt-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          Events pass through sequential validation stages to prevent out-of-order log tampering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {ARCHITECTURE_STEPS.map((st, i) => (
          <div
            key={i}
            className={`p-6 rounded-none border text-center transition-all ${
              isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"
            }`}
          >
            <div className="w-9 h-9 mx-auto mb-4 rounded-none bg-orange-600 text-white font-mono font-bold flex items-center justify-center text-sm">
              {st.step}
            </div>
            <h3 className="font-bold text-base mb-1">{st.title}</h3>
            <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{st.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
