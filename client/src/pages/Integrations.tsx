import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { IntegrationLogos, INTEGRATIONS } from "@/components/integrations/IntegrationLogos";
import { Button } from "@/components/ui/button";
import { Plug, Check, ArrowRight, Shield, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";

const SLUG_TO_PROVIDER: Record<string, string> = {
  google: "google",
  sap: "sap_ariba",
  oracle: "oracle",
  salesforce: "salesforce",
  microsoft: "microsoft_dynamics",
  coupa: "coupa",
  jaggaer: "jaggaer",
};

export default function Integrations() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user } = useStore();
  const [connections, setConnections] = useState<{ provider: string; connected: boolean; configured: boolean }[]>([]);
  const [loading, setLoading] = useState(!!user);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/integrations")
        .then((r) => r.ok ? r.json() : [])
        .then(setConnections)
        .catch(() => setConnections([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleConnect = async (slug: string) => {
    setConnecting(slug);
    try {
      const res = await fetch(`/api/integrations/${slug}/connect`, { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start connection");
      }
    } catch {
      alert("Failed to connect");
    } finally {
      setConnecting(null);
    }
  };

  const isConnected = (slug: string) =>
    connections.some((c) => SLUG_TO_PROVIDER[slug] === c.provider && c.connected);

  const isConfigured = (slug: string) =>
    connections.some((c) => SLUG_TO_PROVIDER[slug] === c.provider && c.configured);

  const showConnected = location.includes("connected=1");

  return (
    <div className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Plug className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 font-medium">{t("nav.integrations")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {t("integrationsPage.title")}
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              {t("integrationsPage.subtitle")}
            </p>
          </div>
        </section>

        {showConnected && (
          <div className="container mx-auto px-4 -mt-4 relative z-10">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-800 text-sm font-medium">
              ✓ {t("integrationsPage.connectedSuccess")}
            </div>
          </div>
        )}

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2 text-center">{t("integrationsPage.supported")}</h2>
            <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              {t("integrationsPage.supportedDesc")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {INTEGRATIONS.map((int) => (
                <div
                  key={int.slug}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center p-2">
                    <img src={int.logoUrl} alt={int.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-medium text-sm text-center text-slate-700">{int.name}</span>
                  {user ? (
                    isConnected(int.slug) ? (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t("integrationsPage.connected")}
                      </span>
                    ) : (
                      <div className="w-full space-y-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          disabled={connecting === int.slug || !isConfigured(int.slug)}
                          onClick={() => handleConnect(int.slug)}
                        >
                          {connecting === int.slug ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            t("integrationsPage.connect")
                          )}
                        </Button>
                        {!isConfigured(int.slug) && (
                          <p className="text-[10px] text-slate-500 text-center">{t("integrationsPage.oauthRequired")}</p>
                        )}
                      </div>
                    )
                  ) : (
                    <Link href="/signup">
                      <Button size="sm" variant="outline" className="w-full">
                        {t("integrationsPage.signInToConnect")}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
            {user && loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8">{t("integrationsPage.howItWorks")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t("integrationsPage.step1Title")}</h3>
                  <p className="text-slate-600 text-sm">{t("integrationsPage.step1Desc")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t("integrationsPage.step2Title")}</h3>
                  <p className="text-slate-600 text-sm">{t("integrationsPage.step2Desc")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t("integrationsPage.step3Title")}</h3>
                  <p className="text-slate-600 text-sm">{t("integrationsPage.step3Desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{t("integrationsPage.securityTitle")}</h3>
                  <p className="text-slate-600 text-sm">{t("integrationsPage.securityDesc")}</p>
                </div>
              </div>
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  {t("integrationsPage.getStarted")} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6 text-center">{t("integrationsPage.allPlatforms")}</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {INTEGRATIONS.map((int) => (
                <div key={int.slug} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  <img src={int.logoUrl} alt={int.name} className="h-6 w-auto" />
                  <span className="font-medium text-slate-700">{int.name}</span>
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
}
