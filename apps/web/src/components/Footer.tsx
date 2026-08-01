import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FOOTER_CONTENT } from "../constants/footer.constants";

export function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`border-t transition-colors relative z-20 ${
        isDark
          ? "border-zinc-800 bg-[#050505] text-zinc-100"
          : "border-zinc-200 bg-white text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
              <span
                className={`grid place-items-center w-7 h-7 rounded-[4px] border font-mono font-bold text-xs ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-orange-500"
                    : "bg-zinc-100 border-zinc-300 text-blue-600"
                }`}
              >
                {FOOTER_CONTENT.brandBadge}
              </span>
              <span className="font-bold text-base tracking-tight">{FOOTER_CONTENT.brandName}</span>
            </Link>
            <p className={`text-xs max-w-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {FOOTER_CONTENT.brandDescription}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500 mb-4">
              {FOOTER_CONTENT.productTitle}
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              {FOOTER_CONTENT.productLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className={`hover:underline no-underline ${
                      isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500 mb-4">
              {FOOTER_CONTENT.developerTitle}
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              {FOOTER_CONTENT.developerLinks.map((link, idx) => (
                <li key={idx}>
                  {link.external ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`hover:underline no-underline ${
                        isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path || "/"}
                      className={`hover:underline no-underline ${
                        isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`border-t mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
            isDark ? "border-zinc-800 text-zinc-500" : "border-zinc-200 text-zinc-600"
          }`}
        >
          <p>{FOOTER_CONTENT.copyright}</p>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-[2px] bg-emerald-400" />
            <span>{FOOTER_CONTENT.bottomStatus}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
