export interface SidebarLink {
  name: string;
  id: string;
  iconName: "Zap" | "Terminal" | "Code" | "Book";
}

export interface DocSection {
  id: string;
  title: string;
  description: string;
  codeBlock?: string;
  codeLanguage?: string;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  { name: "Introduction", id: "introduction", iconName: "Zap" },
  { name: "Installation", id: "installation", iconName: "Terminal" },
  { name: "Basic Ingestion", id: "basic-usage", iconName: "Code" },
  { name: "Idempotency & Hardening", id: "advanced-usage", iconName: "Book" }
];

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction to ProofLog",
    description: "ProofLog is a zero-trust audit logging system. Every log you ingest is hashed and cryptographically linked to the previous one, forming an unbreakable chain. If a historical entry is modified, the validation breaks instantly."
  },
  {
    id: "installation",
    title: "Quick Installation",
    description: "Add the ProofLog Node.js client package to your project using your preferred package manager:",
    codeBlock: "$ pnpm add @prooflog/node",
    codeLanguage: "terminal"
  },
  {
    id: "basic-usage",
    title: "Basic Ingestion",
    description: "Initialize the ProofLog client with your API key, and call ingest to log an action. Each event is mapped to a project context resolved from your authentication token:",
    codeBlock: `import { ProofLog } from '@prooflog/node';\n\nconst client = new ProofLog({ apiKey: 'YOUR_API_KEY' });\nawait client.ingest('org_123', {\n  action: 'user.login',\n  actor: { id: 'usr_1' }\n});`,
    codeLanguage: "typescript"
  },
  {
    id: "advanced-usage",
    title: "Idempotency & Hardening",
    description: "Guarantee safe retry delivery under network faults by passing a unique idempotency key. You can also specify advanced cryptographic algorithms and ledger version structures:",
    codeBlock: `await client.ingest('org_123', {\n  action: 'billing.invoice_paid',\n  actor: { id: 'usr_99' },\n  idempotencyKey: 'request_uuid_xyz',\n  chainVersion: 2, // cryptographically binds version metadata\n  hashAlgorithm: 'sha512' // options: sha256 | sha384 | sha512\n});`,
    codeLanguage: "typescript"
  }
];
