import { getAllActiveEvents } from "@/lib/supabase/queries/server/events";
import { EventsWithSearch } from "@/components/events-with-search";

/**
 * Eventos Page - Shows all active events (status=true)
 * Server Component that fetches all active events from the database
 */
export default async function EventosPage() {
  // Fetch all active events (status=true and end_date >= now)
  const events = await getAllActiveEvents();

  // Show message if no events found
  if (!events || events.length === 0) {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold tracking-tight mb-4">
            Todos los Eventos
          </h1>
          <p className="text-muted-foreground">
            No hay eventos disponibles en este momento
          </p>
        </div>
      </div>
    );
  }

  // Pass all events to client component that handles search/filtering
  return (
    <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Todos los Eventos
        </h1>
        <p className="text-muted-foreground">
          Descubre todos los eventos activos disponibles
        </p>
      </div>
      <EventsWithSearch events={events} limit={events.length} />
    </div>
  );
}
