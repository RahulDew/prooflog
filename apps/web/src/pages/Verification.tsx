import { useState, type FormEvent } from "react";
import { ShieldCheck, Database, ArrowRight, AlertTriangle, CheckCircle, RefreshCw, Key } from "lucide-react";
import { API_BASE_URL } from "../constants/config.constants";
import { useTheme } from "../context/ThemeContext";

interface VerifyResult {
  valid: boolean;
  totalEntries: number;
  tamperedAt?: number;
  reason?: string;
  expectedHash?: string;
  actualHash?: string;
  failedTimestamp?: string;
}

interface AuditEntry {
  sequence: number;
  action: string;
  actor: Record<string, unknown>;
  hash: string;
  createdAt: string;
}

export default function Verification() {
  const { isDark } = useTheme();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setEntries(null);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
        },
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        setError(json.error || "Failed to execute cryptographic verification check.");
        return;
      }

      setResult(json.data);

      setLoadingEntries(true);
      try {
        const entriesResponse = await fetch(`${API_BASE_URL}/v1/entries?limit=10&order=desc`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
          },
        });
        const entriesJson = await entriesResponse.json();
        if (entriesResponse.ok && entriesJson.success) {
          setEntries(entriesJson.data.data);
        }
      } catch (entriesErr) {
        console.error("Failed to load entries:", entriesErr);
      } finally {
        setLoadingEntries(false);
      }
    } catch (err: unknown) {
      console.error("Verification failed:", err);
      setError("Unable to connect to the backend verification service. Make sure apps/api is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`pt-24 min-h-screen relative pb-24 transition-colors ${
        isDark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          className={`grid place-items-center w-16 h-16 mx-auto rounded-none border mb-8 ${
            isDark ? "bg-[#0a0a0c] border-zinc-800 text-blue-400" : "bg-zinc-100 border-zinc-300 text-blue-600"
          }`}
        >
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Verify Log Integrity
        </h1>
        <p className={`text-sm max-w-2xl mx-auto mb-10 leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          Authenticate using your API key to mathematically prove that your organization's ledger has not been tampered with.
        </p>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="max-w-2xl mx-auto relative">
          <div
            className={`flex items-center border rounded-none p-2 ${
              isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"
            }`}
          >
            <div className="pl-4 pr-2">
              <Key className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key (pl_live_...)"
              className={`flex-1 bg-transparent border-none outline-none font-mono text-xs px-2 py-3 ${
                isDark ? "text-zinc-100 placeholder:text-zinc-600" : "text-zinc-900 placeholder:text-zinc-400"
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-6 py-3 rounded-none font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0"
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
          <div className="max-w-2xl mx-auto mt-8 p-4 rounded-none border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-3 justify-center">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result States */}
        {result && (
          <div className="max-w-2xl mx-auto mt-12 text-left">
            {result.valid ? (
              <div className="p-6 rounded-none border border-emerald-500/30 bg-emerald-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-bold">Chain Verified Successfully</h3>
                </div>
                <p className={`text-sm mb-4 leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  All audit logs for this organization are mathematically sound. The cryptographic chain links are fully intact, proving zero data modification has occurred.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                  Verified {result.totalEntries} entries
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-none border border-red-500/30 bg-red-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-bold">Tampering Detected</h3>
                </div>
                <p className={`text-sm mb-6 leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  A cryptographic discrepancy was identified at sequence <strong className="text-red-400 font-mono">{result.tamperedAt}</strong>. Reason: <code className="px-1.5 py-0.5 rounded-none bg-red-500/20 text-red-400 text-xs font-mono">{result.reason}</code>
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">Expected Hash</h4>
                    <div className="p-3.5 rounded-none border border-zinc-800 bg-black font-mono text-xs text-blue-400 break-all select-all">
                      {result.expectedHash}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">Actual Hash</h4>
                    <div className="p-3.5 rounded-none border border-zinc-800 bg-black font-mono text-xs text-red-400 break-all select-all">
                      {result.actualHash}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Audit Logs Panel */}
            {(loadingEntries || (entries && entries.length > 0)) && (
              <div className={`mt-8 p-6 rounded-none border text-left ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
                <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  <span>Recent Audit Log Entries</span>
                </h3>

                {loadingEntries ? (
                  <div className="flex items-center gap-3 text-zinc-500 py-4 justify-center font-mono text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading logs...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries?.map((entry) => (
                      <div key={entry.sequence} className={`p-4 rounded-none border font-mono ${isDark ? "bg-black/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded-none bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                              #{entry.sequence}
                            </span>
                            <span className="font-bold text-sm">{entry.action}</span>
                          </div>
                          <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>{new Date(entry.createdAt).toLocaleString()}</span>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                          <div>
                            <span className={`font-bold block mb-1 ${isDark ? "text-zinc-500" : "text-zinc-700"}`}>Actor:</span>
                            <pre className={`p-2 rounded-none overflow-x-auto text-[10px] border ${isDark ? "bg-black/40 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-800"}`}>
                              {JSON.stringify(entry.actor, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className={`font-bold block mb-1 ${isDark ? "text-zinc-500" : "text-zinc-700"}`}>Hash:</span>
                            <pre className={`p-2 rounded-none overflow-x-auto text-[10px] break-all whitespace-pre-wrap border ${isDark ? "bg-black/40 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-800"}`}>
                              {entry.hash}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
