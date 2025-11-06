import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrphanQRCodes } from "@/lib/supabase/actions/tickets";
import { OrphanQRCodesContent } from "@/components/orphan-qr-codes-content";

interface SeguridadPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function SeguridadPage({ params }: SeguridadPageProps) {
  const { userId } = await params;
  const supabase = await createClient();

  // Auth check
  if (!userId) {
    redirect("/login");
  }

  // Get user profile to verify admin access
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, admin")
    .eq("id", userId)
    .single();

  if (!profile?.admin) {
    notFound();
  }

  // Fetch orphan QR codes
  const orphanQRs = await getOrphanQRCodes();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Seguridad</h1>
          <p className="text-xs text-muted-foreground">QR codes huérfanos sin transacción asociada</p>
        </div>
      </div>

      {/* Orphan QR Codes Content */}
      <OrphanQRCodesContent orphanQRs={orphanQRs || []} />
    </div>
  );
}
