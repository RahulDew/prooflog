export interface NavLinkItem {
  name: string;
  path: string;
  badge?: string;
}

export const NAVBAR_CONTENT = {
  logoText: "ProofLog",
  logoBadge: "PL",
  engineVersion: "v0.1.2",
  navLinks: [
    { name: "Home", path: "/" },
    { name: "Documentation", path: "/docs" },
    { name: "Verification", path: "/verification" },
    { name: "Changelog", path: "/changelog", badge: "v0.1.2" }
  ] as NavLinkItem[],
  githubUrl: "https://github.com/RahulDew/prooflog",
  githubText: "GitHub"
};
