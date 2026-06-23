import { Eye, FileStack, ShieldCheck, Users } from "lucide-react";
import { AppContainer } from "@/components/shared/AppContainer";

const strips = [
  { icon: ShieldCheck, label: "Moderatör incelemesi" },
  { icon: Eye, label: "Gizlilik seçenekleri" },
  { icon: FileStack, label: "Yapılandırılmış fırsat dosyaları" },
  { icon: Users, label: "Doğru ortak türüne göre eşleştirme" },
];

export function TrustStrips() {
  return (
    <section className="border-b border-ortaq-line bg-ortaq-surface-alt py-5">
      <AppContainer>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {strips.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-lg border border-ortaq-line bg-ortaq-surface px-4 py-3"
            >
              <Icon className="h-4 w-4 shrink-0 text-ortaq-action" />
              <span className="text-sm font-medium text-ortaq-navy">{label}</span>
            </li>
          ))}
        </ul>
      </AppContainer>
    </section>
  );
}
