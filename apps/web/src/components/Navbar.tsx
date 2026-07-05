import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Docs", path: "/docs" },
    { name: "Verification", path: "/verification" },
    { name: "Changelog", path: "/changelog" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-dark-bg pointer-events-none opacity-0 transition-opacity duration-500 grid place-items-center">
        <span className="w-8 h-8 border-2 border-solid border-blue-400 border-t-blue-500/25 border-r-blue-500/25 rounded-full opacity-0 animate-nav-glow"></span>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[120] h-16 backdrop-blur-md bg-dark-bg/75 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-gray-50 no-underline shrink-0"
          >
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#161220] to-[#0b0a10] border border-primary-glow shadow-[0_0_18px_rgba(79,70,229,0.2)_inset,0_0_14px_rgba(79,70,229,0.14)]">
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 200 200"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="prooflog-grad-nav"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stop-color="#3B82F6" />
                    <stop offset="100%" stop-color="#F97316" />
                  </linearGradient>
                </defs>
                <path
                  d="M 60,40 L 120,40 A 30,30 0 0,1 120,100 L 60,100 L 60,80 L 120,80 A 10,10 0 0,0 120,60 L 60,60 Z"
                  fill="url(#prooflog-grad-nav)"
                />
                <rect
                  x="60"
                  y="110"
                  width="20"
                  height="15"
                  rx="6"
                  fill="url(#prooflog-grad-nav)"
                />
                <rect
                  x="60"
                  y="135"
                  width="20"
                  height="15"
                  rx="6"
                  fill="url(#prooflog-grad-nav)"
                />
                <rect
                  x="60"
                  y="160"
                  width="20"
                  height="15"
                  rx="6"
                  fill="url(#prooflog-grad-nav)"
                />
              </svg>
            </span>
            <span className="font-bold text-base tracking-tight">ProofLog</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== "/" && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[13.5px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "text-gray-50 bg-blue-500/15"
                      : "text-zinc-400 hover:text-gray-200 bg-transparent hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://github.com/RahulDew/prooflog"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-zinc-200 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>

            <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-zinc-200">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
