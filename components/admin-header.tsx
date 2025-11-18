"use client";

import { ReactNode } from "react";
import { useAdminMenu } from "@/contexts/admin-menu-context";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function AdminHeader({
  title,
  subtitle,
  children,
}: AdminHeaderProps) {
  const { toggleMobileMenu } = useAdminMenu();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex-shrink-0 p-2 -mr-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Additional content */}
      {children}
    </div>
  );
}
