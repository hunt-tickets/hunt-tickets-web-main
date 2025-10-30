import React, { ReactNode } from "react";
import { EventSidebar } from "@/components/event-sidebar";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface EventLayoutProps {
  children: ReactNode;
  params: Promise<{
    userId: string;
    eventId: string;
  }>;
}

const EventLayout = async ({ children, params }: EventLayoutProps) => {
  const { userId, eventId } = await params;
  const supabase = await createClient();

  // Fetch event name for sidebar
  const { data: event } = await supabase
    .from("events")
    .select("name")
    .eq("id", eventId)
    .single();

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Event Sidebar */}
      <EventSidebar userId={userId} eventId={eventId} eventName={event.name} />

      {/* Main Content - with left margin to accommodate fixed sidebar */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EventLayout;
