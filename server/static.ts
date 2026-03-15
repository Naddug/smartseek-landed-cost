import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { injectSeoMeta } from "./seo";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Cache the index.html content at startup so we don't hit the disk on every request
  const indexHtmlPath = path.resolve(distPath, "index.html");
  let indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  app.use(express.static(distPath));

  // For every non-asset GET request, inject path-specific SEO meta and serve
  app.use("*", (req: Request, res: Response) => {
    const pathname = req.originalUrl.split("?")[0];

    // Skip non-HTML requests (assets already handled by express.static above)
    if (pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|otf|json|txt|xml|webp|avif)$/i)) {
      return res.status(404).send("Not found");
    }

    const html = injectSeoMeta(indexHtml, pathname);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });
}
