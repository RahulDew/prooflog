import { Hono } from "hono";
import type { AppEnv } from "../config/env";
import { authMiddleware } from "../middleware/auth.middleware";
import { verifyHandler } from "../controllers/verify.controller";

const verify = new Hono<AppEnv>();

verify.get("/", authMiddleware, verifyHandler);

export default verify;
