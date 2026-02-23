
export default function Terms() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Terms governing your use of SmartSeek.
          </p>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-slate-600">
            <p>
              By using SmartSeek, you agree to these terms. Please read them carefully.
            </p>
            <h2 className="font-semibold text-slate-900">Acceptable Use</h2>
            <p>
              You agree to use the platform for lawful business purposes only. You will not misuse the service, attempt to access other users' data, or violate applicable laws.
            </p>
            <h2 className="font-semibold text-slate-900">Subscription & Billing</h2>
            <p>
              Paid plans are billed according to the pricing on our website. You may cancel at any time. Refunds are handled per our billing policy.
            </p>
            <h2 className="font-semibold text-slate-900">Contact</h2>
            <p>
              For questions about these terms, contact us at contact@smartseek.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
