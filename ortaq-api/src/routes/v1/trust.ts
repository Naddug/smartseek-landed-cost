import { Router } from "express";
import {
  listCampaigns,
  listTransparency,
  platformSnapshot,
} from "../../domain/store.js";
import { getManipulationDefaults } from "../../services/fraud-service.js";

export const trustRouter = Router();

/** GET /v1/trust/platform — public platform trust snapshot */
trustRouter.get("/platform", (_req, res) => {
  res.json({
    ...platformSnapshot,
    manipulationPrevention: getManipulationDefaults(),
  });
});

/** GET /v1/trust/transparency — public accountability feed */
trustRouter.get("/transparency", (_req, res) => {
  res.json({ items: listTransparency() });
});

/** GET /v1/trust/campaigns — public campaign verification summaries */
trustRouter.get("/campaigns", (_req, res) => {
  res.json({ items: listCampaigns() });
});
