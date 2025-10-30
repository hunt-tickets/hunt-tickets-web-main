import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { getEventTickets, getTicketsSalesAnalytics, getTicketTypes } from "@/lib/supabase/actions/tickets";
import { EventTicketsContent } from "@/components/event-tickets-content";

interface EntradasPageProps {
  params: Promise<{
    eventId: string;
    userId: string;
  }>;
}

export default async function EntradasPage({ params }: EntradasPageProps) {
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

  // Fetch event details, tickets, and analytics
  const [eventData, tickets, ticketsAnalytics, ticketTypes] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, status, variable_fee")
      .eq("id", eventId)
      .single(),
    getEventTickets(eventId),
    getTicketsSalesAnalytics(eventId),
    getTicketTypes(),
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
          <p className="text-xs text-muted-foreground">Gestión de Entradas</p>
        </div>
        <Badge variant={event.status ? "default" : "secondary"}>
          {event.status ? "Activo" : "Finalizado"}
        </Badge>
      </div>

      {/* Tickets Content */}
      <EventTicketsContent
        eventId={eventId}
        tickets={tickets || []}
        ticketsAnalytics={ticketsAnalytics || undefined}
        ticketTypes={ticketTypes || []}
        variableFee={event.variable_fee || 0}
      />
    </div>
  );
}
