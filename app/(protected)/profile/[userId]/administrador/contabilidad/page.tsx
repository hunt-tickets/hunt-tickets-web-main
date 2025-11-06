import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccountingSummary } from "@/lib/supabase/actions/accounting";
import { AccountingDashboard } from "@/components/accounting-dashboard";

interface ContabilidadPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ContabilidadPage({ params }: ContabilidadPageProps) {
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

  // Get accounting summary
  const summary = await getAccountingSummary();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Dashboard Contable</h1>
          <p className="text-xs text-muted-foreground">Resumen financiero de Hunt Tickets</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <AccountingDashboard summary={summary} />
    </div>
  );
}
