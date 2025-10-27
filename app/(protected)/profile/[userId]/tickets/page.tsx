import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, Calendar, Clock, QrCode } from "lucide-react";
import Image from "next/image";

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

      {/* Tabs for Upcoming and Past Events */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">
            Próximas
            {upcomingEvents.has_events && (
              <Badge variant="secondary" className="ml-2">
                {upcomingEvents.events.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">
            Pasadas
            {pastEvents.has_events && (
              <Badge variant="secondary" className="ml-2">
                {pastEvents.events.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingEvents.has_events ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.events.map((event) => (
                <Card
                  key={event.event_id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Event Image */}
                  <div className="relative h-48 w-full bg-muted">
                    {event.flyer ? (
                      <Image
                        src={event.flyer}
                        alt={event.event_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Ticket className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {event.event_name}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.event_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.event_time}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {event.total_qr_codes}{" "}
                          {event.total_qr_codes === 1 ? "entrada" : "entradas"}
                        </span>
                      </div>
                      <Badge variant="default">Activo</Badge>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/eventos/${event.event_id}`}>
                        Ver mis códigos QR
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No tienes entradas próximas
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Explora nuestros eventos y consigue tus entradas
                </p>
                <Button asChild>
                  <Link href="/">Ver eventos disponibles</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Past Events Tab */}
        <TabsContent value="past" className="space-y-4 mt-6">
          {pastEvents.has_events ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.events.map((event) => (
                <Card
                  key={event.event_id}
                  className="overflow-hidden opacity-75"
                >
                  {/* Event Image */}
                  <div className="relative h-48 w-full bg-muted">
                    {event.flyer ? (
                      <Image
                        src={event.flyer}
                        alt={event.event_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Ticket className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {event.event_name}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.event_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.event_time}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {event.total_qr_codes}{" "}
                          {event.total_qr_codes === 1 ? "entrada" : "entradas"}
                        </span>
                      </div>
                      <Badge variant="secondary">Finalizado</Badge>
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/eventos/${event.event_id}`}>
                        Ver detalles
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No tienes entradas pasadas
                </h3>
                <p className="text-muted-foreground text-center">
                  Tus eventos finalizados aparecerán aquí
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
