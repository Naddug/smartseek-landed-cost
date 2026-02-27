import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

function toTitleCase(str: string | null | undefined): string {
  if (!str || typeof str !== "string") return str || "";
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function ContactQuoteModal({
  slug,
  supplierName,
  onClose,
}: {
  slug: string;
  supplierName: string;
  onClose: () => void;
}) {
  const { data: supplier, isLoading } = useQuery({
    queryKey: ["supplier", slug],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Supplier not found");
      return res.json();
    },
  });
  const [form, setForm] = useState({ buyerName: "", buyerEmail: "", buyerCompany: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async () => {
    if (!supplier?.id || !form.buyerName || !form.buyerEmail || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ supplierId: supplier.id, ...form }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog open={!!slug} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Request Quote from {toTitleCase(supplierName)}</DialogTitle>
          <DialogDescription>Your inquiry will be sent directly to the supplier.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : status === "sent" ? (
          <div className="py-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
            Your inquiry has been sent. The supplier typically responds within 1–3 business days.
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <Input placeholder="Your Name *" value={form.buyerName} onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))} className="bg-white" />
            <Input type="email" placeholder="Your Email *" value={form.buyerEmail} onChange={(e) => setForm((f) => ({ ...f, buyerEmail: e.target.value }))} className="bg-white" />
            <Input placeholder="Company Name" value={form.buyerCompany} onChange={(e) => setForm((f) => ({ ...f, buyerCompany: e.target.value }))} className="bg-white" />
            <Textarea placeholder="Your message / product requirements *" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} className="bg-white" />
            {status === "error" && <p className="text-sm text-red-600">Failed to send. Please try again.</p>}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubmit} disabled={status === "sending" || !form.buyerName || !form.buyerEmail || !form.message} className="flex-1">
                {status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {status === "sending" ? "Sending..." : "Send Inquiry"}
              </Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
