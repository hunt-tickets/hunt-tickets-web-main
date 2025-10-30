"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { AddProducerDialog } from "@/components/add-producer-dialog";
import { AddArtistDialog } from "@/components/add-artist-dialog";

interface Producer {
  id: string;
  created_at: string;
  producer: {
    id: string;
    name: string | null;
    logo: string | null;
  };
}

interface AllProducer {
  id: string;
  name: string | null;
  logo: string | null;
}

interface Artist {
  id: string;
  created_at: string;
  artist: {
    id: string;
    name: string | null;
    description: string | null;
    category: string | null;
    logo: string | null;
  };
}

interface AllArtist {
  id: string;
  name: string | null;
  description: string | null;
  category: string | null;
  logo: string | null;
}

interface EventTeamContentProps {
  eventId: string;
  producers: Producer[];
  artists: Artist[];
  allProducers: AllProducer[];
  allArtists: AllArtist[];
}

export function EventTeamContent({
  eventId,
  producers,
  artists,
  allProducers,
  allArtists,
}: EventTeamContentProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Producers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Productores</h3>
            <p className="text-sm text-muted-foreground">
              {producers.length} productor{producers.length !== 1 ? 'es' : ''} asignado{producers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <AddProducerDialog
            eventId={eventId}
            availableProducers={allProducers.filter(
              ap => !producers.some(p => p.producer.id === ap.id)
            )}
          />
        </div>

        {producers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                No hay productores asignados
              </h3>
              <p className="text-sm text-muted-foreground">
                Asigna productores al evento para gestionar el equipo
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {producers.map((item) => {
              const producer = item.producer;
              const displayName = producer.name || 'Sin nombre';

              return (
                <Card key={item.id} className="group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative pt-8 pb-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        {producer.logo ? (
                          <img
                            src={producer.logo}
                            alt={displayName}
                            className="w-20 h-20 rounded-xl object-cover ring-4 ring-white/5 group-hover:ring-white/10 transition-all duration-300"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center ring-4 ring-white/5 group-hover:ring-white/10 transition-all duration-300">
                            <Users className="h-10 w-10 text-primary" />
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                        {displayName}
                      </h4>
                      <p className="text-sm text-white/40 font-medium">
                        Productor
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Artists Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Artistas</h3>
            <p className="text-sm text-muted-foreground">
              {artists.length} artista{artists.length !== 1 ? 's' : ''} asignado{artists.length !== 1 ? 's' : ''}
            </p>
          </div>
          <AddArtistDialog
            eventId={eventId}
            availableArtists={allArtists.filter(
              aa => !artists.some(a => a.artist.id === aa.id)
            )}
          />
        </div>

        {artists.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                No hay artistas asignados
              </h3>
              <p className="text-sm text-muted-foreground">
                Los artistas asignados a este evento aparecerán aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((item) => {
              const artist = item.artist;
              const displayName = artist.name || 'Sin nombre';

              return (
                <Card key={item.id} className="group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative pt-8 pb-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        {artist.logo ? (
                          <img
                            src={artist.logo}
                            alt={displayName}
                            className="w-20 h-20 rounded-xl object-cover ring-4 ring-white/5 group-hover:ring-white/10 transition-all duration-300"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center ring-4 ring-white/5 group-hover:ring-white/10 transition-all duration-300">
                            <Users className="h-10 w-10 text-primary" />
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                        {displayName}
                      </h4>
                      {artist.category && (
                        <p className="text-sm text-white/40 font-medium mb-2">
                          {artist.category}
                        </p>
                      )}
                      {artist.description && (
                        <p className="text-xs text-white/30 line-clamp-2">
                          {artist.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
