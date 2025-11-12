"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Venue {
  id: string;
  name: string | null;
  logo: string | null;
  address: string | null;
  city: string | null;
}

interface VenuesListContentProps {
  venues: Venue[];
}

export function VenuesListContent({ venues }: VenuesListContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Venues Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Venues</h3>
            <p className="text-sm text-muted-foreground">
              {venues.length} venue{venues.length !== 1 ? "s" : ""} registrado
              {venues.length !== 1 ? "s" : ""}
            </p>
          </div>

          {venues.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                className="h-9 w-9 rounded-full bg-white/5 border-white/10 hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                className="h-9 w-9 rounded-full bg-white/5 border-white/10 hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {venues.length === 0 ? (
          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="py-12 text-center">
              <MapPin className="h-10 w-10 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1 text-white">
                No hay venues registrados
              </h3>
              <p className="text-sm text-white/40">
                Los venues aparecerán aquí cuando sean creados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Horizontal Carousel */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scroll-smooth hide-scrollbar snap-x snap-mandatory"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {venues.map((venue) => {
                const displayName = venue.name || "Sin nombre";
                const location = [venue.city, venue.address].filter(Boolean).join(", ");

                return (
                  <Card
                    key={venue.id}
                    className="group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 flex-shrink-0 w-[280px] snap-start cursor-pointer"
                  >
                    <CardContent className="relative pt-8 pb-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                          {venue.logo ? (
                            <img
                              src={venue.logo}
                              alt={displayName}
                              className="w-20 h-20 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-white/15 transition-all duration-300"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-white/15 transition-all duration-300">
                              <MapPin className="h-10 w-10 text-primary" />
                            </div>
                          )}
                        </div>

                        <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                          {displayName}
                        </h4>
                        {location && (
                          <p className="text-sm text-white/40 font-medium truncate max-w-full px-2">
                            {location}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CSS to hide scrollbar */}
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
