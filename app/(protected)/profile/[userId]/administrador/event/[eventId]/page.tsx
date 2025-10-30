import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEventFinancialReport, getEventProducers, getAllProducers, getEventArtists, getAllArtists } from "@/lib/actions/events";
import { getEventTickets, getTicketsSalesAnalytics, getTicketTypes, getAllEventTransactions, getCompleteEventTransactions } from "@/lib/supabase/actions/tickets";
import { EventTabs } from "@/components/event-tabs";

interface EventPageProps {
  params: Promise<{
    eventId: string;
    userId: string;
  }>;
}

export default async function EventFinancialPage({ params }: EventPageProps) {
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

  // Fetch event details, financial report, tickets, producers, all available producers, artists, all available artists, ticket types, and transactions
  const [eventData, financialReport, tickets, producers, allProducers, artists, allArtists, ticketsAnalytics, ticketTypes, transactions, completeTransactions] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, status, variable_fee")
      .eq("id", eventId)
      .single(),
    getEventFinancialReport(eventId),
    getEventTickets(eventId),
    getEventProducers(eventId),
    getAllProducers(),
    getEventArtists(eventId),
    getAllArtists(),
    getTicketsSalesAnalytics(eventId),
    getTicketTypes(),
    getAllEventTransactions(eventId),
    getCompleteEventTransactions(eventId),
  ]);

  if (eventData.error || !eventData.data) {
    notFound();
  }

  const event = eventData.data;

  // Empty state
  if (!financialReport) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">{event.name}</h1>
              <p className="text-xs text-muted-foreground">
                Panel de Administración
              </p>
            </div>
            <Badge variant={event.status ? "default" : "secondary"}>
              {event.status ? "Activo" : "Finalizado"}
            </Badge>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                Sin datos financieros
              </h3>
              <p className="text-sm text-muted-foreground">
                Los datos aparecerán una vez se realicen las primeras ventas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{event.name}</h1>
            <p className="text-xs text-muted-foreground">
              {new Date(financialReport.timestamp).toLocaleString("es-CO", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>
          <Badge variant={event.status ? "default" : "secondary"}>
            {event.status ? "Activo" : "Finalizado"}
          </Badge>
        </div>

        {/* Event Tabs */}
        <EventTabs
          eventId={eventId}
          eventName={event.name}
          financialReport={financialReport}
          tickets={tickets || []}
          producers={producers || []}
          allProducers={allProducers || []}
          artists={artists || []}
          allArtists={allArtists || []}
          variableFee={event.variable_fee || 0}
          ticketsAnalytics={ticketsAnalytics || undefined}
          ticketTypes={ticketTypes || []}
          transactions={transactions || []}
          completeTransactions={completeTransactions?.transactions || []}
          isAdmin={completeTransactions?.isAdmin || false}
        />
      </div>
    </div>
  );
}
