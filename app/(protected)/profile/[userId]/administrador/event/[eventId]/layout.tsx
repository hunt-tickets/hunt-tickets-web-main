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
    <>
      {/* Event Sidebar - replaces AdminSidebar */}
      <EventSidebar userId={userId} eventId={eventId} eventName={event.name} />

      {/* Content */}
      {children}
    </>
  );
};

export default EventLayout;
