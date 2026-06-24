import { Suspense } from "react";
import AuthDevamClient from "./AuthDevamClient";

export default function AuthDevamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <p className="text-sm text-ortaq-text-secondary">Oturumunuz doğrulanıyor…</p>
        </div>
      }
    >
      <AuthDevamClient />
    </Suspense>
  );
}
