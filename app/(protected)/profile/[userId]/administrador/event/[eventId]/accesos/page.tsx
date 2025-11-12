import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { getEventAccessControl } from "@/lib/supabase/actions/access-control";
import { EventAccessControlContent } from "@/components/event-access-control-content";

interface AccesosPageProps {
  params: Promise<{
    eventId: string;
    userId: string;
  }>;
}

export default async function AccesosPage({ params }: AccesosPageProps) {
  const { userId, eventId } = await params;
  const supabase = await createClient();

  // Auth check
  if (!userId) {
    redirect("/login");
  }

  // Get user profile to verify admin/producer access
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, admin, producers_admin(producer_id)")
    .eq("id", userId)
    .single();

  const producersAdmin = Array.isArray(profile?.producers_admin)
    ? profile.producers_admin
    : profile?.producers_admin
    ? [profile.producers_admin]
    : [];
  const isProducer = producersAdmin.length > 0;

  if (!profile?.admin && !isProducer) {
    notFound();
  }

  // Fetch event details and access control data
  const [eventData, accessData] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, status")
      .eq("id", eventId)
      .single(),
    getEventAccessControl(eventId),
  ]);

  if (eventData.error || !eventData.data) {
    notFound();
  }

  const event = eventData.data;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{event.name}</h1>
          <p className="text-xs text-muted-foreground">Control de Acceso</p>
        </div>
        <Badge variant={event.status ? "default" : "secondary"}>
          {event.status ? "Activo" : "Finalizado"}
        </Badge>
      </div>

      {/* Access Control Content */}
      <EventAccessControlContent
        qrCodes={accessData?.qrCodes || []}
        transactionsWithoutQR={accessData?.transactionsMissingQR || []}
      />
    </div>
  );
}
