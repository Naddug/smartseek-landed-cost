/**
 * Integration logos - uses Simple Icons CDN for real brand logos
 * https://simpleicons.org - Free, open-source brand icons
 */
const INTEGRATIONS = [
  {
    name: "SAP Ariba",
    slug: "sap",
    url: "https://www.sap.com",
    logoUrl: "https://cdn.simpleicons.org/sap/0FAAFF",
    status: "available" as const,
  },
  {
    name: "Oracle",
    slug: "oracle",
    url: "https://www.oracle.com",
    logoUrl: "https://cdn.simpleicons.org/oracle/F80000",
    status: "available" as const,
  },
  {
    name: "Salesforce",
    slug: "salesforce",
    url: "https://www.salesforce.com",
    logoUrl: "https://cdn.simpleicons.org/salesforce/00A1E0",
    status: "available" as const,
  },
  {
    name: "Microsoft Dynamics",
    slug: "microsoft",
    url: "https://dynamics.microsoft.com",
    logoUrl: "https://cdn.simpleicons.org/microsoft/5E5E5E",
    status: "available" as const,
  },
  {
    name: "Coupa",
    slug: "coupa",
    url: "https://www.coupa.com",
    logoUrl: "https://cdn.simpleicons.org/coupa/FF6B35",
    status: "available" as const,
  },
  {
    name: "Jaggaer",
    slug: "jaggaer",
    url: "https://www.jaggaer.com",
    logoUrl: "https://cdn.simpleicons.org/sap/0E4C92", // Jaggaer (SAP-owned) - fallback to SAP style
    status: "available" as const,
  },
];

interface IntegrationLogosProps {
  variant?: "compact" | "full" | "cards";
  showConnect?: boolean;
}

export function IntegrationLogos({ variant = "compact", showConnect = false }: IntegrationLogosProps) {
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
            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors">
              <img
                src={int.logoUrl}
                alt={int.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <span className="font-medium text-sm text-center text-slate-700 group-hover:text-slate-900">{int.name}</span>
            {showConnect && (
              <span className="text-xs text-blue-600 font-medium">Connect →</span>
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
          <img src={int.logoUrl} alt={int.name} className="h-8 w-auto object-contain" loading="lazy" />
        </a>
      ))}
    </div>
  );
}

export { INTEGRATIONS };
