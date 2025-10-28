import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { getVenues } from "@/lib/supabase/queries/server/venues";
import { AdminEventsList } from "@/components/admin-events-list";
import { CreateEventDialog } from "@/components/create-event-dialog";
import type { EventFull } from "@/lib/supabase/types";

interface AdministradorPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const AdministradorPage = async ({ params }: AdministradorPageProps) => {
  const { userId } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    redirect("/login");
  }

  // Get profile + producer data
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
      *,
      producers_admin (
        producer_id,
        producers (
          id,
          name,
          logo,
          description
        )
      )
    `
    )
    .eq("id", user.id)
    .single();

  const isProducer = (profile?.producers_admin?.length ?? 0) > 0;
  const producerData = profile?.producers_admin?.[0]?.producers;

  // If not admin or producer, redirect
  if (!profile?.admin && !isProducer) {
    notFound();
  }

  // Fetch events with full details (venue, tickets) for grid display
  // Query events based on user role: admin sees all, producer sees only their events
  let eventsQuery = supabase
    .from("events")
    .select(
      `
      id,
      name,
      description,
      date,
      end_date,
      status,
      flyer,
      venue_id,
      age,
      variable_fee,
      fixed_fee,
      priority,
      venues (
        id,
        name,
        address,
        latitude,
        longitude,
        city,
        cities (
          id,
          name
        )
      ),
      events_producers (
        producer_id
      ),
      tickets (
        id,
        name,
        price,
        description,
        status
      )
    `
    )
    .order("end_date", { ascending: false });

  // If user is producer (not admin), filter by their producer_id
  if (isProducer && !profile?.admin && producerData?.id) {
    eventsQuery = eventsQuery.eq("events_producers.producer_id", producerData.id);
  }

  const [eventsData, venues] = await Promise.all([
    eventsQuery,
    getVenues(),
  ]);

  const userEvents: EventFull[] = (eventsData.data || []).map(
    (event: Record<string, unknown>) => {
      const eventDate = new Date(event.date as string);
      const endDate = new Date((event.end_date as string) || (event.date as string));

      return {
        id: event.id as string,
        name: (event.name as string) || "Evento sin nombre",
        flyer: (event.flyer as string) || "/placeholder.svg",
        date: event.date
          ? eventDate.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        hour: eventDate.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end_date: endDate.toISOString().split("T")[0],
        end_hour: endDate.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        variable_fee: event.variable_fee as number,
        age: (event.age as number) || 18,
        description: (event.description as string) || "",
        venue_id: (event.venue_id as string) || "",
        venue_name:
          ((event.venues as Record<string, unknown>)?.name as string) ||
          "Venue por confirmar",
        venue_logo: "",
        venue_latitude:
          ((event.venues as Record<string, unknown>)?.latitude as number) || 0,
        venue_longitude:
          ((event.venues as Record<string, unknown>)?.longitude as number) || 0,
        venue_address:
          ((event.venues as Record<string, unknown>)?.address as string) ||
          "Dirección por confirmar",
        venue_city:
          ((
            (event.venues as Record<string, unknown>)?.cities as Record<
              string,
              unknown
            >
          )?.name as string) || "Ciudad",
        producers: [],
        tickets: (
          ((event.tickets as Array<Record<string, unknown>>) || [])
            .filter((ticket: Record<string, unknown>) => ticket.status === true)
            .map((ticket: Record<string, unknown>) => ({
              id: ticket.id as string,
              name: ticket.name as string,
              price: ticket.price as number,
              description: (ticket.description as string) || "",
            }))
        ),
      };
    }
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
          ADMINISTRAR EVENTOS
        </h1>
        <p className="text-[#404040] mt-1 text-sm sm:text-base">
          Crea y gestiona tus eventos
        </p>
      </div>

      {/* Producer Info Card */}
      {isProducer && producerData && (
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {producerData.logo && (
                  <Image
                    src={producerData.logo}
                    alt={producerData.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-xl">{producerData.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {producerData.description || "Productor de eventos"}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="default">Productor Activo</Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Admin Status Badge */}
      {profile?.admin && !isProducer && (
        <Card className="border-primary/50 bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">Administrador</Badge>
              <CardDescription className="mt-0">
                Gestionando eventos como administrador del sistema
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* User Events */}
      {(isProducer || profile?.admin) && (
        <div className="space-y-4">
          {userEvents.length > 0 ? (
            <AdminEventsList events={userEvents} userId={userId} eventVenues={venues} />
          ) : (
            <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Comienza creando tu primer evento para gestionar entradas y
                    ventas
                  </p>
                  <CreateEventDialog eventVenues={venues} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AdministradorPage;
