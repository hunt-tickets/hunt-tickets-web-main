"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DashboardTab = "dashboard" | "borderaux" | "web";
type SalesTab = "sellers" | "transactions" | "links";

interface EventTabsContextValue {
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  salesTab: SalesTab;
  setSalesTab: (tab: SalesTab) => void;
  chartColor: string;
  setChartColor: (color: string) => void;
}

const EventTabsContext = createContext<EventTabsContextValue | undefined>(undefined);

export function EventTabsProvider({ children }: { children: ReactNode }) {
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("dashboard");
  const [salesTab, setSalesTab] = useState<SalesTab>("sellers");
  const [chartColor, setChartColor] = useState<string>("gray");

  return (
    <EventTabsContext.Provider
      value={{
        dashboardTab,
        setDashboardTab,
        salesTab,
        setSalesTab,
        chartColor,
        setChartColor,
      }}
    >
      {children}
    </EventTabsContext.Provider>
  );
}

export function useEventTabs() {
  const context = useContext(EventTabsContext);
  if (context === undefined) {
    throw new Error("useEventTabs must be used within an EventTabsProvider");
  }
  return context;
}
