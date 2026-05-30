import { Router } from "express";
import { getCampaign } from "../../domain/store.js";

export const campaignsRouter = Router();

/** GET /v1/campaigns/:slug — public campaign trust snapshot */
campaignsRouter.get("/:slug", (req, res) => {
  const campaign = getCampaign(req.params.slug);
  if (!campaign) {
    res.status(404).json({ error: "campaign_not_found" });
    return;
  }
  res.json(campaign);
});
