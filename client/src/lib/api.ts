import type {
  UserProfile,
  CreditTransaction,
  Report,
  SupplierShortlist,
  SourcingRequest,
} from "@shared/schema";

const API_BASE = "/api";

// Helper for API calls
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// User & Profile
export const userAPI = {
  getUser: () => fetchAPI<{ id: string; email: string; firstName?: string; lastName?: string }>("/auth/user"),
  getProfile: () => fetchAPI<UserProfile>("/profile"),
  updateProfile: (data: { region?: string; currency?: string }) =>
    fetchAPI<UserProfile>("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Credits
export const creditsAPI = {
  getTransactions: () => fetchAPI<CreditTransaction[]>("/credits/transactions"),
};

// Reports (Smart Finder)
export const reportsAPI = {
  create: (data: {
    title: string;
    category: string;
    formData: any;
  }) =>
    fetchAPI<Report>("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: () => fetchAPI<Report[]>("/reports"),
  getById: (id: number) => fetchAPI<Report>(`/reports/${id}?_t=${Date.now()}`),
};

// Supplier Shortlists
export const shortlistsAPI = {
  getAll: (category?: string) => {
    const url = category ? `/shortlists?category=${encodeURIComponent(category)}` : "/shortlists";
    return fetchAPI<SupplierShortlist[]>(url);
  },
  getById: (id: number) => fetchAPI<SupplierShortlist>(`/shortlists/${id}`),
};

// Sourcing Requests
export const sourcingRequestsAPI = {
  create: (data: { title: string; description: string }) =>
    fetchAPI<SourcingRequest>("/sourcing-requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: () => fetchAPI<SourcingRequest[]>("/sourcing-requests"),
};

// Admin APIs
export const adminAPI = {
  shortlists: {
    create: (data: { title: string; category: string; isPremium: boolean; suppliers: any }) =>
      fetchAPI<SupplierShortlist>("/admin/shortlists", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<SupplierShortlist>) =>
      fetchAPI<SupplierShortlist>(`/admin/shortlists/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI<void>(`/admin/shortlists/${id}`, {
        method: "DELETE",
      }),
  },
  sourcingRequests: {
    getAll: () => fetchAPI<SourcingRequest[]>("/admin/sourcing-requests"),
    update: (id: number, data: Partial<SourcingRequest>) =>
      fetchAPI<SourcingRequest>(`/admin/sourcing-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
};
