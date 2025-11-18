import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReferralAdminContent } from "@/components/referral-admin-content";

interface ReferidosPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ReferidosPage({ params }: ReferidosPageProps) {
  const { userId } = await params;
  const supabase = await createClient();

  // Auth check
  if (!userId) {
    redirect("/login");
  }

  // Get user profile to verify admin/producer access
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, admin, producers_admin(producer_id)")
    .eq("id", userId)
    .single();

  const producersAdmin = Array.isArray(profile?.producers_admin)
    ? profile.producers_admin
    : profile?.producers_admin
    ? [profile.producers_admin]
    : [];
  const isProducer = producersAdmin.length > 0;

  if (!profile?.admin && !isProducer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Programa de Referidos</h1>
          <p className="text-xs text-muted-foreground">
            Invita productores y gana comisiones por sus ventas
          </p>
        </div>
      </div>

      {/* Content */}
      <ReferralAdminContent userId={userId} />
    </div>
  );
}
