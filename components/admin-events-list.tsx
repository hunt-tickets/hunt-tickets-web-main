"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { EnhancedSearchBar } from "@/components/enhanced-search-bar";
import { EventCard } from "@/components/event-card";
import { CreateEventDialog } from "@/components/create-event-dialog";
import type { EventFull } from "@/lib/supabase/types";

interface VenueOption {
  id: string;
  name: string;
}

interface AdminEventsListProps {
  events: EventFull[];
  userId: string;
  eventVenues?: VenueOption[];
}

export function AdminEventsList({ events, userId, eventVenues = [] }: AdminEventsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Efficient client-side filtering using useMemo
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();
    return events.filter((event) => event.name?.toLowerCase().includes(query));
  }, [events, searchQuery]);

  return (
    <>
      {/* Search Bar and Create Button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <EnhancedSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-auto flex items-center">
          <CreateEventDialog eventVenues={eventVenues} />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.name}
              date={event.date}
              location={`${event.venue_name}, ${event.venue_city}`}
              image={event.flyer}
              price={
                event.tickets && event.tickets.length > 0
                  ? Math.min(...event.tickets.map((t) => t.price))
                  : undefined
              }
              href={`/profile/${userId}/administrador/event/${event.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20">
          <div className="inline-flex p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
            <Filter className="h-12 w-12 text-white/60" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            No se encontraron eventos
          </h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {searchQuery
              ? `No hay eventos que coincidan con "${searchQuery}"`
              : "No hay eventos disponibles"}
          </p>
        </div>
      )}
    </>
  );
}
