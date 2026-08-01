import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { NAVBAR_CONTENT } from "../constants/navbar.constants";

export function Navbar() {
  const location = useLocation();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = NAVBAR_CONTENT.navLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b backdrop-blur-md ${
        isDark
          ? "bg-[#050505]/90 border-zinc-800/80 text-zinc-100"
          : "bg-white/90 border-zinc-200 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className={`w-8 h-8 rounded-[4px] flex items-center justify-center font-mono font-bold text-xs border transition-all ${
              isDark
                ? "bg-zinc-900 border-zinc-700 text-orange-500 group-hover:border-orange-500"
                : "bg-blue-50 border-blue-200 text-blue-600 group-hover:border-blue-600"
            }`}
          >
            {NAVBAR_CONTENT.logoBadge}
          </div>
          <span className="font-extrabold text-lg tracking-tight group-hover:opacity-90">
            {NAVBAR_CONTENT.logoText}
          </span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-[4px] transition-colors ${
                  isActive
                    ? isDark
                      ? "text-white bg-zinc-800 border border-zinc-700 font-bold"
                      : "text-blue-600 bg-blue-50 border border-blue-200 font-bold"
                    : isDark
                    ? "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* GitHub Button (Desktop) */}
          <a
            href={NAVBAR_CONTENT.githubUrl}
            target="_blank"
            rel="noreferrer"
            className={`hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-[4px] border transition-colors ${
              isDark
                ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-300"
                : "border-zinc-300 bg-zinc-100 hover:border-zinc-400 text-zinc-800"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            {NAVBAR_CONTENT.githubText}
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-none border cursor-pointer transition-colors ${
              isDark
                ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700"
                : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:border-zinc-400"
            }`}
          >
            {isOpen ? <X className="w-4 h-4 text-orange-500" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isOpen && (
        <div
          className={`md:hidden border-b px-6 py-4 space-y-2 backdrop-blur-xl transition-all ${
            isDark
              ? "bg-[#050505]/98 border-zinc-800 text-zinc-100"
              : "bg-white/98 border-zinc-200 text-zinc-900"
          }`}
        >
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-xs font-mono uppercase tracking-wider px-4 py-2.5 rounded-none border transition-colors ${
                  isActive
                    ? isDark
                      ? "text-white bg-orange-500/10 border-orange-500/40 font-bold"
                      : "text-blue-600 bg-blue-50 border-blue-200 font-bold"
                    : isDark
                    ? "text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </div>
              </Link>
            );
          })}

          <div className="pt-2">
            <a
              href="https://github.com/RahulDew/prooflog"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider w-full py-2.5 rounded-none border transition-colors ${
                isDark
                  ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-300"
                  : "border-zinc-300 bg-zinc-100 hover:border-zinc-400 text-zinc-800"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub Repository
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
