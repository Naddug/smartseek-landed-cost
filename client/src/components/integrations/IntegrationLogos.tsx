/**
 * Integration logos - uses Clearbit Logo API for real brand logos
 * https://clearbit.com/logo - Returns actual company logos by domain
 */
const INTEGRATIONS = [
  {
    name: "SAP Ariba",
    slug: "sap",
    url: "https://www.sap.com",
    logoUrl: "https://logo.clearbit.com/sap.com",
    domain: "sap.com",
    status: "available" as const,
  },
  {
    name: "Oracle",
    slug: "oracle",
    url: "https://www.oracle.com",
    logoUrl: "https://logo.clearbit.com/oracle.com",
    domain: "oracle.com",
    status: "available" as const,
  },
  {
    name: "Salesforce",
    slug: "salesforce",
    url: "https://www.salesforce.com",
    logoUrl: "https://logo.clearbit.com/salesforce.com",
    domain: "salesforce.com",
    status: "available" as const,
  },
  {
    name: "Microsoft Dynamics",
    slug: "microsoft",
    url: "https://dynamics.microsoft.com",
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    domain: "microsoft.com",
    status: "available" as const,
  },
  {
    name: "Coupa",
    slug: "coupa",
    url: "https://www.coupa.com",
    logoUrl: "https://logo.clearbit.com/coupa.com",
    domain: "coupa.com",
    status: "available" as const,
  },
  {
    name: "Jaggaer",
    slug: "jaggaer",
    url: "https://www.jaggaer.com",
    logoUrl: "https://logo.clearbit.com/jaggaer.com",
    domain: "jaggaer.com",
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
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-2 group-hover:border-slate-300 group-hover:shadow-md transition-all overflow-hidden relative">
              <img
                src={int.logoUrl}
                alt={int.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span className="hidden w-full h-full items-center justify-center text-xs font-bold text-slate-500 bg-slate-100" style={{ display: "none" }}>
                {int.name.slice(0, 2)}
              </span>
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
            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors overflow-hidden relative">
              <img
                src={int.logoUrl}
                alt={int.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  const fb = el.nextElementSibling as HTMLElement;
                  if (fb) fb.style.display = "flex";
                }}
              />
              <span className="hidden w-full h-full items-center justify-center text-sm font-bold text-slate-500 bg-slate-100" style={{ display: "none" }}>
                {int.name.slice(0, 2)}
              </span>
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
          <div className="h-8 min-w-[2rem] flex items-center justify-center">
            <img
              src={int.logoUrl}
              alt={int.name}
              className="h-8 w-auto object-contain max-w-[80px]"
              loading="lazy"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                const fb = el.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = "inline-flex";
              }}
            />
            <span className="hidden h-8 items-center justify-center text-xs font-bold text-slate-500" style={{ display: "none" }}>
              {int.name.slice(0, 2)}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

export { INTEGRATIONS };
