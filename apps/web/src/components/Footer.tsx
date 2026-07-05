import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark-bg relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-gray-50 no-underline shrink-0">
              <span className="grid place-items-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#161220] to-[#0b0a10] border border-primary-glow shadow-[0_0_15px_rgba(79,70,229,0.15)_inset]">
                <svg className="w-[15px] h-[15px]" viewBox="0 0 200 200" fill="none">
                  <defs>
                    <linearGradient id="prooflog-grad-foot" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#3B82F6" />
                      <stop offset="100%" stop-color="#F97316" />
                    </linearGradient>
                  </defs>
                  <path d="M 60,40 L 120,40 A 30,30 0 0,1 120,100 L 60,100 L 60,80 L 120,80 A 10,10 0 0,0 120,60 L 60,60 Z" fill="url(#prooflog-grad-foot)" />
                  <rect x="60" y="110" width="20" height="15" rx="6" fill="url(#prooflog-grad-foot)" />
                  <rect x="60" y="135" width="20" height="15" rx="6" fill="url(#prooflog-grad-foot)" />
                  <rect x="60" y="160" width="20" height="15" rx="6" fill="url(#prooflog-grad-foot)" />
                </svg>
              </span>
              <span className="font-bold text-base tracking-tight">ProofLog</span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              Zero-trust serverless audit ledger for B2B SaaS applications. Secure your event compliance tracking with mathematical certainty.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/docs" className="text-zinc-500 hover:text-indigo-400 transition-colors no-underline">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/verification" className="text-zinc-500 hover:text-indigo-400 transition-colors no-underline">
                  Verify Ledger
                </Link>
              </li>
              <li>
                <a href="#installation" className="text-zinc-500 hover:text-indigo-400 transition-colors no-underline">
                  SDK Install
                </a>
              </li>
            </ul>
          </div>

          {/* Developer / Company Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Developers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/changelog" className="text-zinc-500 hover:text-indigo-400 transition-colors no-underline">
                  Changelog
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/RahulDew/prooflog" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-zinc-500 hover:text-indigo-400 transition-colors no-underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://npmjs.com/package/@prooflog/node" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-zinc-500 hover:text-indigo-400 transition-colors no-underline"
                >
                  NPM Registry
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs">
            Open-source on <a href="https://github.com/RahulDew/prooflog" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-indigo-400 underline transition-colors">GitHub</a>.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span>Cryptographic link chains operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
