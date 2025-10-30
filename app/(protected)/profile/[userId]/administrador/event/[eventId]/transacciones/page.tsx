import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { getAllEventTransactions, getCompleteEventTransactions } from "@/lib/supabase/actions/tickets";
import { EventTransactionsContent } from "@/components/event-transactions-content";

interface TransaccionesPageProps {
  params: Promise<{
    eventId: string;
    userId: string;
  }>;
}

export default async function TransaccionesPage({ params }: TransaccionesPageProps) {
  const { userId, eventId } = await params;
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

  // Fetch event details and transactions
  const [eventData, transactions, completeTransactions] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, status")
      .eq("id", eventId)
      .single(),
    getAllEventTransactions(eventId),
    getCompleteEventTransactions(eventId),
  ]);

  if (eventData.error || !eventData.data) {
    notFound();
  }

  const event = eventData.data;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{event.name}</h1>
          <p className="text-xs text-muted-foreground">Gestión de Transacciones</p>
        </div>
        <Badge variant={event.status ? "default" : "secondary"}>
          {event.status ? "Activo" : "Finalizado"}
        </Badge>
      </div>

      {/* Transactions Content */}
      <EventTransactionsContent
        eventName={event.name}
        transactions={transactions || []}
        completeTransactions={completeTransactions || []}
        isAdmin={profile?.admin || false}
      />
    </div>
  );
}
