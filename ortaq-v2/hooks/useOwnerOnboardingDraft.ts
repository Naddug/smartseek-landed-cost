"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_OWNER_ONBOARDING,
  type OwnerOnboardingState,
} from "@/types/opportunity-dossier";

const STORAGE_KEY = "ortaq-owner-onboarding-draft";

export function useOwnerOnboardingDraft(initial?: OwnerOnboardingState) {
  const [draft, setDraft] = useState<OwnerOnboardingState>(
    initial ?? EMPTY_OWNER_ONBOARDING
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
        setDraft({ ...EMPTY_OWNER_ONBOARDING, ...JSON.parse(saved) });
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

  const updateDraft = useCallback((patch: Partial<OwnerOnboardingState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_OWNER_ONBOARDING);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { draft, updateDraft, resetDraft, hydrated };
}
