import React, { ReactNode } from "react";
import { EventSidebarWrapper } from "@/components/event-sidebar-wrapper";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EventLayoutWrapper } from "@/components/event-layout-wrapper";

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
    <EventLayoutWrapper>
      <div className="min-h-screen bg-background">
        {/* Event Sidebar */}
        <EventSidebarWrapper userId={userId} eventId={eventId} eventName={event.name} />

        {/* Main Content - with left margin to accommodate fixed sidebar */}
        <main className="lg:ml-64 min-h-screen">
          {children}
        </main>
      </div>
    </EventLayoutWrapper>
  );
};

export default EventLayout;
