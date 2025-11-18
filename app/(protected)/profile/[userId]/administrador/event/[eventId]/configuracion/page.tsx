import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventConfigContent } from "@/components/event-config-content";
import { EventStickyHeader } from "@/components/event-sticky-header";

interface ConfiguracionPageProps {
  params: Promise<{
    eventId: string;
    userId: string;
  }>;
}

export default async function ConfiguracionPage({ params }: ConfiguracionPageProps) {
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

  // Fetch event details
  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, status")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <>
      {/* Sticky Header */}
      <EventStickyHeader
        eventName={event.name}
        eventStatus={event.status}
        subtitle="Configuración del Evento"
      >
        <EventConfigContent showTabsOnly />
      </EventStickyHeader>

      {/* Content */}
      <div className="px-3 py-3 sm:px-6 sm:py-4">
        <EventConfigContent showContentOnly />
      </div>
    </>
  );
}
