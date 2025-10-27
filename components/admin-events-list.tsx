"use client";

import type React from "react";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Event {
  id: string;
  name: string;
  flyer: string | null;
  date: string;
  status: string;
}

interface AdminEventsListProps {
  events: Event[];
  userId: string;
}

export function AdminEventsList({ events, userId }: AdminEventsListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleEventClick = useCallback(
    (eventId: string) => {
      router.push(`/profile/${userId}/administrador/event/${eventId}`);
    },
    [router, userId]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Efficient client-side filtering using useMemo
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();
    return events.filter((event) => event.name?.toLowerCase().includes(query));
  }, [events, searchQuery]);

  return (
    <>
      {/* Search Input */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Buscar eventos por nombre..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
          aria-label="Buscar eventos"
        />
      </div>

      {/* Events List */}
      <div className="space-y-4" role="list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event.id)}
              className={`flex gap-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer w-full text-left ${
                event.status === "ACTIVO"
                  ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 hover:shadow-md"
                  : "hover:bg-muted/50 hover:border-border"
              }`}
              type="button"
              role="listitem"
              aria-label={`Ver detalles de ${event.name}`}
            >
              <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {event.flyer ? (
                  <Image
                    src={event.flyer || "/placeholder.svg"}
                    alt={`Flyer de ${event.name}`}
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="96px"
                    loading="lazy"
                  />
                ) : (
                  <Calendar
                    className="h-10 w-10 text-muted-foreground opacity-50"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">
                    {event.name}
                  </h3>
                  <Badge
                    className={
                      event.status === "ACTIVO"
                        ? "bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20"
                        : event.status === "FINALIZADO"
                        ? ""
                        : ""
                    }
                    variant={
                      event.status === "ACTIVO"
                        ? "outline"
                        : event.status === "FINALIZADO"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={event.date}>{event.date}</time>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground" role="status">
            <Search
              className="h-12 w-12 mx-auto mb-3 opacity-50"
              aria-hidden="true"
            />
            <p className="text-sm">
              No se encontraron eventos que coincidan con &quot;{searchQuery}
              &quot;
            </p>
          </div>
        )}
      </div>
    </>
  );
}
