import { Hono } from "hono";
import type { AppEnv } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import health from "./routes/health.routes";
import ingest from "./routes/ingest.routes";
import verify from "./routes/verify.routes";

const app = new Hono<AppEnv>();

// Catches any unhandled errors from routes
app.use("*", errorMiddleware);

app.route("/", health);
app.route("/v1/ingest", ingest);
app.route("/v1/verify", verify);

export default app;
