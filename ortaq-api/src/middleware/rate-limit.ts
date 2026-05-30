import type { Request, Response, NextFunction } from "express";

const hits = new Map<string, { count: number; resetAt: number }>();

/** Basic in-memory rate limit — replace with Redis at scale */
export function rateLimit(maxPerWindow: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= maxPerWindow) {
      res.status(429).json({ error: "rate_limit_exceeded" });
      return;
    }

    entry.count += 1;
    next();
  };
}
