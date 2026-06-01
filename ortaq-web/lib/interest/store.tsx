"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Intro = {
  id: string;
  profileSlug: string;
  partnerName: string;
  partnerType: string;
  note: string;
  status: "pending" | "accepted" | "declined";
};

type State = {
  watch: string[];
  intros: Intro[];
};

const INITIAL: State = {
  watch: [],
  intros: [],
};

const KEY = "ortaq-interest-v1";
const DEFAULT_PARTNER = "Sermaye tarafı";

type Ctx = State & {
  toggleWatch: (profileSlug: string) => void;
  isWatching: (profileSlug: string) => boolean;
  addInterest: (profileSlug: string, note: string, partnerName?: string, partnerType?: string) => void;
  pendingIntroFor: (profileSlug: string) => Intro | undefined;
};

const InterestContext = createContext<Ctx | null>(null);

export function InterestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    }
  }, [state, hydrated]);

  const toggleWatch = (profileSlug: string) =>
    setState((s) => ({
      ...s,
      watch: s.watch.includes(profileSlug) ? s.watch.filter((x) => x !== profileSlug) : [...s.watch, profileSlug],
    }));

  const isWatching = (profileSlug: string) => state.watch.includes(profileSlug);

  const addInterest = (profileSlug: string, note: string, partnerName = DEFAULT_PARTNER, partnerType = "Sermaye tarafı") =>
    setState((s) => {
      if (s.intros.some((i) => i.profileSlug === profileSlug && i.status !== "declined")) return s;
      return {
        ...s,
        intros: [
          ...s.intros,
          {
            id: `intro-${Date.now()}`,
            profileSlug,
            partnerName,
            partnerType,
            note,
            status: "pending",
          },
        ],
      };
    });

  const pendingIntroFor = (profileSlug: string) =>
    state.intros.find((i) => i.profileSlug === profileSlug && i.status === "pending");

  return (
    <InterestContext.Provider value={{ ...state, toggleWatch, isWatching, addInterest, pendingIntroFor }}>
      {children}
    </InterestContext.Provider>
  );
}

export function useInterest() {
  const ctx = useContext(InterestContext);
  if (!ctx) throw new Error("useInterest must be used within InterestProvider");
  return ctx;
}
