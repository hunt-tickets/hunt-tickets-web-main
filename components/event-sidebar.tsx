"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Receipt, Settings, Users, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EventSidebarProps {
  userId: string;
  eventId: string;
  eventName: string;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "",
    description: "Resumen financiero y estadísticas",
  },
  {
    title: "Entradas",
    icon: Ticket,
    href: "/entradas",
    description: "Gestiona tipos de entrada",
  },
  {
    title: "Transacciones",
    icon: Receipt,
    href: "/transacciones",
    description: "Historial de ventas",
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/configuracion",
    description: "Ajustes del evento",
  },
  {
    title: "Equipo",
    icon: Users,
    href: "/equipo",
    description: "Productores y artistas",
  },
];

export function EventSidebar({ userId, eventId, eventName }: EventSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseEventPath = `/profile/${userId}/administrador/event/${eventId}`;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-full bg-[#202020] border border-[#303030] hover:bg-[#2a2a2a] transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-[#202020] border-r border-[#2a2a2a] z-40 transition-transform duration-300 lg:translate-x-0 flex-shrink-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo/Brand */}
          <div className="mb-8 px-3">
            <div className="text-xl font-bold text-white mb-1" style={{ fontFamily: "LOT, sans-serif" }}>
              HUNT
            </div>
            <div className="text-xs text-white/40 truncate" title={eventName}>
              {eventName}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const fullHref = `${baseEventPath}${item.href}`;
              const isActive = pathname === fullHref;

              return (
                <Link
                  key={item.href}
                  href={fullHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm relative",
                    isActive
                      ? "bg-primary/10 text-white border-l-2 border-primary"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div>{item.title}</div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-[#2a2a2a]">
            <Link
              href={`/profile/${userId}/administrador`}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Eventos
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
