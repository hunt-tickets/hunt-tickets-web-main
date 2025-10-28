import { getPopularEvents } from "@/lib/supabase/queries/server/events";
import { EventsWithSearch } from "@/components/events-with-search";

interface PopularEventsProps {
  // City ID to fetch popular events for
  cityId?: string;
  // Number of events to display in the grid
  limit?: number;
}

/**
 * PopularEvents Server Component
 * Fetches events from the database and passes them to the client component for filtering
 */
export async function PopularEvents({ cityId, limit = 6 }: PopularEventsProps) {
  // Fetch popular events directly in the Server Component
  // Fetch extra events to ensure we have enough after filtering
  const events = await getPopularEvents(cityId, limit + 10);

  // Show message if no events found
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">
          No hay eventos populares disponibles en este momento
        </p>
      </div>
    );
  }

  // Pass events to client component that handles search/filtering
  return <EventsWithSearch events={events} limit={limit} />;
}
