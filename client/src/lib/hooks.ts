import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI, creditsAPI, reportsAPI, shortlistsAPI, sourcingRequestsAPI, leadsAPI, calculationsAPI } from "./api";
import { toast } from "sonner";

// User & Profile
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: userAPI.getUser,
    retry: false,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: userAPI.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

// Credits
export function useCreditTransactions() {
  return useQuery({
    queryKey: ["credits", "transactions"],
    queryFn: creditsAPI.getTransactions,
  });
}

// Reports
export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: reportsAPI.getAll,
  });
}

export function useReport(id: number) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportsAPI.getById(id),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // Refresh credits
      toast.success("Report generation started! Check back in a moment.");
    },
    onError: (error: Error) => {
      if (error.message.includes("Insufficient credits")) {
        toast.error("Insufficient credits. Please upgrade or buy more credits.");
      } else {
        toast.error(error.message || "Failed to create report");
      }
    },
  });
}

// Supplier Shortlists
export function useShortlists(category?: string) {
  return useQuery({
    queryKey: ["shortlists", category],
    queryFn: () => shortlistsAPI.getAll(category),
  });
}

export function useShortlist(id: number) {
  return useQuery({
    queryKey: ["shortlists", id],
    queryFn: () => shortlistsAPI.getById(id),
    enabled: !!id,
  });
}

// Sourcing Requests
export function useSourcingRequests() {
  return useQuery({
    queryKey: ["sourcing-requests"],
    queryFn: sourcingRequestsAPI.getAll,
  });
}

export function useCreateSourcingRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sourcingRequestsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sourcing-requests"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // Refresh credits
      toast.success("Sourcing request submitted! Our team will review it shortly.");
    },
    onError: (error: Error) => {
      if (error.message.includes("Insufficient credits")) {
        toast.error("Insufficient credits (10 required). Please upgrade or buy more credits.");
      } else {
        toast.error(error.message || "Failed to submit sourcing request");
      }
    },
  });
}

// Leads
export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: leadsAPI.getAll,
  });
}

export function useLeadHistory() {
  return useQuery({
    queryKey: ["leads", "history"],
    queryFn: leadsAPI.getHistory,
  });
}

export function useLeadReport(id: number) {
  return useQuery({
    queryKey: ["leads", "report", id],
    queryFn: () => leadsAPI.getReport(id),
    enabled: !!id,
  });
}

// Calculations
export function useCustomsCalculations() {
  return useQuery({
    queryKey: ["calculations", "customs"],
    queryFn: calculationsAPI.getCustoms,
  });
}

export function useShippingEstimates() {
  return useQuery({
    queryKey: ["calculations", "shipping"],
    queryFn: calculationsAPI.getShipping,
  });
}

// Public supplier search — used by /search page.
// Auth-aware: guests get guestLimited=true from server; authenticated users see more.
// Query is enabled only when q is non-empty.
interface PublicSupplierSearchResult {
  suppliers: {
    id: string;
    companyName: string;
    slug: string;
    country: string;
    city: string;
    industry: string;
    products: string[];
    verified: boolean;
    rating: number;
    employeeCount: number | null;
    dataSource?: string | null;
  }[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  guestLimited: boolean;
  freeLimit: number;
  fallback: boolean;
}

export function usePublicSupplierSearch(q: string) {
  return useQuery<PublicSupplierSearchResult>({
    queryKey: ["publicSearch", q.trim()],
    queryFn: async () => {
      // limit=6: server caps guests at FREE_LIMIT (3) via guestLimited flag.
      // Authenticated users get up to 6 previews; full search is at /app/suppliers.
      const res = await fetch(
        `/api/suppliers?q=${encodeURIComponent(q.trim())}&limit=6`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error(`Search failed: HTTP ${res.status}`);
      const json = await res.json();
      return {
        suppliers: Array.isArray(json.suppliers) ? json.suppliers : [],
        pagination: json.pagination ?? { total: 0, page: 1, limit: 6, totalPages: 0 },
        guestLimited: json.guestLimited === true,
        freeLimit: Number(json.freeLimit) || 3,
        fallback: json.fallback === true,
      };
    },
    enabled: q.trim().length > 0,
    staleTime: 30_000,
    retry: 1,
  });
}
