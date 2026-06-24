"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_PARTNER_ONBOARDING,
  type PartnerOnboardingState,
} from "@/types/profile-onboarding";

const STORAGE_KEY = "ortaq-partner-onboarding-draft";

export function usePartnerOnboardingDraft(initial?: PartnerOnboardingState) {
  const [draft, setDraft] = useState<PartnerOnboardingState>(
    initial ?? EMPTY_PARTNER_ONBOARDING
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (initial) {
      setDraft(initial);
      setHydrated(true);
      return;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDraft({ ...EMPTY_PARTNER_ONBOARDING, ...JSON.parse(saved) });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [initial]);

  useEffect(() => {
    if (!hydrated || initial) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft, hydrated, initial]);

  const updateDraft = useCallback((patch: Partial<PartnerOnboardingState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_PARTNER_ONBOARDING);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { draft, updateDraft, resetDraft, hydrated };
}
