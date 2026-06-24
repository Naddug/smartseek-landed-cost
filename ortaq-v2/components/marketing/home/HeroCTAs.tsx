"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ORTAQ_COPY } from "@/lib/copy/ortaq-lexicon";
import { createDossierEntryHref } from "@/lib/auth/routes";

export function HeroCTAs() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const createDossierHref = createDossierEntryHref(isAuthenticated);

  if (isAuthenticated) {
    return (
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/panel">
          <Button size="lg" className="h-11 bg-blue-600 px-6 hover:bg-blue-700">
            {ORTAQ_COPY.ctas.goToPanel}
          </Button>
        </Link>
        <Link href="/panel/dosya-olustur">
          <Button
            variant="outline"
            size="lg"
            className="h-11 border-ortaq-line-strong bg-white px-6"
          >
            {ORTAQ_COPY.ctas.createDossier}
          </Button>
        </Link>
        <Link href="/firsatlar">
          <Button
            variant="ghost"
            size="lg"
            className="h-11 px-6 text-ortaq-text-secondary"
          >
            {ORTAQ_COPY.ctas.browseDossiers}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href={createDossierHref}>
        <Button size="lg" className="h-11 bg-blue-600 px-6 hover:bg-blue-700">
          {ORTAQ_COPY.ctas.createDossier}
        </Button>
      </Link>
      <Link href="/firsatlar">
        <Button
          variant="outline"
          size="lg"
          className="h-11 border-ortaq-line-strong bg-white px-6"
        >
          {ORTAQ_COPY.ctas.browseDossiers}
        </Button>
      </Link>
    </div>
  );
}
