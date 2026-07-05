import { useState, type FormEvent } from "react"
import { ShieldCheck, Database, ArrowRight, AlertTriangle, CheckCircle, RefreshCw, Key } from "lucide-react"
import { API_BASE_URL } from "../constants/config.constants"

interface VerifyResult {
  valid: boolean
  totalEntries: number
  tamperedAt?: number
  reason?: string
  expectedHash?: string
  actualHash?: string
  failedTimestamp?: string
}

export default function Verification() {
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerifyResult | null>(null)

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) {
      setError("Please enter a valid API key")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/v1/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey.trim()}`,
        },
      })

      const json = await response.json()
      if (!response.ok || !json.success) {
        setError(json.error || "Failed to execute cryptographic verification check.")
      } else {
        setResult(json.data)
      }
    } catch (err: any) {
      console.error("Verification failed:", err)
      setError("Unable to connect to the backend verification service. Make sure apps/api is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 min-h-screen relative pb-24">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(800px_600px_at_50%_20%,rgba(59,130,246,0.08),transparent_70%)]" />

      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#161220] to-[#0b0a10] border border-primary-glow shadow-[0_0_30px_rgba(59,130,246,0.15)_inset] mb-8">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-50 tracking-tight mb-4">
          Verify Log Integrity
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Authenticate using your API key to mathematically prove that your organization's ledger has not been tampered with.
        </p>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
          <div className="relative flex items-center bg-[#0c0b10]/90 border border-white/10 rounded-2xl backdrop-blur-xl p-2 shadow-2xl">
            <div className="pl-4 pr-2">
              <Key className="w-5 h-5 text-zinc-500" />
            </div>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key (pl_live_...)" 
              className="flex-1 bg-transparent border-none outline-none text-gray-50 placeholder:text-zinc-600 px-2 py-3"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-500 hover:to-orange-500 disabled:from-blue-600/50 disabled:to-orange-600/50 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-3 justify-center">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result States */}
        {result && (
          <div className="max-w-2xl mx-auto mt-12 text-left animate-fade-in">
            {result.valid ? (
              <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-bold text-gray-50">Chain Verified Successfully</h3>
                </div>
                <p className="text-zinc-300 mb-4 leading-relaxed">
                  All audit logs for this organization are mathematically sound. The cryptographic chain links are fully intact, proving zero data modification has occurred.
                </p>
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Verified {result.totalEntries} entries
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-bold text-gray-50">Tampering Detected</h3>
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed">
                  A cryptographic discrepancy was identified at sequence <strong className="text-red-400 font-semibold">{result.tamperedAt}</strong>. 
                  Reason: <code className="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-mono">{result.reason}</code>
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Expected Hash (Calculated from payload)</h4>
                    <div className="p-3.5 rounded-xl border border-white/10 bg-[#07060a] font-mono text-xs text-blue-300 break-all select-all">
                      {result.expectedHash}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Actual Hash (Stored in database)</h4>
                    <div className="p-3.5 rounded-xl border border-white/10 bg-[#07060a] font-mono text-xs text-red-400 break-all select-all">
                      {result.actualHash}
                    </div>
                  </div>
                  {result.failedTimestamp && (
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Block Creation Date</h4>
                      <div className="p-3.5 rounded-xl border border-white/10 bg-[#07060a] font-mono text-xs text-zinc-400">
                        {new Date(result.failedTimestamp).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global Statistics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-20">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-left">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-gray-200">System Mode</h3>
            </div>
            <p className="text-2xl font-bold text-gray-50">Hosted Ledger</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-left md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-200">Security Standard</h3>
            </div>
            <p className="text-zinc-400">Ledgers use cryptographic hash chaining with SHA-256/384/512 configurations and bound parameters to prevent out-of-order modification attacks.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
