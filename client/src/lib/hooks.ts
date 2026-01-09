import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI, creditsAPI, reportsAPI, shortlistsAPI, sourcingRequestsAPI } from "./api";
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
