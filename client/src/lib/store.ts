import { create } from 'zustand';

export type Role = 'buyer' | 'seller' | 'admin';
export type Plan = 'free' | 'pro';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  plan: Plan;
  credits: number;
  region: string;
  currency: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  category: string;
  status: 'completed' | 'generating';
  data?: any; // Mock report data
}

export interface Shortlist {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  isPremium: boolean;
  suppliers: any[];
}

interface AppState {
  user: User | null;
  reports: Report[];
  shortlists: Shortlist[];
  isLoading: boolean;
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  addReport: (report: Report) => void;
}

// Mock Data
const MOCK_SHORTLISTS: Shortlist[] = [
  { id: '1', title: 'Sustainable Bamboo Packaging', category: 'Packaging', itemCount: 12, isPremium: true, suppliers: [] },
  { id: '2', title: 'High-Performance Activewear Fabrics', category: 'Textiles', itemCount: 8, isPremium: true, suppliers: [] },
  { id: '3', title: 'Smart Home IoT Components', category: 'Electronics', itemCount: 15, isPremium: true, suppliers: [] },
  { id: '4', title: 'Organic Skincare Bases', category: 'Beauty', itemCount: 10, isPremium: false, suppliers: [] },
];

export const useStore = create<AppState>((set, get) => ({
  user: null, // Start logged out
  reports: [],
  shortlists: MOCK_SHORTLISTS,
  isLoading: false,

  login: (email) => set({
    user: {
      id: 'user-1',
      email,
      name: email.split('@')[0],
      role: 'buyer',
      plan: 'free',
      credits: 10, // Default free credits
      region: 'North America',
      currency: 'USD'
    }
  }),

  logout: () => set({ user: null }),

  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),

  addCredits: (amount) => set((state) => ({
    user: state.user ? { ...state.user, credits: state.user.credits + amount } : null
  })),

  spendCredits: (amount) => {
    const { user } = get();
    if (!user || user.credits < amount) return false;
    set({ user: { ...user, credits: user.credits - amount } });
    return true;
  },

  addReport: (report) => set((state) => ({
    reports: [report, ...state.reports]
  }))
}));