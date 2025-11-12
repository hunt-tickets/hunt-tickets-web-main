import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Ticket } from "lucide-react";
import { TicketsTabsContent } from "@/components/tickets-tabs-content";

interface Event {
  event_id: string;
  event_name: string;
  flyer: string | null;
  total_qr_codes: number;
  event_time: string;
  event_date: string;
}

interface EventsResponse {
  has_events: boolean;
  events: Event[];
}

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  // Secure authentication - validates with server
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Verify user can only access their own tickets
  if (user.id !== userId) {
    redirect("/profile");
  }

  // Get upcoming events with tickets
  const { data: upcomingData, error: upcomingError } = await supabase.rpc(
    "get_user_events_with_status",
    {
      user_uuid: user.id,
    }
  );

  // Handle error case
  if (upcomingError) {
    console.error("Error fetching upcoming events:", upcomingError);
  }

  // Safely parse the response - the function returns JSON, so we need to handle it properly
  const upcomingEvents: EventsResponse = upcomingData
    ? {
        has_events: upcomingData.has_events || false,
        events: Array.isArray(upcomingData.events) ? upcomingData.events : [],
      }
    : {
        has_events: false,
        events: [],
      };

  // TODO: Create a similar function for past events
  // For now, we'll use empty data
  const pastEvents: EventsResponse = {
    has_events: false,
    events: [],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Ticket className="h-8 w-8" />
          Mis Entradas
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus entradas para eventos actuales y pasados
        </p>
      </div>

      {/* Tabs Content */}
      <TicketsTabsContent
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />
    </div>
  );
}
