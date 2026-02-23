import { Building2, Target, Users } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">About SmartSeek</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            We're building the future of AI-powered sourcing for modern buyers.
          </p>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-8 text-slate-600">
            <p>
              SmartSeek helps procurement teams and buyers discover verified suppliers, calculate landed costs, and submit RFQs—all powered by AI and market intelligence.
            </p>
            <p>
              Our mission is to make global sourcing simpler, faster, and more transparent. We combine verified supplier data with tools that reduce risk and improve margins.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/suppliers" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
                <Users className="w-4 h-4" /> Supplier Directory
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
                <Target className="w-4 h-4" /> Pricing
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
                <Building2 className="w-4 h-4" /> Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
