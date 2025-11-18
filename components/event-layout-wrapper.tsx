"use client";

import { ReactNode } from "react";
import { EventTabsProvider } from "@/contexts/event-tabs-context";

interface EventLayoutWrapperProps {
  children: ReactNode;
}

export function EventLayoutWrapper({ children }: EventLayoutWrapperProps) {
  return <EventTabsProvider>{children}</EventTabsProvider>;
}
