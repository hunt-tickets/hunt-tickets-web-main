"use client";

import { ReactNode } from "react";
import { EventStickyHeader } from "@/components/event-sticky-header";
import { useMenu } from "@/components/event-layout-wrapper";

interface EventStickyHeaderWrapperProps {
  eventName: string;
  subtitle?: string;
  children?: ReactNode;
}

export function EventStickyHeaderWrapper({
  eventName,
  subtitle,
  children,
}: EventStickyHeaderWrapperProps) {
  const { toggleMobileMenu } = useMenu();

  return (
    <EventStickyHeader
      eventName={eventName}
      subtitle={subtitle}
      onMenuClick={toggleMobileMenu}
    >
      {children}
    </EventStickyHeader>
  );
}
