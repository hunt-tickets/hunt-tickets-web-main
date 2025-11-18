"use client";

import { ReactNode } from "react";
import { useAdminMenu } from "@/contexts/admin-menu-context";
import { Menu } from "lucide-react";

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
  const { toggleMobileMenu } = useAdminMenu();

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3 py-3 sm:px-6 sm:py-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex-shrink-0 p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl truncate">{eventName}</h1>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Tabs or additional content */}
        {children}
      </div>
    </div>
  );
}
