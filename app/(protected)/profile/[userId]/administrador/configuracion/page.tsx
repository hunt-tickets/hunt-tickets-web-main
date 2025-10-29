import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Shield, CreditCard, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HoverButton } from "@/components/ui/hover-glow-button";

interface ConfiguracionPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ConfiguracionPage = async ({ params }: ConfiguracionPageProps) => {
  const { userId } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    redirect("/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("admin")
    .eq("id", user.id)
    .single();

  if (!profile?.admin) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
          CONFIGURACIÓN
        </h1>
        <p className="text-[#404040] mt-1 text-sm sm:text-base">
          Administra la configuración del sistema
        </p>
      </div>

      {/* Configuration Sections */}
      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Configuración General</CardTitle>
            </div>
            <CardDescription>
              Ajustes principales del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Modo Mantenimiento</Label>
                <p className="text-sm text-[#404040]">
                  Deshabilita el acceso público al sitio
                </p>
              </div>
              <Switch id="maintenance" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="registration">Registro de Usuarios</Label>
                <p className="text-sm text-[#404040]">
                  Permite que nuevos usuarios se registren
                </p>
              </div>
              <Switch id="registration" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="events">Creación de Eventos</Label>
                <p className="text-sm text-[#404040]">
                  Permite que productores creen nuevos eventos
                </p>
              </div>
              <Switch id="events" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Configuración de Pagos</CardTitle>
            </div>
            <CardDescription>
              Métodos de pago y comisiones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Comisión Plataforma</Label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-[#303030] text-sm"
                  placeholder="10"
                  defaultValue="10"
                />
                <p className="text-xs text-[#404040]">Porcentaje de comisión</p>
              </div>
              <div className="space-y-2">
                <Label>Comisión Variable</Label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-[#303030] text-sm"
                  placeholder="2.5"
                  defaultValue="2.5"
                />
                <p className="text-xs text-[#404040]">Comisión adicional %</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="stripe">Pagos con Tarjeta</Label>
                <p className="text-sm text-[#404040]">
                  Habilitar pagos con tarjeta de crédito/débito
                </p>
              </div>
              <Switch id="stripe" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cash">Pagos en Efectivo</Label>
                <p className="text-sm text-[#404040]">
                  Permitir reservas con pago en efectivo
                </p>
              </div>
              <Switch id="cash" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Seguridad</CardTitle>
            </div>
            <CardDescription>
              Configuración de seguridad y autenticación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="2fa">Autenticación de 2 Factores</Label>
                <p className="text-sm text-[#404040]">
                  Requerir 2FA para administradores
                </p>
              </div>
              <Switch id="2fa" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session">Duración de Sesión</Label>
                <p className="text-sm text-[#404040]">
                  Tiempo máximo de sesión activa
                </p>
              </div>
              <select className="px-3 py-2 rounded-lg bg-background border border-[#303030] text-sm">
                <option>30 minutos</option>
                <option>1 hora</option>
                <option>2 horas</option>
                <option>1 día</option>
                <option>1 semana</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>
              Configuración de emails y notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-new-user">Nuevo Usuario</Label>
                <p className="text-sm text-[#404040]">
                  Notificar cuando se registre un nuevo usuario
                </p>
              </div>
              <Switch id="email-new-user" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-new-event">Nuevo Evento</Label>
                <p className="text-sm text-[#404040]">
                  Notificar cuando se cree un nuevo evento
                </p>
              </div>
              <Switch id="email-new-event" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-purchase">Nueva Compra</Label>
                <p className="text-sm text-[#404040]">
                  Notificar cada venta de tickets
                </p>
              </div>
              <Switch id="email-purchase" />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <HoverButton
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground"
            glowColor="#000000"
            backgroundColor="transparent"
            textColor="inherit"
            hoverTextColor="inherit"
          >
            Guardar Cambios
          </HoverButton>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage;