
export default function Privacy() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            How we collect, use, and protect your data.
          </p>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-slate-600">
            <p>
              SmartSeek ("we") respects your privacy. This policy describes the data we collect when you use our platform and how we use it.
            </p>
            <h2 className="font-semibold text-slate-900">Data We Collect</h2>
            <p>
              We collect account information (email, name), usage data (searches, reports), and RFQ details you submit. Payment data is processed by Stripe and not stored by us.
            </p>
            <h2 className="font-semibold text-slate-900">How We Use It</h2>
            <p>
              We use your data to provide the service, improve our platform, and communicate with you. We do not sell your data to third parties.
            </p>
            <h2 className="font-semibold text-slate-900">Contact</h2>
            <p>
              For privacy inquiries, contact us at contact@smartseek.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
