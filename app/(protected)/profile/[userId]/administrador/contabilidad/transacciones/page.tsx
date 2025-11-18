import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCompleteEventTransactions } from "@/lib/supabase/actions/tickets";
import { EventTransactionsContent } from "@/components/event-transactions-content";

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

  // Fetch all complete transactions (from all events)
  // We'll need to get all transactions across all events
  const { data: allEvents } = await supabase
    .from("events")
    .select("id");

  const eventIds = allEvents?.map(e => e.id) || [];

  // Fetch transactions for all events
  const allTransactionsPromises = eventIds.map(eventId =>
    getCompleteEventTransactions(eventId)
  );

  const allTransactionsArrays = await Promise.all(allTransactionsPromises);
  const allTransactions = allTransactionsArrays.flat();

  // Transform transactions to the format expected by EventTransactionsContent
  const simpleTransactions = allTransactions.map((t) => ({
    id: t.id,
    quantity: t.quantity,
    total: t.total,
    status: t.status,
    created_at: t.created_at,
    source: t.type,
    tickets: {
      name: t.ticket_name,
      price: t.price,
    },
    user: {
      name: t.user_fullname?.split(' ')[0] || null,
      lastName: t.user_fullname?.split(' ').slice(1).join(' ') || null,
      email: t.user_email,
    },
  }));

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
      <EventTransactionsContent
        eventName="Todas las transacciones"
        transactions={simpleTransactions}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        completeTransactions={allTransactions as any}
        isAdmin={profile?.admin || false}
      />
    </div>
  );
}
