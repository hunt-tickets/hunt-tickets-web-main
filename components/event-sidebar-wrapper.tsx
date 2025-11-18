"use client";

import { EventSidebar } from "@/components/event-sidebar";
import { useMenu } from "@/components/event-layout-wrapper";

interface EventSidebarWrapperProps {
  userId: string;
  eventId: string;
  eventName: string;
}

export function EventSidebarWrapper({ userId, eventId, eventName }: EventSidebarWrapperProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMenu();

  return (
    <EventSidebar
      userId={userId}
      eventId={eventId}
      eventName={eventName}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    />
  );
}
