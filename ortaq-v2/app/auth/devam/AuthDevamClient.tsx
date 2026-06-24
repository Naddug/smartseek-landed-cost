"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { loginHref } from "@/lib/auth/routes";
import {
  resolvePostAuthDestination,
  sessionToPostAuthContext,
} from "@/lib/auth/session-policy";

export default function AuthDevamClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const next = searchParams.get("next");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace(loginHref(next ?? undefined));
      return;
    }

    const destination = resolvePostAuthDestination(
      sessionToPostAuthContext(session),
      next
    );
    router.replace(destination);
    router.refresh();
  }, [status, session, next, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <p className="text-sm text-ortaq-text-secondary">Oturumunuz doğrulanıyor…</p>
    </div>
  );
}
