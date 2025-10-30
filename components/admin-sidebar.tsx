"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, Settings, ArrowLeft, Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userId: string;
}

const menuItems = [
  {
    title: "Administrar Eventos",
    icon: Calendar,
    href: "/administrador",
    description: "Crea y gestiona eventos",
    exact: false, // Will match /administrador/event/[id] too
  },
  {
    title: "Usuarios",
    icon: UserCircle,
    href: "/administrador/usuarios",
    description: "Listado completo de usuarios",
    exact: true,
  },
  {
    title: "Administrar Perfiles",
    icon: Users,
    href: "/administrador/perfiles",
    description: "Gestiona usuarios y perfiles",
    exact: true,
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/administrador/configuracion",
    description: "Ajustes del sistema",
    exact: true,
  },
];

export function AdminSidebar({ userId }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-full bg-[#0a0a0a] border border-[#303030] hover:bg-[#1a1a1a] transition-colors"
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
          "fixed top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] z-40 transition-transform duration-300 lg:translate-x-0 flex-shrink-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo/Brand */}
          <div className="mb-8 px-3">
            <div className="text-xl font-bold text-white" style={{ fontFamily: "LOT, sans-serif" }}>
              HUNT
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const fullHref = `/profile/${userId}${item.href}`;

              // Check if current route matches this menu item
              let isActive = false;
              if (item.exact) {
                isActive = pathname === fullHref;
              } else {
                // For non-exact matches (like /administrador which should also match /administrador/event/[id])
                if (item.href === "/administrador") {
                  isActive = pathname.includes("/administrador") && !pathname.includes("/perfiles") && !pathname.includes("/configuracion") && !pathname.includes("/usuarios");
                } else {
                  isActive = pathname.includes(item.href);
                }
              }

              return (
                <Link
                  key={item.href}
                  href={fullHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                    isActive
                      ? "bg-white text-black"
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
          <div className="pt-4 border-t border-[#1a1a1a]">
            <Link
              href={`/profile/${userId}`}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
