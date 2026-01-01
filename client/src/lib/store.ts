import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'buyer' | 'seller' | 'admin';
export type Plan = 'free' | 'pro';

export interface CreditTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'earn' | 'spend' | 'topup' | 'subscription' | 'adjustment';
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  plan: Plan;
  credits: number;
  region: string;
  currency: string;
  nextRefillDate?: string; // For Pro users
}

export interface Report {
  id: string;
  title: string;
  date: string;
  category: string;
  status: 'completed' | 'generating';
  data?: any;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  moq: number;
  rating: number;
  certifications: string[];
  contact: string;
  priceRange: string;
}

export interface Shortlist {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  isPremium: boolean;
  suppliers: Supplier[];
}

interface AppState {
  user: User | null;
  reports: Report[];
  shortlists: Shortlist[];
  ledger: CreditTransaction[];
  isLoading: boolean;
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Monetization Actions
  upgradeToPro: () => void;
  buyCredits: (packId: 'pack_25' | 'pack_100' | 'pack_250') => void;
  spendCredits: (amount: number, description: string) => boolean;
  
  addReport: (report: Report) => void;
}

// Helper to generate mock suppliers
const generateSuppliers = (count: number, category: string): Supplier[] => {
  const locations = ['Shenzhen, CN', 'Ho Chi Minh, VN', 'Mumbai, IN', 'Istanbul, TR', 'Guangzhou, CN', 'Dhaka, BD'];
  const certs = ['ISO 9001', 'BSCI', 'SA8000', 'GOTS', 'FSC', 'CE', 'RoHS'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `sup-${Math.random().toString(36).substr(2, 5)}`,
    name: `${category} Global Mfg ${i+1}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    moq: Math.floor(Math.random() * 500) + 50,
    rating: 4 + Math.random(),
    certifications: [certs[Math.floor(Math.random() * certs.length)], certs[Math.floor(Math.random() * certs.length)]],
    contact: `sales@supplier${i+1}.com`,
    priceRange: `$${(Math.random() * 20 + 5).toFixed(2)} - $${(Math.random() * 40 + 25).toFixed(2)}`
  }));
};

// Mock Data with real listings
const MOCK_SHORTLISTS: Shortlist[] = [
  { id: '1', title: 'Sustainable Bamboo Packaging', category: 'Packaging', itemCount: 12, isPremium: true, suppliers: generateSuppliers(12, 'EcoPack') },
  { id: '2', title: 'High-Performance Activewear Fabrics', category: 'Textiles', itemCount: 8, isPremium: true, suppliers: generateSuppliers(8, 'SportTex') },
  { id: '3', title: 'Smart Home IoT Components', category: 'Electronics', itemCount: 15, isPremium: true, suppliers: generateSuppliers(15, 'SmartChip') },
  { id: '4', title: 'Organic Skincare Bases', category: 'Beauty', itemCount: 10, isPremium: true, suppliers: generateSuppliers(10, 'PureGlow') },
  { id: '5', title: 'Recycled PET Plastics', category: 'Materials', itemCount: 20, isPremium: true, suppliers: generateSuppliers(20, 'RePlast') },
  { id: '6', title: 'Premium Coffee Beans (Raw)', category: 'Food & Bev', itemCount: 18, isPremium: true, suppliers: generateSuppliers(18, 'BeanCo') },
  { id: '7', title: 'Minimalist Office Furniture', category: 'Furniture', itemCount: 9, isPremium: true, suppliers: generateSuppliers(9, 'ErgoWork') },
  { id: '8', title: 'Solar Panel Components', category: 'Energy', itemCount: 14, isPremium: true, suppliers: generateSuppliers(14, 'SunPower') },
  { id: '9', title: 'Luxury Leather Goods (Vegan)', category: 'Fashion', itemCount: 11, isPremium: true, suppliers: generateSuppliers(11, 'LuxVegan') },
  { id: '10', title: 'Medical Grade Silicone', category: 'Medical', itemCount: 7, isPremium: true, suppliers: generateSuppliers(7, 'MedSil') },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      reports: [],
      shortlists: MOCK_SHORTLISTS,
      ledger: [],
      isLoading: false,

      login: (email) => {
        // Mock login logic: If email contains "pro", give them pro plan, else free
        const isPro = email.toLowerCase().includes('pro');
        const plan = isPro ? 'pro' : 'free';
        const initialCredits = isPro ? 30 : 10;
        
        const newUser: User = {
          id: 'user-' + Math.random().toString(36).substr(2, 5),
          email,
          name: email.split('@')[0],
          role: 'buyer',
          plan,
          credits: initialCredits,
          region: 'North America',
          currency: 'USD',
          nextRefillDate: isPro ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : undefined
        };

        const initialTransaction: CreditTransaction = {
          id: Math.random().toString(36),
          date: new Date().toLocaleDateString(),
          amount: initialCredits,
          type: 'earn',
          description: isPro ? 'Monthly Pro Plan Refill' : 'Welcome Bonus'
        };

        set({ 
          user: newUser,
          ledger: [initialTransaction]
        });
      },

      logout: () => set({ user: null, reports: [], ledger: [] }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      upgradeToPro: () => {
        const { user } = get();
        if (!user) return;
        
        const refillAmount = 30; // Pro refill amount
        const updatedUser = {
          ...user,
          plan: 'pro' as Plan,
          credits: user.credits + refillAmount,
          nextRefillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        };

        const transaction: CreditTransaction = {
          id: Math.random().toString(36),
          date: new Date().toLocaleDateString(),
          amount: refillAmount,
          type: 'subscription',
          description: 'Upgraded to Pro Plan (+30 Credits)'
        };

        set((state) => ({
          user: updatedUser,
          ledger: [transaction, ...state.ledger]
        }));
      },

      buyCredits: (packId) => {
        const { user } = get();
        if (!user) return;

        let amount = 0;
        let cost = 0;

        switch(packId) {
          case 'pack_25': amount = 25; cost = 10; break;
          case 'pack_100': amount = 100; cost = 35; break;
          case 'pack_250': amount = 250; cost = 75; break;
        }

        const updatedUser = {
          ...user,
          credits: user.credits + amount
        };

        const transaction: CreditTransaction = {
          id: Math.random().toString(36),
          date: new Date().toLocaleDateString(),
          amount: amount,
          type: 'topup',
          description: `Credit Pack: +${amount} Credits`
        };

        set((state) => ({
          user: updatedUser,
          ledger: [transaction, ...state.ledger]
        }));
      },

      spendCredits: (amount, description) => {
        const { user } = get();
        if (!user || user.credits < amount) return false;

        const updatedUser = { ...user, credits: user.credits - amount };
        
        const transaction: CreditTransaction = {
          id: Math.random().toString(36),
          date: new Date().toLocaleDateString(),
          amount: -amount,
          type: 'spend',
          description: description
        };

        set((state) => ({
          user: updatedUser,
          ledger: [transaction, ...state.ledger]
        }));
        
        return true;
      },

      addReport: (report) => set((state) => ({
        reports: [report, ...state.reports]
      }))
    }),
    {
      name: 'smartseek-storage', // unique name
    }
  )
);