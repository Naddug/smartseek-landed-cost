import { Link } from "wouter";
import { FileSearch, CheckCircle2, BarChart3, Shield } from "lucide-react";

/** Transparency builds trust - like IndexBox's "Read the methodology" (authority signal) */
export function MethodologySection() {
  const steps = [
    {
      icon: FileSearch,
      title: "Data collection",
      desc: "We aggregate supplier data from trade registries, certifications, and verified business sources.",
    },
    {
      icon: CheckCircle2,
      title: "Verification",
      desc: "Each supplier undergoes business registration checks, trade history validation, and compliance review.",
    },
    {
      icon: BarChart3,
      title: "Quality scoring",
      desc: "Our algorithms score suppliers on response time, certification level, and buyer feedback.",
    },
    {
      icon: Shield,
      title: "Ongoing monitoring",
      desc: "We continuously monitor risk signals and update supplier status based on real-time data.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/80 border-y border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
                How we verify suppliers
              </h2>
              <p className="text-slate-600 mt-2">
                Transparency in our methodology builds trust. Here's how we ensure data integrity.
              </p>
            </div>
            <Link
              href="/faq#verification"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline shrink-0"
            >
              <FileSearch className="w-4 h-4" />
              Full methodology
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
