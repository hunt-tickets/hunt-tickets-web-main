"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export function EventConfigContent() {
  return (
    <div className="max-w-7xl mx-auto">
      <Card>
        <CardContent className="py-12 text-center">
          <Settings className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">
            Configuración del Evento
          </h3>
          <p className="text-sm text-muted-foreground">
            Configura los detalles y ajustes del evento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
