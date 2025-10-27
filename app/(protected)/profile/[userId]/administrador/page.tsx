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
import { getAllEventsOrdered } from "@/lib/supabase/queries/server/events";
import { getVenues } from "@/lib/supabase/queries/server/venues";
import { AdminEventsList } from "@/components/admin-events-list";
import { CreateEventDialog } from "@/components/create-event-dialog";

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

  // Fetch events and venues in parallel for optimal performance
  // Both queries run simultaneously using Promise.all
  const [userEvents, venues] = await Promise.all([
    getAllEventsOrdered(), // User's events with authorization
    getVenues(), // All venues ordered by name
  ]);

  return (
    <div className="space-y-6">
      {/* Producer Info Card */}
      {isProducer && producerData && (
        <Card>
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
        <Card className="border-primary/50">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {userEvents.length > 0
                ? `${userEvents.length} evento${
                    userEvents.length !== 1 ? "s" : ""
                  } en total`
                : "Aún no tienes eventos creados"}
            </p>
            <CreateEventDialog
              className="w-full sm:w-auto"
              eventVenues={venues}
            />
          </div>

          {userEvents.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <AdminEventsList events={userEvents} userId={userId} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    Comienza creando tu primer evento para gestionar entradas y
                    ventas
                  </p>
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
