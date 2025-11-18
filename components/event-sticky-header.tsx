"use client";

import { ReactNode } from "react";

interface EventStickyHeaderProps {
  eventName: string;
  subtitle?: string;
  children?: ReactNode;
}

export function EventStickyHeader({
  eventName,
  subtitle,
  children,
}: EventStickyHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3 py-3 sm:px-6 sm:py-4">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold sm:text-3xl truncate">{eventName}</h1>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Tabs or additional content */}
        {children}
      </div>
    </div>
  );
}
