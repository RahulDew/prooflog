import { Hono } from "hono";
import type { AppEnv } from "./config/env";
import { cors } from "hono/cors";
import { errorMiddleware } from "./middleware/error.middleware";
import { rateLimit } from "./middleware/rate-limit.middleware";
import health from "./routes/health.routes";
import ingest from "./routes/ingest.routes";
import verify from "./routes/verify.routes";
import entries from "./routes/entries.routes";

const app = new Hono<AppEnv>();

// Register CORS to allow frontend dashboard integrations
app.use("*", cors());

// Catches any unhandled errors from routes
app.use("*", errorMiddleware);

// Applies sliding-window rate-limiting to all endpoints
app.use("*", rateLimit({ windowMs: 60_000, maxRequests: 100 }));

app.route("/", health);
app.route("/v1/ingest", ingest);
app.route("/v1/verify", verify);
app.route("/v1/entries", entries);

export default app;
