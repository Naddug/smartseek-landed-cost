"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginHref } from "@/lib/auth/routes";

export function useAuthGate() {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  function requireAuth(targetPath: string) {
    if (isAuthenticated) {
      router.push(targetPath);
      return;
    }
    router.push(loginHref(targetPath));
  }

  return { isAuthenticated, isLoading, requireAuth };
}
