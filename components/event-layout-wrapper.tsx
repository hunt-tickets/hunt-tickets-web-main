"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { EventTabsProvider } from "@/contexts/event-tabs-context";

interface EventLayoutWrapperProps {
  children: ReactNode;
}

interface MenuContextValue {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within EventLayoutWrapper");
  }
  return context;
}

export function EventLayoutWrapper({ children }: EventLayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  return (
    <MenuContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu }}>
      <EventTabsProvider>
        {children}
      </EventTabsProvider>
    </MenuContext.Provider>
  );
}
