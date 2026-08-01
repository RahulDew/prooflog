export const VERIFICATION_CONTENT = {
  badge: "Live Portal — Coming Soon",
  title: "Cryptographic Chain Verification",
  description:
    "The web-based hosted verification dashboard is currently under deployment. Zero-trust chain verification is fully operational via the Node.js SDK primitive.",
  pipelineTag: "Cryptographic Verification Pipeline (SHA-256)",
  pipelineBadge: "SDK PRIMITIVE ACTIVE",
  featureCards: [
    {
      title: "Sequential Hash Linking",
      desc: "Re-computes SHA-256 digests across historical event payloads."
    },
    {
      title: "Zero-Trust Tamper Alert",
      desc: "Detects modified database bytes instantly with zero false positives."
    }
  ],
  formSection: {
    title: "Web Verification Portal",
    ribbon: "COMING SOON",
    label: "API Key (Hosted Portal Disabled)",
    placeholder: "Web form verification will be live soon — Use SDK verification below",
    buttonText: "Verify Chain (Web Form Disabled — Coming Soon)"
  },
  sdkSection: {
    tag: "Active Alternative",
    title: "Execute Verification via Node.js SDK",
    description:
      "Run zero-trust cryptographic chain validation programmatically in your microservices or background health checks:",
    codeSnippet: `import { ProofLog } from '@prooflog/node';

const client = new ProofLog({ apiKey: process.env.PROOFLOG_API_KEY });

// Execute zero-trust cryptographic chain verification locally
const result = await client.verifyChain('org_1234');
console.log('Chain Intact:', result.valid);`,
    linkText: "Read Documentation",
    linkUrl: "/docs",
    linkPrompt: "Need documentation on client.verifyChain()?"
  }
};
