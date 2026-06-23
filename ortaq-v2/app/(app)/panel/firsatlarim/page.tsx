import Link from "next/link";
import { getServerSession } from "next-auth";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getPanelDossiersForUser } from "@/lib/panel/get-panel-overview";
import { FirsatlarimList } from "@/components/panel/FirsatlarimList";
import { Button } from "@/components/ui/button";

export default async function FirsatlarimPage() {
  const session = await getServerSession(authOptions);
  const dossiers = await getPanelDossiersForUser(session);

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-stone-950">
            Fırsatlarım
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Oluşturduğunuz fırsat dosyalarını yönetin ve durumlarını takip edin.
          </p>
        </div>
        <Link href="/panel/dosya-olustur">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Yeni Dosya Oluştur
          </Button>
        </Link>
      </header>
      <FirsatlarimList dossiers={dossiers} />
    </div>
  );
}
