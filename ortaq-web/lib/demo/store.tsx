"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MANUFACTURERS } from "./data";

export type DocStatus = "missing" | "reviewing" | "verified";
export type Doc = { id: string; name: string; status: DocStatus };
export type Intro = { id: string; manufacturerId: string; partnerName: string; partnerType: string; note: string; status: "pending" | "accepted" | "declined" };
export type Msg = { id: string; from: "capital" | "manufacturer"; text: string; ts: number };
export type Room = { id: string; manufacturerId: string; partnerName: string; messages: Msg[] };

type State = { docs: Doc[]; intros: Intro[]; watch: string[]; rooms: Room[] };

const ME = MANUFACTURERS[0].id;

const INITIAL: State = {
  docs: [
    { id: "d1", name: "İhracat kaydı", status: "verified" },
    { id: "d2", name: "Üretim kapasitesi raporu", status: "verified" },
    { id: "d3", name: "Tekrar eden alıcı talebi", status: "verified" },
    { id: "d4", name: "Bağımsız denetim raporu", status: "missing" },
    { id: "d5", name: "Tedarik sözleşmeleri", status: "missing" },
  ],
  intros: [
    { id: "i1", manufacturerId: ME, partnerName: "Anatolia Growth Partners", partnerType: "Büyüme fonu", note: "Kapasite yatırımı tezimize uyuyor; görüşmek isteriz.", status: "pending" },
  ],
  watch: ["anadolu-cam-kayseri"],
  rooms: [],
};

const KEY = "ortaq-demo-v2";

export type ProfileVisibility = "draft" | "reviewing" | "live";

type Ctx = State & {
  me: string;
  profileVisibility: ProfileVisibility;
  uploadDoc: (id: string) => void;
  toggleWatch: (id: string) => void;
  addIntro: (manufacturerId: string, partnerName: string, partnerType: string, note: string) => void;
  setIntro: (id: string, status: "accepted" | "declined") => void;
  roomForManufacturer: (manId: string) => Room | undefined;
  addMessage: (roomId: string, from: "capital" | "manufacturer", text: string) => void;
};

const DemoContext = createContext<Ctx | null>(null);

function deriveVisibility(docs: Doc[]): ProfileVisibility {
  if (docs.some((d) => d.status === "reviewing")) return "reviewing";
  if (docs.every((d) => d.status === "verified")) return "live";
  return "draft";
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    }
  }, [state, hydrated]);

  const profileVisibility = deriveVisibility(state.docs);

  const uploadDoc = (id: string) => {
    setState((s) => ({ ...s, docs: s.docs.map((d) => d.id === id ? { ...d, status: "reviewing" } : d) }));
    setTimeout(() => {
      setState((s) => ({ ...s, docs: s.docs.map((d) => d.id === id ? { ...d, status: "verified" } : d) }));
    }, 1400);
  };

  const toggleWatch = (id: string) =>
    setState((s) => ({ ...s, watch: s.watch.includes(id) ? s.watch.filter((x) => x !== id) : [...s.watch, id] }));

  const addIntro = (manufacturerId: string, partnerName: string, partnerType: string, note: string) =>
    setState((s) => {
      if (s.intros.some((i) => i.manufacturerId === manufacturerId && i.partnerName === partnerName && i.status !== "declined")) return s;
      return { ...s, intros: [...s.intros, { id: `i${Date.now()}`, manufacturerId, partnerName, partnerType, note, status: "pending" }] };
    });

  const setIntro = (id: string, status: "accepted" | "declined") =>
    setState((s) => {
      const intro = s.intros.find((i) => i.id === id);
      const intros = s.intros.map((i) => i.id === id ? { ...i, status } : i);
      let rooms = s.rooms;
      if (intro && status === "accepted" && !s.rooms.some((r) => r.manufacturerId === intro.manufacturerId && r.partnerName === intro.partnerName)) {
        rooms = [...s.rooms, {
          id: `room-${intro.id}`, manufacturerId: intro.manufacturerId, partnerName: intro.partnerName,
          messages: [{ id: "m0", from: "manufacturer", text: "Merhaba. 1.2M USD CNC hattı yatırımı ve mevcut sipariş defterini konuşmaya hazırız. Sorularınızı bekliyoruz.", ts: Date.now() }],
        }];
      }
      return { ...s, intros, rooms };
    });

  const roomForManufacturer = (manId: string) => state.rooms.find((r) => r.manufacturerId === manId);

  const addMessage = (roomId: string, from: "capital" | "manufacturer", text: string) =>
    setState((s) => ({ ...s, rooms: s.rooms.map((r) => r.id === roomId ? { ...r, messages: [...r.messages, { id: `m${Date.now()}`, from, text, ts: Date.now() }] } : r) }));

  return (
    <DemoContext.Provider value={{ ...state, me: ME, profileVisibility, uploadDoc, toggleWatch, addIntro, setIntro, roomForManufacturer, addMessage }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
