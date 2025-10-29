"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  Smartphone,
  Banknote,
  AlertCircle,
  LayoutDashboard,
  Ticket,
  Settings,
  Users,
  HelpCircle,
} from "lucide-react";
import { SalesDistributionChart, RevenueByChannelChart, FinancialBreakdownChart, TicketRevenueDistributionChart, ChannelSalesChart } from "@/components/event-charts";
import { AddProducerDialog } from "@/components/add-producer-dialog";
import { CreateTicketDialog } from "@/components/create-ticket-dialog";
import { EditTicketSheet } from "@/components/edit-ticket-sheet";

interface Ticket {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  max_date: string | null;
  quantity: number;
  reference: string | null;
  status: boolean;
  section: string | null;
  row: string | null;
  seat: string | null;
  palco: string | null;
  capacity: number | null;
  hex: string | null;
  family: string | null;
  ticket_type?: {
    id: string;
    name: string;
  } | null;
}

interface Producer {
  id: string;
  created_at: string;
  producer: {
    id: string;
    name: string | null;
    logo: string | null;
  };
}

interface AllProducer {
  id: string;
  name: string | null;
  logo: string | null;
}

interface TicketAnalytics {
  ticketId: string;
  app: { quantity: number; total: number };
  web: { quantity: number; total: number };
  cash: { quantity: number; total: number };
  total: { quantity: number; total: number };
}

interface TicketType {
  id: string;
  name: string;
}

interface EventTabsProps {
  eventId: string;
  financialReport: any;
  tickets: Ticket[];
  producers: Producer[];
  allProducers: AllProducer[];
  variableFee: number;
  ticketsAnalytics?: Record<string, TicketAnalytics>;
  ticketTypes: TicketType[];
}

