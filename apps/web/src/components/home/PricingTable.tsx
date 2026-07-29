import { PRICING_ROWS } from "../../constants/home.constants";

interface PricingTableProps {
  isDark: boolean;
}

export function PricingTable({ isDark }: PricingTableProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="text-left mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Licensing</span>
        <h2 className="text-3xl font-extrabold mt-1">Transparent, Clear Licensing</h2>
      </div>

      <div className={`rounded-none border overflow-hidden ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800 bg-black/40 text-zinc-400" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
                <th className="py-4 px-6 font-semibold">Feature</th>
                <th className="py-4 px-6 font-semibold">Self-Hosted</th>
                <th className="py-4 px-6 font-semibold">Cloud</th>
                <th className="py-4 px-6 font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-zinc-800/60" : "divide-zinc-200"}`}>
              {PRICING_ROWS.map((row, i) => (
                <tr key={i} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"}>
                  <td className="py-4 px-6 font-bold">{row.feature}</td>
                  <td className={`py-4 px-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{row.self}</td>
                  <td className="py-4 px-6 text-blue-500 font-medium">{row.cloud}</td>
                  <td className="py-4 px-6 text-orange-500 font-medium">{row.ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
