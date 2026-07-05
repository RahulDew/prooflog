import { Hono } from "hono";
import type { AppEnv } from "../config/env";
import { healthHandler } from "../controllers/health.controller";

const health = new Hono<AppEnv>();

// Root page — human friendly HTML
health.get("/", (context) => {
  return context.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ProofLog API</title>
        <style>
          body { font-family: monospace; background: #0a0a0a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { text-align: center; padding: 2rem; border: 1px solid #1e293b; border-radius: 8px; }
          h1 { font-size: 1.5rem; margin: 0 0 0.5rem; color: #f8fafc; }
          p { color: #94a3b8; margin: 0 0 1rem; }
          .badge { display: inline-block; background: #16a34a22; color: #4ade80; border: 1px solid #16a34a44; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; }
          a { color: #60a5fa; text-decoration: none; font-size: 0.85rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🔐 ProofLog API</h1>
          <p>Cryptographically tamper-proof audit logging</p>
          <span class="badge">● operational</span>
          <br /><br />
          <a href="https://prooflog.dev/docs">Documentation →</a>
        </div>
      </body>
    </html>
  `);
});

// JSON health check — for monitoring/uptime tools
health.get("/health", healthHandler);

export default health;
