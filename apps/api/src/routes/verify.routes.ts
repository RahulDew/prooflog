import { Hono } from "hono";
import type { AppEnv } from "../config/env";

import { verifyHandler } from "../controllers/verify.controller";
import { requireAuth } from "../middleware/auth.middleware";

const verify = new Hono<AppEnv>();

verify.get("/", requireAuth("logs:verify"), verifyHandler);

export default verify;
