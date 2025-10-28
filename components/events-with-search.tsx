"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { EventCard } from "@/components/event-card";
import { EnhancedSearchBar } from "@/components/enhanced-search-bar";
import { EnhancedCityFilter } from "@/components/enhanced-city-filter";
import { Filter } from "lucide-react";
import type { EventFull } from "@/lib/supabase/types";
import { formatEventDate, formatPrice } from "@/lib/utils/format";

interface EventsWithSearchProps {
  // All events from server
  events: EventFull[];
  // Number of events to display in grid (excluding featured)
  limit?: number;
}

export function EventsWithSearch({ events, limit = 6 }: EventsWithSearchProps) {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State for selected city filter
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  /**
   * Extract unique cities from events using useMemo
   *
   * WHY useMemo:
   * - This computation involves array operations (.map, .filter, Set creation, Array.from, .sort)
   * - Without useMemo: runs on EVERY render (when searchQuery changes, when selectedCity changes, etc.)
   * - With useMemo: only runs when `events` array changes
   * - Prevents unnecessary recalculations when user types in search bar
   *
   * TECHNICAL REASONING:
   * - React re-renders components when state changes (searchQuery, selectedCity)
   * - Each re-render would create a new cities array with new object references
   * - This would cause CityFilter to re-render unnecessarily (React.memo would fail)
   * - useMemo caches the result and returns same reference until dependencies change
   *
   * DEPENDENCY: [events]
   * - Only recalculate when the events array from server changes
   * - Events array is stable (comes from server props, doesn't change during filtering)
   */
  const cities = useMemo(() => {
    const uniqueCities = new Set(
      events
        .map((event) => event.venue_city)
        .filter((city) => city && city !== "Ciudad") // Filter out default/empty values
    );
    return Array.from(uniqueCities).sort();
  }, [events]);

  /**
   * Filter events based on search query and city using useMemo
   *
   * WHY useMemo:
   * - Filtering can be expensive with large event arrays (O(n) complexity)
   * - String operations (.toLowerCase(), .includes()) are called multiple times per event
   * - Without useMemo: filters run on every render, even when dependencies haven't changed
   * - With useMemo: only filters when search/city/events actually change
   *
   * TECHNICAL REASONING:
   * - React batches state updates but still causes re-renders
   * - Any parent re-render would trigger this component to re-render
   * - Memoizing prevents redundant filtering computations
   * - Returns same array reference if dependencies unchanged (important for child components)
   *
   * DEPENDENCIES: [events, selectedCity, searchQuery]
   * - events: when server data changes
   * - selectedCity: when user selects different city
   * - searchQuery: when user types in search
   *
   * PERFORMANCE IMPACT:
   * - For 100 events with 5 filters each = 500 operations per render
   * - User typing = potentially 10+ renders per second
   * - Without memo: 5000+ operations/second while typing
   * - With memo: ~500 operations only when dependencies change
   */
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply city filter first
    if (selectedCity) {
      filtered = filtered.filter((event) => event.venue_city === selectedCity);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((event) => {
        const includes = (str: string | null | undefined) =>
          str?.toLowerCase().includes(lowerQuery) ?? false;

        return (
          includes(event.name) ||
          includes(event.description) ||
          includes(event.venue_name) ||
          includes(event.venue_city)
        );
      });
    }

    return filtered;
  }, [events, selectedCity, searchQuery]);

  // Handle search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle city filter changes
  const handleCityChange = (city: string | null) => {
    setSelectedCity(city);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity(null);
  };

  // Get the featured event (first one) and the rest for the grid
  const [featuredEvent, ...gridEvents] = filteredEvents;

  return (
    <>
      {/* Search and Filter Bar */}
      <div className="space-y-4 mb-8">
        {/* Search and filter row */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex-1">
            <EnhancedSearchBar searchQuery={searchQuery} onSearchChange={handleSearch} />
          </div>
          <div className="w-full sm:w-64 lg:w-72">
            <EnhancedCityFilter
              cities={cities}
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
            />
          </div>
        </div>

        {/* Active filters indicator */}
        {(searchQuery || selectedCity) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/60">
              {filteredEvents.length} de {events.length} eventos
            </span>
            <button
              onClick={resetFilters}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Show message if no events found after filtering */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <div className="inline-flex p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
            <Filter className="h-12 w-12 text-white/60" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            No se encontraron eventos
          </h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {selectedCity && `No hay eventos disponibles en ${selectedCity}`}
            {searchQuery && !selectedCity && `No hay eventos que coincidan con "${searchQuery}"`}
            {searchQuery && selectedCity && ` que coincidan con "${searchQuery}"`}
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-full text-white font-medium transition-all duration-300"
          >
            Mostrar todos los eventos
          </button>
        </div>
      ) : (
        <>
          {/* Featured Event - Hero Card wrapped in Link for navigation */}
          {featuredEvent && (
            <div className="mb-6 sm:mb-8">
              <Link href={`/eventos/${featuredEvent.id}`} className="block max-w-md">
                <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden group cursor-pointer bg-white/8 border border-white/10 hover:border-white/20 backdrop-blur-sm">
                {/* Event image with hover effect using Next.js Image for optimization */}
                <Image
                  src={featuredEvent.flyer || "/placeholder.svg"}
                  alt={featuredEvent.name}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Date badge in top right corner */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-black/40 backdrop-blur-sm border border-gray-400/50 rounded-xl px-4 py-4 text-center">
                    <div className="text-2xl font-bold text-white leading-none">
                      {new Date(featuredEvent.date).getDate()}
                    </div>
                    <div className="text-sm text-white/90 uppercase leading-none mt-1">
                      {new Date(featuredEvent.date).toLocaleDateString('es-ES', { month: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Event information overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 lg:p-12">
                  {/* Event title */}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-balance mb-2 sm:mb-3">
                    {featuredEvent.name}
                  </h2>

                  {/* Event details */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-3 lg:gap-4 text-white/90 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">
                    <span className="flex items-center gap-2">
                      <span>
                        {featuredEvent.venue_name}, {featuredEvent.venue_city}
                      </span>
                    </span>
                    {featuredEvent.tickets && featuredEvent.tickets.length > 0 && (
                      <span className="flex items-center gap-2">
                        <span>
                          Desde $
                          {formatPrice(
                            Math.min(...featuredEvent.tickets.map((t) => t.price))
                          )}
                        </span>
                      </span>
                    )}
                  </div>

                </div>
              </div>
            </Link>
            </div>
          )}

          {/* Grid of Popular Events */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-16 sm:pb-24">
            {gridEvents.slice(0, limit).map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={formatEventDate(event.date)}
                location={`${event.venue_name}, ${event.venue_city}`}
                image={event.flyer}
                category={event.description ? "Música" : "Evento"}
                // attendees={0}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
