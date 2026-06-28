import { Search, ShieldCheck, Database, ArrowRight } from "lucide-react"

export default function Verification() {
  return (
    <div className="pt-24 min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(800px_600px_at_50%_20%,rgba(79,70,229,0.12),transparent_70%)]" />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#161220] to-[#0b0a10] border border-primary-glow shadow-[0_0_30px_rgba(79,70,229,0.15)_inset] mb-8">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-50 tracking-tight mb-4">
          Verify Log Integrity
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Enter an organization ID or a specific log hash to mathematically prove that the audit trail has not been tampered with.
        </p>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
          <div className="relative flex items-center bg-[#0c0b10]/90 border border-white/10 rounded-2xl backdrop-blur-xl p-2 shadow-2xl">
            <div className="pl-4 pr-2">
              <Search className="w-5 h-5 text-zinc-500" />
            </div>
            <input 
              type="text" 
              placeholder="Enter Organization ID (e.g. org_123)..." 
              className="flex-1 bg-transparent border-none outline-none text-gray-50 placeholder:text-zinc-600 px-2 py-3"
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
              Verify
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mock Result Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-20">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-left">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-gray-200">Total Logs</h3>
            </div>
            <p className="text-3xl font-bold text-gray-50">14.2M</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-left md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <h3 className="font-semibold text-gray-200">System Status</h3>
            </div>
            <p className="text-zinc-400">All cryptographic chains are mathematically sound. Zero tampering detected across all active organizations.</p>
          </div>
        </div>

      </main>
    </div>
  )
}
