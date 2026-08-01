import type { NavLinkItem } from "../types/nav.types";

export type { NavLinkItem };

export const NAVBAR_CONTENT = {
  logoText: "ProofLog",
  logoBadge: "PL",
  engineVersion: "v0.1.2",
  navLinks: [
    { name: "Home", path: "/" },
    { name: "Documentation", path: "/docs" },
    { name: "Verification", path: "/verification" },
    { name: "Changelog", path: "/changelog" },
    { name: "About", path: "/about" }
  ] as NavLinkItem[],
  githubUrl: "https://github.com/RahulDew/prooflog",
  githubText: "GitHub"
};
