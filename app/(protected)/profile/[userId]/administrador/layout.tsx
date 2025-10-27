import React, { ReactNode } from "react";
import { BackToButton } from "@/components/back-to-button";

interface AdministradorLayoutProps {
  children: ReactNode;
}

const AdministradorLayout = ({ children }: AdministradorLayoutProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <BackToButton />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Administrar Eventos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Crea y gestiona eventos
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdministradorLayout;
