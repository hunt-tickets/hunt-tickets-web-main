import React, { ReactNode } from "react";
import { EventLayoutWrapper } from "@/components/event-layout-wrapper";

interface EventLayoutProps {
  children: ReactNode;
  params: Promise<{
    userId: string;
    eventId: string;
  }>;
}

const EventLayout = async ({ children }: EventLayoutProps) => {
  return (
    <EventLayoutWrapper>
      {children}
    </EventLayoutWrapper>
  );
};

export default EventLayout;
