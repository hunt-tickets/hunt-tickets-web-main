import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Banknote,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getEventFinancialReport } from "@/lib/actions/events";

interface EventPageProps {
  params: Promise<{
    eventId: string;
    userId: string;
  }>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default async function EventFinancialPage({ params }: EventPageProps) {
  const { userId, eventId } = await params;
  const supabase = await createClient();

  // Auth check
  if (!userId) {
    redirect("/login");
  }

  // Get user profile to verify admin/producer access
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, admin, producers_admin(producer_id)")
    .eq("id", userId)
    .single();

  const isProducer = (profile?.producers_admin?.length ?? 0) > 0;

  if (!profile?.admin && !isProducer) {
    notFound();
  }

  // Fetch event details and financial report
  const [eventData, financialReport] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, status")
      .eq("id", eventId)
      .single(),
    getEventFinancialReport(eventId),
  ]);

  if (eventData.error || !eventData.data) {
    notFound();
  }

  const event = eventData.data;

  // Empty state
  if (!financialReport) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/profile/${userId}/administrador`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{event.name}</h1>
              <p className="text-sm text-muted-foreground">
                Reporte Financiero
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                Sin datos financieros
              </h3>
              <p className="text-sm text-muted-foreground">
                Los datos aparecerán una vez se realicen las primeras ventas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalTickets = financialReport.tickets_sold.total;
  const appPercentage = (financialReport.tickets_sold.app / totalTickets) * 100;
  const webPercentage = (financialReport.tickets_sold.web / totalTickets) * 100;
  const cashPercentage =
    (financialReport.tickets_sold.cash / totalTickets) * 100;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">{event.name}</h1>
              <p className="text-xs text-muted-foreground">
                {new Date(financialReport.timestamp).toLocaleString("es-CO", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
          <Badge variant={event.status ? "default" : "secondary"}>
            {event.status ? "Activo" : "Finalizado"}
          </Badge>
        </div>

        {/* Key Metrics - Mobile First */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ventas Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialReport.total_general)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {financialReport.tickets_sold.total} tickets vendidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Liquidación Productor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialReport.settlement_amount)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Monto a liquidar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ganancia Hunt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  financialReport.global_calculations.ganancia_neta_hunt
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ganancia neta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estado de Validación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {financialReport.validation.revenue_discrepancy === 0 ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">Datos validados</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-sm">Revisar datos</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales by Channel - Simple Table */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Canal</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Canal
                    </th>
                    <th className="text-right p-4 font-medium text-muted-foreground">
                      Tickets
                    </th>
                    <th className="text-right p-4 font-medium text-muted-foreground">
                      %
                    </th>
                    <th className="text-right p-4 font-medium text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>App</span>
                      </div>
                    </td>
                    <td className="text-right p-4">
                      {financialReport.tickets_sold.app}
                    </td>
                    <td className="text-right p-4">
                      {appPercentage.toFixed(1)}%
                    </td>
                    <td className="text-right p-4 font-semibold">
                      {formatCurrency(financialReport.app_total)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>Web</span>
                      </div>
                    </td>
                    <td className="text-right p-4">
                      {financialReport.tickets_sold.web}
                    </td>
                    <td className="text-right p-4">
                      {webPercentage.toFixed(1)}%
                    </td>
                    <td className="text-right p-4 font-semibold">
                      {formatCurrency(financialReport.web_total)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <span>Efectivo</span>
                      </div>
                    </td>
                    <td className="text-right p-4">
                      {financialReport.tickets_sold.cash}
                    </td>
                    <td className="text-right p-4">
                      {cashPercentage.toFixed(1)}%
                    </td>
                    <td className="text-right p-4 font-semibold">
                      {formatCurrency(financialReport.cash_total)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Total</td>
                    <td className="text-right p-4 font-semibold">
                      {financialReport.tickets_sold.total}
                    </td>
                    <td className="text-right p-4 font-semibold">100%</td>
                    <td className="text-right p-4 font-bold text-lg">
                      {formatCurrency(financialReport.channels_total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sales Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ventas Hunt-Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Precio base</span>
                <span>{formatCurrency(financialReport.hunt_sales.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impuesto</span>
                <span>{formatCurrency(financialReport.hunt_sales.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tarifa variable</span>
                <span>
                  {formatCurrency(financialReport.hunt_sales.variable_fee)}
                </span>
              </div>
              <div className="pt-3 border-t flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">
                  {formatCurrency(financialReport.hunt_sales.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ventas Efectivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Precio base</span>
                <span>
                  {formatCurrency(financialReport.producer_sales.price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impuesto</span>
                <span>
                  {formatCurrency(financialReport.producer_sales.tax)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tarifa variable</span>
                <span>
                  {formatCurrency(financialReport.producer_sales.variable_fee)}
                </span>
              </div>
              <div className="pt-3 border-t flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">
                  {formatCurrency(financialReport.producer_sales.total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Cálculos Hunt
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Ganancia bruta
                    </span>
                    <span>
                      {formatCurrency(
                        financialReport.global_calculations.ganancia_bruta_hunt
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Deducciones Bold
                    </span>
                    <span className="text-red-600">
                      {formatCurrency(
                        financialReport.global_calculations
                          .deducciones_bold_total
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Impuesto 4x1000
                    </span>
                    <span className="text-red-600">
                      {formatCurrency(
                        financialReport.global_calculations.impuesto_4x1000
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t flex justify-between">
                    <span className="font-semibold">Ganancia Neta Hunt</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(
                        financialReport.global_calculations.ganancia_neta_hunt
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Liquidación Productor
                </h4>
                <div className="flex justify-between">
                  <span className="font-semibold">Total a liquidar</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(financialReport.settlement_amount)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datafono Calculations */}
        {financialReport.datafono_calculations &&
          financialReport.datafono_calculations.total_amount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Transacciones Datáfono
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monto Total</span>
                      <span>
                        {formatCurrency(
                          financialReport.datafono_calculations.total_amount
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tarifa POS</span>
                      <span>
                        {formatCurrency(
                          financialReport.datafono_calculations.pos_fee
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Comisión Hunt
                      </span>
                      <span>
                        {formatCurrency(
                          financialReport.datafono_calculations.hunt_commission
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Impuesto comisión
                      </span>
                      <span>
                        {formatCurrency(
                          financialReport.datafono_calculations
                            .tax_on_commission
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Beneficio Hunt
                      </span>
                      <span>
                        {formatCurrency(
                          financialReport.datafono_calculations.hunt_net_benefit
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Neto Productor</span>
                      <span>
                        {formatCurrency(
                          financialReport.datafono_calculations
                            .producer_net_amount
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Validation Status - Only show if there are issues */}
        {financialReport.validation &&
          (financialReport.validation.revenue_discrepancy !== 0 ||
            financialReport.validation.mismatched_transactions !== 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Validación de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialReport.validation.revenue_discrepancy !== 0 && (
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="text-muted-foreground">
                        Discrepancia de ingresos
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(
                          financialReport.validation.revenue_discrepancy
                        )}
                      </span>
                    </div>
                  )}
                  {financialReport.validation.mismatched_transactions !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Transacciones no coincidentes
                      </span>
                      <span className="font-semibold">
                        {financialReport.validation.mismatched_transactions}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Se detectaron discrepancias. Contacte al equipo de soporte
                    si es necesario.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
