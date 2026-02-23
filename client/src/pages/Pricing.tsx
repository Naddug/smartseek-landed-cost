import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Link } from "wouter";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get started with essential tools",
    features: [
      "5 supplier searches per day",
      "Basic landed cost calculator",
      "1 RFQ per month",
      "Access to supplier directory",
      "Email support"
    ],
    cta: "Get Started Free",
    ctaHref: "/signup",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-slate-600 to-slate-700"
  },
  {
    name: "Professional",
    price: "$49",
    period: "/mo",
    description: "For serious buyers and sourcing teams",
    features: [
      "Unlimited supplier searches",
      "Advanced landed cost calculator",
      "20 RFQs per month",
      "Verified supplier contacts",
      "Priority support",
      "Export reports & data"
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
    popular: true,
    icon: <Crown className="w-6 h-6" />,
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment options"
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
    icon: <Building2 className="w-6 h-6" />,
    gradient: "from-slate-700 to-slate-800"
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees. Cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative bg-white rounded-2xl border-2 shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    tier.popular
                      ? "border-blue-500 shadow-blue-500/10 -translate-y-1"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 py-1.5 bg-blue-600 text-white text-center text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className={`p-8 ${tier.popular ? "pt-12" : ""}`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-white mb-6`}>
                      {tier.icon}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{tier.name}</h2>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                      <span className="text-slate-500">{tier.period}</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-6">{tier.description}</p>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={tier.ctaHref}>
                      <button
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                          tier.popular
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                        }`}
                      >
                        {tier.cta}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    </div>
  );
}
