import { useTranslation } from "react-i18next";

/**
 * Integration logos - self-hosted SVG brand logos (always load, no external CDN)
 */
const INTEGRATIONS = [
  { name: "Google Workspace", slug: "google", url: "https://workspace.google.com", logoUrl: "/logos/google.svg" },
  { name: "SAP Ariba", slug: "sap", url: "https://www.sap.com", logoUrl: "/logos/sap.svg" },
  { name: "Oracle", slug: "oracle", url: "https://www.oracle.com", logoUrl: "/logos/oracle.svg" },
  { name: "Salesforce", slug: "salesforce", url: "https://www.salesforce.com", logoUrl: "/logos/salesforce.svg" },
  { name: "Microsoft Dynamics", slug: "microsoft", url: "https://dynamics.microsoft.com", logoUrl: "/logos/microsoft.svg" },
  { name: "Coupa", slug: "coupa", url: "https://www.coupa.com", logoUrl: "/logos/coupa.svg" },
  { name: "Jaggaer", slug: "jaggaer", url: "https://www.jaggaer.com", logoUrl: "/logos/jaggaer.svg" },
];

interface IntegrationLogosProps {
  variant?: "compact" | "full" | "cards";
  showConnect?: boolean;
}

export function IntegrationLogos({ variant = "compact", showConnect = false }: IntegrationLogosProps) {
  const { t } = useTranslation();

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8">
        {INTEGRATIONS.map((int) => (
          <a
            key={int.slug}
            href={int.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-2 group-hover:border-slate-300 group-hover:shadow-md transition-all overflow-hidden">
              <img
                src={int.logoUrl}
                alt={int.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <span className="font-medium text-sm md:text-base">{int.name}</span>
          </a>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {INTEGRATIONS.map((int) => (
          <a
            key={int.slug}
            href={showConnect ? "/integrations" : int.url}
            target={showConnect ? undefined : "_blank"}
            rel={showConnect ? undefined : "noopener noreferrer"}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors overflow-hidden">
              <img
                src={int.logoUrl}
                alt={int.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (int.fallbackUrl && img.src !== int.fallbackUrl) {
                    img.src = int.fallbackUrl;
                  }
                }}
              />
            </div>
            <span className="font-medium text-sm text-center text-slate-700 group-hover:text-slate-900">{int.name}</span>
            {showConnect && (
              <span className="text-xs text-blue-600 font-medium">{t("integrations.connect")} →</span>
            )}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-8">
      {INTEGRATIONS.map((int) => (
        <a
          key={int.slug}
          href={int.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="h-8 min-w-[2rem] flex items-center justify-center">
            <img
              src={int.logoUrl}
              alt={int.name}
              className="h-8 w-auto object-contain max-w-[80px]"
              loading="lazy"
            />
          </div>
        </a>
      ))}
    </div>
  );
}

export { INTEGRATIONS };
