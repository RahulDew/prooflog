import { Hono } from "hono";
import type { AppEnv } from "../config/env";

import { verifyHandler } from "../controllers/verify.controller";

const verify = new Hono<AppEnv>();

verify.get("/", verifyHandler);

export default verify;
