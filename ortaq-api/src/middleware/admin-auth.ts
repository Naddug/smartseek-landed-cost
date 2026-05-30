import type { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";

/** Protect /admin/* routes — API key in production */
export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const key = req.header("x-ortaq-admin-key");
  if (!config.adminApiKey) {
    if (config.env === "production") {
      res.status(503).json({ error: "admin_not_configured" });
      return;
    }
    next();
    return;
  }
  if (key !== config.adminApiKey) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  next();
}
