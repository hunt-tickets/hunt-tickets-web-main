import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllTransactions } from "@/lib/supabase/actions/tickets";
import { AllTransactionsContent } from "@/components/all-transactions-content";

interface TransaccionesContabilidadPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function TransaccionesContabilidadPage({ params }: TransaccionesContabilidadPageProps) {
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

  // Fetch all transactions
  const transactions = await getAllTransactions();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Transacciones</h1>
          <p className="text-xs text-muted-foreground">Historial completo de transacciones</p>
        </div>
      </div>

      {/* Transactions Content */}
      <AllTransactionsContent transactions={transactions || []} />
    </div>
  );
}
