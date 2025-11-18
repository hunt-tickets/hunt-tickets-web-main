"use client";

import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface EventStickyHeaderProps {
  eventName: string;
  eventStatus: boolean;
  subtitle?: string;
  children?: ReactNode;
}

export function EventStickyHeader({
  eventName,
  eventStatus,
  subtitle,
  children,
}: EventStickyHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="px-3 py-3 sm:px-6 sm:py-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold sm:text-xl truncate">{eventName}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <Badge variant={eventStatus ? "default" : "secondary"} className="flex-shrink-0">
            {eventStatus ? "Activo" : "Finalizado"}
          </Badge>
        </div>

        {/* Tabs or additional content */}
        {children}
      </div>
    </div>
  );
}