export function EventTabs({ eventId, financialReport, tickets, producers, allProducers, variableFee, ticketsAnalytics, ticketTypes }: EventTabsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<string>("all");
  const [selectedPriceTab, setSelectedPriceTab] = useState<Record<string, 'app' | 'cash'>>({});

  useEffect(() => {
    setMounted(true);
    console.log("🎫 EventTabs - Tickets Analytics:", ticketsAnalytics);
    console.log("🎫 EventTabs - Number of tickets:", tickets.length);

    // Calculate total from ticketsAnalytics (TypeScript method)
    if (ticketsAnalytics) {
      const analyticsTotal = Object.values(ticketsAnalytics).reduce((sum, ticket) => sum + ticket.total.quantity, 0);
      console.log("📊 Comparison - Dashboard (RPC Method):", financialReport.tickets_sold.total);
      console.log("📊 Comparison - Entradas Tab (TypeScript Method):", analyticsTotal);
      console.log("📊 Comparison - Difference:", financialReport.tickets_sold.total - analyticsTotal);
      console.log("📊 Comparison - Dashboard has MORE tickets:", financialReport.tickets_sold.total > analyticsTotal);

      // Breakdown by channel from RPC
      console.log("📊 RPC Breakdown - App:", financialReport.tickets_sold.app);
      console.log("📊 RPC Breakdown - Web:", financialReport.tickets_sold.web);
      console.log("📊 RPC Breakdown - Cash:", financialReport.tickets_sold.cash);

      // Breakdown by channel from TypeScript
      const appTotal = Object.values(ticketsAnalytics).reduce((sum, ticket) => sum + ticket.app.quantity, 0);
      const webTotal = Object.values(ticketsAnalytics).reduce((sum, ticket) => sum + ticket.web.quantity, 0);
      const cashTotal = Object.values(ticketsAnalytics).reduce((sum, ticket) => sum + ticket.cash.quantity, 0);
      console.log("📊 TypeScript Breakdown - App:", appTotal);
      console.log("📊 TypeScript Breakdown - Web:", webTotal);
      console.log("📊 TypeScript Breakdown - Cash:", cashTotal);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalTickets = financialReport.tickets_sold.total;
  const appPercentage = (financialReport.tickets_sold.app / totalTickets) * 100;
  const webPercentage = (financialReport.tickets_sold.web / totalTickets) * 100;
  const cashPercentage = (financialReport.tickets_sold.cash / totalTickets) * 100;

  if (!mounted) {
    return null;
  }

  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="entradas" className="flex items-center gap-2">
          <Ticket className="h-4 w-4" />
          Entradas
        </TabsTrigger>
        <TabsTrigger value="configuracion" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configuración
        </TabsTrigger>
        <TabsTrigger value="equipo" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Equipo
        </TabsTrigger>
      </TabsList>

      {/* Dashboard Tab */}
      <TabsContent value="dashboard" className="space-y-4">
        {/* Key Metrics */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Ventas Totales</span>
              </div>
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(financialReport.total_general)}
              </div>
              <p className="text-xs text-white/30">
                {financialReport.tickets_sold.total} tickets
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Liquidación</span>
              </div>
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(financialReport.settlement_amount)}
              </div>
              <p className="text-xs text-white/30">
                Monto a liquidar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <LayoutDashboard className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Ganancia Hunt</span>
              </div>
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(
                  financialReport.global_calculations.ganancia_neta_hunt
                )}
              </div>
              <p className="text-xs text-white/30">
                Ganancia neta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Validación</span>
              </div>
              {financialReport.validation.revenue_discrepancy === 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Validado</span>
                  </div>
                  <p className="text-xs text-white/30">Datos correctos</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium">Revisar</span>
                  </div>
                  <p className="text-xs text-white/30">Discrepancia detectada</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Total Summary - Destacado arriba */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="h-4 w-4 text-white/40" />
                  <span className="text-xs text-white/40 uppercase tracking-wider">Total Tickets</span>
                </div>
                <p className="text-4xl font-bold">{financialReport.tickets_sold.total}</p>
                <p className="text-xs text-white/30 mt-1">
                  {((financialReport.tickets_sold.total / (financialReport.tickets_sold.total + 100)) * 100).toFixed(0)}% vendidos
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-white/40" />
                  <span className="text-xs text-white/40 uppercase tracking-wider">Recaudo Total</span>
                </div>
                <p className="text-4xl font-bold">{formatCurrency(financialReport.channels_total)}</p>
                <p className="text-xs text-white/30 mt-1">
                  Promedio: {formatCurrency(financialReport.channels_total / (financialReport.tickets_sold.total || 1))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Analytics - Reorganizado */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* App Móvil */}
          <Card className="bg-white/[0.02] border-white/5 hover:border-purple-500/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Smartphone className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">App Móvil</span>
                </div>
                <span className="text-xs text-white/40">{appPercentage.toFixed(0)}%</span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/40 mb-1">Tickets</p>
                  <p className="text-2xl font-bold">{financialReport.tickets_sold.app}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Recaudo</p>
                  <p className="text-lg font-semibold">{formatCurrency(financialReport.app_total)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${appPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Web */}
          <Card className="bg-white/[0.02] border-white/5 hover:border-cyan-500/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <CreditCard className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-sm font-medium">Web</span>
                </div>
                <span className="text-xs text-white/40">{webPercentage.toFixed(0)}%</span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/40 mb-1">Tickets</p>
                  <p className="text-2xl font-bold">{financialReport.tickets_sold.web}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Recaudo</p>
                  <p className="text-lg font-semibold">{formatCurrency(financialReport.web_total)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${webPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Efectivo */}
          <Card className="bg-white/[0.02] border-white/5 hover:border-green-500/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Banknote className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-sm font-medium">Efectivo</span>
                </div>
                <span className="text-xs text-white/40">{cashPercentage.toFixed(0)}%</span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/40 mb-1">Tickets</p>
                  <p className="text-2xl font-bold">{financialReport.tickets_sold.cash}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Recaudo</p>
                  <p className="text-lg font-semibold">{formatCurrency(financialReport.cash_total)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${cashPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <SalesDistributionChart
            app={financialReport.tickets_sold.app}
            web={financialReport.tickets_sold.web}
            cash={financialReport.tickets_sold.cash}
          />
          <RevenueByChannelChart
            appTotal={financialReport.app_total}
            webTotal={financialReport.web_total}
            cashTotal={financialReport.cash_total}
          />
        </div>

        <FinancialBreakdownChart
          grossProfit={financialReport.global_calculations.ganancia_bruta_hunt}
          boldDeductions={financialReport.global_calculations.deducciones_bold_total}
          tax4x1000={financialReport.global_calculations.impuesto_4x1000}
          netProfit={financialReport.global_calculations.ganancia_neta_hunt}
        />

        {/* Sales by Channel - Simplified Table */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="text-base">Distribución por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* App */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Smartphone className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">App Móvil</p>
                    <p className="text-xs text-white/40">{financialReport.tickets_sold.app} tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(financialReport.app_total)}</p>
                  <p className="text-xs text-white/40">{appPercentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Web */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <CreditCard className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Web</p>
                    <p className="text-xs text-white/40">{financialReport.tickets_sold.web} tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(financialReport.web_total)}</p>
                  <p className="text-xs text-white/40">{webPercentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Efectivo */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Banknote className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Efectivo</p>
                    <p className="text-xs text-white/40">{financialReport.tickets_sold.cash} tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(financialReport.cash_total)}</p>
                  <p className="text-xs text-white/40">{cashPercentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.05] border border-white/10 mt-2">
                <div>
                  <p className="text-sm font-bold">Total General</p>
                  <p className="text-xs text-white/40">{financialReport.tickets_sold.total} tickets</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatCurrency(financialReport.channels_total)}</p>
                  <p className="text-xs text-white/40">100%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ventas Hunt-Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Precio base</span>
                <span className="font-medium">{formatCurrency(financialReport.hunt_sales.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Impuesto</span>
                <span className="font-medium">{formatCurrency(financialReport.hunt_sales.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Tarifa variable</span>
                <span className="font-medium">
                  {formatCurrency(financialReport.hunt_sales.variable_fee)}
                </span>
              </div>
              <div className="pt-3 mt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-bold">
                  {formatCurrency(financialReport.hunt_sales.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ventas Efectivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Precio base</span>
                <span className="font-medium">
                  {formatCurrency(financialReport.producer_sales.price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Impuesto</span>
                <span className="font-medium">
                  {formatCurrency(financialReport.producer_sales.tax)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Tarifa variable</span>
                <span className="font-medium">
                  {formatCurrency(financialReport.producer_sales.variable_fee)}
                </span>
              </div>
              <div className="pt-3 mt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-bold">
                  {formatCurrency(financialReport.producer_sales.total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">
                  Cálculos Hunt
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Ganancia bruta</span>
                    <span className="font-medium">
                      {formatCurrency(
                        financialReport.global_calculations.ganancia_bruta_hunt
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Deducciones Bold</span>
                    <span className="font-medium text-red-400">
                      -{formatCurrency(
                        financialReport.global_calculations
                          .deducciones_bold_total
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Impuesto 4x1000</span>
                    <span className="font-medium text-red-400">
                      -{formatCurrency(
                        financialReport.global_calculations.impuesto_4x1000
                      )}
                    </span>
                  </div>
                  <div className="pt-3 mt-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-sm font-semibold">Ganancia Neta Hunt</span>
                    <span className="text-lg font-bold text-green-400">
                      {formatCurrency(
                        financialReport.global_calculations.ganancia_neta_hunt
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">
                  Liquidación Productor
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total a liquidar</span>
                  <span className="text-lg font-bold text-cyan-400">
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
            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Transacciones Datáfono
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Monto Total</span>
                      <span className="font-medium">
                        {formatCurrency(
                          financialReport.datafono_calculations.total_amount
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Tarifa POS</span>
                      <span className="font-medium text-red-400">
                        -{formatCurrency(
                          financialReport.datafono_calculations.pos_fee
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Comisión Hunt</span>
                      <span className="font-medium">
                        {formatCurrency(
                          financialReport.datafono_calculations.hunt_commission
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Impuesto comisión</span>
                      <span className="font-medium text-red-400">
                        -{formatCurrency(
                          financialReport.datafono_calculations
                            .tax_on_commission
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Beneficio Hunt</span>
                      <span className="font-medium text-green-400">
                        {formatCurrency(
                          financialReport.datafono_calculations.hunt_net_benefit
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                      <span className="font-semibold">Neto Productor</span>
                      <span className="font-bold text-cyan-400">
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
            <Card className="bg-white/[0.02] border-yellow-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  </div>
                  Validación de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {financialReport.validation.revenue_discrepancy !== 0 && (
                    <div className="flex justify-between text-sm p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                      <span className="text-white/40">
                        Discrepancia de ingresos
                      </span>
                      <span className="font-semibold text-yellow-400">
                        {formatCurrency(
                          financialReport.validation.revenue_discrepancy
                        )}
                      </span>
                    </div>
                  )}
                  {financialReport.validation.mismatched_transactions !== 0 && (
                    <div className="flex justify-between text-sm p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                      <span className="text-white/40">
                        Transacciones no coincidentes
                      </span>
                      <span className="font-semibold text-yellow-400">
                        {financialReport.validation.mismatched_transactions}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-white/30 mt-3 p-3 rounded-lg bg-white/[0.01]">
                    Se detectaron discrepancias. Contacte al equipo de soporte
                    si es necesario.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
      </TabsContent>

      {/* Entradas Tab */}
      <TabsContent value="entradas" className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Tipos de Entrada</h3>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 text-white/40 hover:text-white/60 cursor-help transition-colors" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-zinc-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <p className="text-xs text-white/80 leading-relaxed">
                    Los <strong>Tipos de Entrada</strong> permiten organizar tus boletas por categorías (VIP, General, Palco, etc.). Cada tipo puede tener múltiples tickets con diferentes precios y ubicaciones.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {tickets.length} tipo{tickets.length !== 1 ? 's' : ''} de entrada configurado{tickets.length !== 1 ? 's' : ''}
            </p>
          </div>
          <CreateTicketDialog eventId={eventId} />
        </div>

        {/* Filtros por tipo de ticket */}
        {(() => {
          // Filtrar solo tipos que tengan al menos un ticket
          const typesWithTickets = ticketTypes.filter(type =>
            tickets.some(t => t.ticket_type?.id === type.id)
          );

          if (typesWithTickets.length === 0) return null;

          return (
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedTicketType("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTicketType === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 hover:bg-white/10 text-white/60"
                }`}
              >
                Todos ({tickets.length})
              </button>
              {typesWithTickets.map((type) => {
                const count = tickets.filter(t => t.ticket_type?.id === type.id).length;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTicketType(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedTicketType === type.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 hover:bg-white/10 text-white/60"
                    }`}
                  >
                    {type.name} ({count})
                  </button>
                );
              })}
            </div>
          );
        })()}

        {/* Analytics Overview */}
        {ticketsAnalytics && Object.keys(ticketsAnalytics).length > 0 && (() => {
          // Filtrar tickets según el tipo seleccionado
          const filteredTicketsForAnalytics = selectedTicketType === "all"
            ? tickets
            : tickets.filter(t => t.ticket_type?.id === selectedTicketType);

          // Calcular totales solo para los tickets filtrados
          const totals = filteredTicketsForAnalytics.reduce((acc, ticket) => {
            const analytics = ticketsAnalytics[ticket.id];
            if (!analytics) return acc;
            return {
              total: acc.total + analytics.total.quantity,
              revenue: acc.revenue + analytics.total.total,
              app: acc.app + analytics.app.quantity,
              web: acc.web + analytics.web.quantity,
              cash: acc.cash + analytics.cash.quantity,
            };
          }, { total: 0, revenue: 0, app: 0, web: 0, cash: 0 });

          // Distribución de ingresos por ticket (ordenado por recaudo) - Solo tickets filtrados
          const revenueTickets = filteredTicketsForAnalytics
            .map(ticket => ({
              ...ticket,
              analytics: ticketsAnalytics[ticket.id]
            }))
            .filter(t => t.analytics)
            .sort((a, b) => b.analytics.total.total - a.analytics.total.total);

          // Si no hay datos para mostrar, no renderizar analytics
          if (totals.total === 0) return null;

          return (
            <div className="mb-6 space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="text-xs text-white/40 mb-1">Total Vendidos</div>
                  <div className="text-2xl font-bold">{totals.total}</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="text-xs text-white/40 mb-1">Recaudo Total</div>
                  <div className="text-2xl font-bold">{formatCurrency(totals.revenue)}</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="text-xs text-white/40 mb-1">Tipos Vendiendo</div>
                  <div className="text-2xl font-bold">
                    {filteredTicketsForAnalytics.filter(t => ticketsAnalytics[t.id]).length}
                  </div>
                  <div className="text-xs text-white/30">de {filteredTicketsForAnalytics.length}</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="text-xs text-white/40 mb-1">Ticket Promedio</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totals.total > 0 ? totals.revenue / totals.total : 0)}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Ventas por Canal */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                  <h4 className="text-sm font-semibold mb-4">Ventas por Canal</h4>
                  <div className="h-[350px]">
                    <ChannelSalesChart
                      app={totals.app}
                      web={totals.web}
                      cash={totals.cash}
                    />
                  </div>
                </div>

                {/* Distribución de Ingresos */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                  <h4 className="text-sm font-semibold mb-4">Distribución de Ingresos por Ticket</h4>
                  <div className="h-[350px]">
                    <TicketRevenueDistributionChart
                      tickets={revenueTickets.map((ticket) => ({
                        name: ticket.name,
                        revenue: ticket.analytics.total.total,
                        quantity: ticket.analytics.total.quantity,
                        percentage: (ticket.analytics.total.total / totals.revenue) * 100,
                        color: ticket.hex || undefined
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {(() => {
          // Filtrar tickets según el tipo seleccionado
          const filteredTickets = selectedTicketType === "all"
            ? tickets
            : tickets.filter(t => t.ticket_type?.id === selectedTicketType);

          return filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-1">
                  {tickets.length === 0 ? "No hay entradas configuradas" : "No hay entradas de este tipo"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tickets.length === 0 ? "Crea tipos de entrada para empezar a vender" : "Prueba con otro filtro"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTickets.map((ticket) => {
              const variableFeeAmount = ticket.price * variableFee;
              const taxAmount = variableFeeAmount * 0.19;
              const totalPrice = ticket.price + variableFeeAmount + taxAmount;
              const analytics = ticketsAnalytics?.[ticket.id];

              return (
                <Card key={ticket.id} className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-300 group">
                  <CardContent className="p-5">
                    {/* Header con nombre y estado */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {ticket.hex && (
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: ticket.hex }}
                          />
                        )}
                        <h3 className="text-base font-bold">{ticket.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.status ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {ticket.status ? 'Activo' : 'Inactivo'}
                        </div>
                        <EditTicketSheet ticket={ticket} />
                      </div>
                    </div>

                    {/* Analytics destacados */}
                    {analytics && (
                      <div className="mb-4 p-4 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-white/40 mb-1">Vendidos</p>
                            <p className="text-2xl font-bold">{analytics.total.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/40 mb-1">Recaudo</p>
                            <p className="text-xl font-bold">{formatCurrency(analytics.total.total)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                          <div className="text-center">
                            <p className="text-xs text-white/30 mb-1">App</p>
                            <p className="text-sm font-semibold text-white/80">{analytics.app.quantity}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/30 mb-1">Web</p>
                            <p className="text-sm font-semibold text-white/80">{analytics.web.quantity}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/30 mb-1">Cash</p>
                            <p className="text-sm font-semibold text-white/80">{analytics.cash.quantity}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Precio con tabs */}
                    <div className="mb-4 p-4 rounded-lg bg-white/[0.03] border border-white/5">
                      {/* Tabs */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setSelectedPriceTab({ ...selectedPriceTab, [ticket.id]: 'app' })}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            (selectedPriceTab[ticket.id] || 'app') === 'app'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'
                          }`}
                        >
                          App/Web
                        </button>
                        <button
                          onClick={() => setSelectedPriceTab({ ...selectedPriceTab, [ticket.id]: 'cash' })}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedPriceTab[ticket.id] === 'cash'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'
                          }`}
                        >
                          Efectivo
                        </button>
                      </div>

                      {/* Precio según tab seleccionado */}
                      {(selectedPriceTab[ticket.id] || 'app') === 'app' ? (
                        <div>
                          <p className="text-xs text-white/40 mb-1">Precio App/Web</p>
                          <p className="text-xl font-bold mb-3">{formatCurrency(totalPrice)}</p>
                          <details className="group/details">
                            <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60 list-none flex items-center gap-1 pt-3 border-t border-white/5">
                              <span>Ver desglose</span>
                              <svg className="w-3 h-3 transition-transform group-open/details:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="mt-3 space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-white/40">Precio base</span>
                                <span className="font-medium">{formatCurrency(ticket.price)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/40">Fee ({(variableFee * 100).toFixed(0)}%)</span>
                                <span className="font-medium">{formatCurrency(variableFeeAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/40">IVA (19%)</span>
                                <span className="font-medium">{formatCurrency(taxAmount)}</span>
                              </div>
                            </div>
                          </details>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-white/40 mb-1">Precio Efectivo</p>
                          <p className="text-xl font-bold mb-1">{formatCurrency(ticket.price)}</p>
                          <p className="text-xs text-white/30">Sin fee adicional</p>
                        </div>
                      )}
                    </div>

                    {/* Barra de progreso de ventas */}
                    {analytics && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-white/40">Ventas</span>
                          <span className="text-xs font-medium">
                            {analytics.total.quantity} / {ticket.quantity}
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${((analytics.total.quantity / ticket.quantity) * 100).toFixed(1)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-white/30">Vendidos: {analytics.total.quantity}</span>
                          <span className="text-xs text-white/30">Disponibles: {ticket.quantity - analytics.total.quantity}</span>
                        </div>
                      </div>
                    )}

                    {/* Info adicional */}
                    {!analytics && (
                      <div className="mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/40">Disponibles</span>
                          <span className="font-medium">{ticket.quantity}</span>
                        </div>
                      </div>
                    )}

                    {(ticket.capacity || ticket.family) && (
                      <div className="space-y-2 text-sm mb-4">
                        {ticket.capacity && (
                          <div className="flex justify-between">
                            <span className="text-white/40">Capacidad</span>
                            <span className="font-medium">{ticket.capacity}</span>
                          </div>
                        )}
                        {ticket.family && (
                          <div className="flex justify-between">
                            <span className="text-white/40">Familia</span>
                            <span className="font-medium">{ticket.family}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Metadata (ubicación, fecha, etc) */}
                    {(ticket.section || ticket.row || ticket.seat || ticket.palco || ticket.max_date) && (
                      <div className="pt-4 mt-4 border-t border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {ticket.section && (
                            <span className="px-2 py-1 rounded text-xs text-white/50 bg-white/[0.02] border border-white/5">
                              Sec. {ticket.section}
                            </span>
                          )}
                          {ticket.row && (
                            <span className="px-2 py-1 rounded text-xs text-white/50 bg-white/[0.02] border border-white/5">
                              Fila {ticket.row}
                            </span>
                          )}
                          {ticket.seat && (
                            <span className="px-2 py-1 rounded text-xs text-white/50 bg-white/[0.02] border border-white/5">
                              Asiento {ticket.seat}
                            </span>
                          )}
                          {ticket.palco && (
                            <span className="px-2 py-1 rounded text-xs text-white/50 bg-white/[0.02] border border-white/5">
                              Palco {ticket.palco}
                            </span>
                          )}
                          {ticket.max_date && (
                            <span className="px-2 py-1 rounded text-xs text-white/50 bg-white/[0.02] border border-white/5">
                              Hasta {new Date(ticket.max_date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })} {new Date(ticket.max_date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            </div>
          );
        })()}
      </TabsContent>

      {/* Configuración Tab */}
      <TabsContent value="configuracion" className="space-y-4">
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
      </TabsContent>

      {/* Equipo Tab */}
      <TabsContent value="equipo" className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Equipo del Evento</h3>
            <p className="text-sm text-muted-foreground">
              {producers.length} productor{producers.length !== 1 ? 'es' : ''} asignado{producers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <AddProducerDialog
            eventId={eventId}
            availableProducers={allProducers.filter(
              ap => !producers.some(p => p.producer.id === ap.id)
            )}
          />
        </div>

        {producers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                No hay productores asignados
              </h3>
              <p className="text-sm text-muted-foreground">
                Asigna productores al evento para gestionar el equipo
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {producers.map((item) => {
              const producer = item.producer;
              const displayName = producer.name || 'Sin nombre';

              return (
                <Card key={item.id} className="group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative pt-8 pb-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        {producer.logo ? (
                          <img
                            src={producer.logo}
                            alt={displayName}
                            className="w-20 h-20 rounded-xl object-cover ring-4 ring-white/5 group-hover:ring-white/10 transition-all duration-300"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center ring-4 ring-white/5 group-hover:ring-white/10 transition-all duration-300">
                            <Users className="h-10 w-10 text-primary" />
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                        {displayName}
                      </h4>
                      <p className="text-sm text-white/40 font-medium">
                        Productor
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
