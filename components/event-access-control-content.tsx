"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CheckCircle2, Clock, QrCode, BarChart3, List, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toggleQRScanStatus } from "@/lib/supabase/actions/toggle-scan";
import { toast } from "sonner";
import { useEventTabs } from "@/contexts/event-tabs-context";

interface QRCode {
  id: string;
  transaction_id: string;
  user_id: string;
  created_at: string;
  scan: boolean;
  scanner_id: string | null;
  updated_at: string | null;
  apple: boolean;
  google: boolean;
  user_name: string;
  user_email: string;
  scanner_name: string | null;
  scanner_email: string | null;
  ticket_name: string;
  source: string;
  order_id: string | null;
}

interface TransactionWithoutQR {
  id: string;
  transaction_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  ticket_name: string;
  quantity: number;
  actualQRs: number;
  missingQRs: number;
  status: string;
  source: string;
  order_id: string | null;
  created_at: string;
  total: number;
}

interface EventAccessControlContentProps {
  qrCodes: QRCode[];
  transactionsWithoutQR: TransactionWithoutQR[];
  showTabsOnly?: boolean;
  showContentOnly?: boolean;
}

export function EventAccessControlContent({ qrCodes, transactionsWithoutQR, showTabsOnly = false, showContentOnly = false }: EventAccessControlContentProps) {
  const { accessControlTab: mainTab, setAccessControlTab: setMainTab } = useEventTabs();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "scanned" | "pending" | "noqr">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [localQRCodes, setLocalQRCodes] = useState(qrCodes);
  const [updatingQR, setUpdatingQR] = useState<string | null>(null);
  const itemsPerPage = 50;

  // Handle toggle scan status
  const handleToggleScan = async (qrId: string, currentStatus: boolean) => {
    setUpdatingQR(qrId);

    // Optimistic update
    setLocalQRCodes(prev =>
      prev.map(qr =>
        qr.id === qrId
          ? { ...qr, scan: !currentStatus, updated_at: new Date().toISOString() }
          : qr
      )
    );

    const result = await toggleQRScanStatus(qrId, currentStatus);

    if (!result.success) {
      // Revert on error
      setLocalQRCodes(prev =>
        prev.map(qr =>
          qr.id === qrId
            ? { ...qr, scan: currentStatus }
            : qr
        )
      );
      toast.error(result.error || "Error al actualizar el estado");
    } else {
      toast.success(result.newStatus ? "Marcada como escaneada" : "Marcada como pendiente");
    }

    setUpdatingQR(null);
  };

  // Filter by tab
  const tabFilteredQRCodes = useMemo(() => {
    if (activeTab === "scanned") {
      return localQRCodes.filter(qr => qr.scan === true);
    } else if (activeTab === "pending") {
      return localQRCodes.filter(qr => qr.scan === false);
    }
    return localQRCodes;
  }, [localQRCodes, activeTab]);

  // Filter by search
  const filteredQRCodes = useMemo(() => {
    if (!searchTerm) return tabFilteredQRCodes;

    const search = searchTerm.toLowerCase();
    return tabFilteredQRCodes.filter(qr =>
      qr.user_name.toLowerCase().includes(search) ||
      qr.user_email.toLowerCase().includes(search) ||
      qr.ticket_name.toLowerCase().includes(search) ||
      (qr.order_id && qr.order_id.toLowerCase().includes(search)) ||
      qr.id.toLowerCase().includes(search)
    );
  }, [tabFilteredQRCodes, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredQRCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQRCodes = filteredQRCodes.slice(startIndex, endIndex);

  // Calculate statistics
  const stats = useMemo(() => {
    const scanned = localQRCodes.filter(qr => qr.scan === true).length;
    const pending = localQRCodes.filter(qr => qr.scan === false).length;
    const scanRate = localQRCodes.length > 0 ? (scanned / localQRCodes.length) * 100 : 0;

    return {
      total: localQRCodes.length,
      scanned,
      pending,
      scanRate: scanRate.toFixed(1),
    };
  }, [localQRCodes]);

  // Reset to first page when search or tab changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: "all" | "scanned" | "pending" | "noqr") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Calculate breakdown by ticket type
  const ticketBreakdown = useMemo(() => {
    const breakdown = new Map<string, {
      total: number;
      scanned: number;
      pending: number;
      scanRate: number;
    }>();

    localQRCodes.forEach(qr => {
      const current = breakdown.get(qr.ticket_name) || {
        total: 0,
        scanned: 0,
        pending: 0,
        scanRate: 0,
      };

      current.total += 1;
      if (qr.scan) {
        current.scanned += 1;
      } else {
        current.pending += 1;
      }

      breakdown.set(qr.ticket_name, current);
    });

    // Calculate scan rates and convert to array
    const result = Array.from(breakdown.entries()).map(([name, data]) => ({
      name,
      total: data.total,
      scanned: data.scanned,
      pending: data.pending,
      scanRate: data.total > 0 ? (data.scanned / data.total) * 100 : 0,
    }));

    // Sort by total descending
    return result.sort((a, b) => b.total - a.total);
  }, [localQRCodes]);

  // Tabs section
  const tabsSection = (
    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <button
        onClick={() => setMainTab("analytics")}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
          mainTab === "analytics"
            ? "bg-white/10 text-white border border-white/20"
            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
        }`}
      >
        <BarChart3 className="h-4 w-4" />
        Analítica
      </button>
      <button
        onClick={() => setMainTab("list")}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
          mainTab === "list"
            ? "bg-white/10 text-white border border-white/20"
            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
        }`}
      >
        <List className="h-4 w-4" />
        Lista
      </button>
    </div>
  );

  // Content section
  const contentSection = (
    <div className="space-y-4">

      {/* Analytics Tab Content */}
      {mainTab === "analytics" && (
        <div className="space-y-4">
          {/* Statistics KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Total QR Codes</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
          <div className="text-xs text-green-400/60 mb-1">Escaneadas</div>
          <div className="text-2xl font-bold text-white">{stats.scanned}</div>
          <div className="text-xs text-green-400/40 mt-1">{stats.scanRate}% del total</div>
        </div>
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <div className="text-xs text-yellow-400/60 mb-1">Pendientes</div>
          <div className="text-2xl font-bold text-white">{stats.pending}</div>
        </div>
      </div>

          {/* Empty State */}
          {ticketBreakdown.length === 0 && transactionsWithoutQR.length === 0 && (
            <Card className="bg-white/[0.02] border-white/5 min-h-[60vh]">
              <CardContent className="h-full flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="rounded-full bg-white/5 p-4">
                    <QrCode className="h-12 w-12 text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No hay datos de acceso aún
                    </h3>
                    <p className="text-sm text-white/60 max-w-md mx-auto">
                      Los datos de control de acceso aparecerán aquí cuando se generen códigos QR o se realicen ventas para este evento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Breakdown by Ticket Type */}
          {ticketBreakdown.length > 0 && (
            <Card className="bg-white/[0.02] border-white/5">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-white/60" />
                  Desglose por Tipo de Entrada
                </h3>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {ticketBreakdown.map((ticket) => (
                    <div
                      key={ticket.name}
                      className="p-4 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      {/* Ticket Name */}
                      <div className="text-sm font-semibold text-white/90 mb-3">
                        {ticket.name}
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-white/40 mb-1">Total</div>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-white/80">
                            {ticket.total}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-white/40 mb-1">Escaneadas</div>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400">
                            {ticket.scanned}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-white/40 mb-1">Pendientes</div>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-400">
                            {ticket.pending}
                          </span>
                        </div>
                      </div>

                      {/* Scan Rate */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">% Escaneo</span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          ticket.scanRate >= 80
                            ? 'bg-green-500/20 text-green-400'
                            : ticket.scanRate >= 50
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {ticket.scanRate.toFixed(1)}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ticket.scanRate >= 80
                              ? 'bg-green-500'
                              : ticket.scanRate >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${ticket.scanRate}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-white/40 text-center">
                        {ticket.scanned} de {ticket.total}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Entrada</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Escaneadas</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Pendientes</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">% Escaneo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Progreso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ticketBreakdown.map((ticket) => (
                        <tr
                          key={ticket.name}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-white/90">
                            {ticket.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-white/80">
                              {ticket.total}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400">
                              {ticket.scanned}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-400">
                              {ticket.pending}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              ticket.scanRate >= 80
                                ? 'bg-green-500/20 text-green-400'
                                : ticket.scanRate >= 50
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {ticket.scanRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-full">
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    ticket.scanRate >= 80
                                      ? 'bg-green-500'
                                      : ticket.scanRate >= 50
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${ticket.scanRate}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-1 text-xs text-white/40">
                                <span>{ticket.scanned} de {ticket.total}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transactions without QR - Analytics View */}
          {transactionsWithoutQR.length > 0 && (
            <Card className="bg-white/[0.02] border-white/5">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-red-400" />
                  Transacciones con QR Faltantes ({transactionsWithoutQR.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Usuario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Entrada</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Comprados</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Generados</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Faltantes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactionsWithoutQR.slice(0, 10).map((tx) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 text-sm">
                            <div className="text-white/90">{tx.user_name}</div>
                            <div className="text-xs text-white/40 truncate max-w-[150px]" title={tx.user_email}>
                              {tx.user_email}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/90">
                            {tx.ticket_name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400">
                              {tx.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400">
                              {tx.actualQRs}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                              {tx.missingQRs}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {transactionsWithoutQR.length > 10 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setMainTab("list")}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Ver todas las {transactionsWithoutQR.length} transacciones →
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* List Tab Content */}
      {mainTab === "list" && (
        <div className="space-y-4">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {/* Search - Left side, takes most space */}
            <div className="relative flex-1">
              {/* Search Icon */}
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10">
                <Search className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                  isFocused ? 'text-white/80' : 'text-white/50'
                }`} />
              </div>

              <Input
                type="text"
                placeholder="Buscar por usuario, email, entrada, pedido..."
                className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 h-11 sm:h-12 text-base bg-white/10 border rounded-3xl text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200 ${
                  isFocused
                    ? 'border-white/40 bg-white/15'
                    : 'border-white/20 hover:border-white/30 hover:bg-white/12'
                }`}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              {/* Clear button */}
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/70 hover:text-white" />
                </button>
              )}
            </div>

            {/* Filter Select - Right side */}
            <div className="relative sm:min-w-fit">
              <select
                value={activeTab}
                onChange={(e) => handleTabChange(e.target.value as "all" | "scanned" | "pending" | "noqr")}
                className="appearance-none pl-4 pr-10 py-2.5 sm:py-3 text-sm font-medium rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all cursor-pointer whitespace-nowrap"
              >
                <option value="all" className="bg-zinc-900">
                  Todas - {localQRCodes.length.toLocaleString('es-CO')}
                </option>
                <option value="scanned" className="bg-zinc-900">
                  ✓ Escaneadas - {stats.scanned.toLocaleString('es-CO')}
                </option>
                <option value="pending" className="bg-zinc-900">
                  ⏱ Pendientes - {stats.pending.toLocaleString('es-CO')}
                </option>
                <option value="noqr" className="bg-zinc-900">
                  ⚠ Sin QR - {transactionsWithoutQR.length.toLocaleString('es-CO')}
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-white/60">
            {filteredQRCodes.length} entrada{filteredQRCodes.length !== 1 ? 's' : ''} encontrada{filteredQRCodes.length !== 1 ? 's' : ''}
          </div>

      {/* Content based on active tab */}
      {activeTab === "noqr" ? (
        /* Transactions without QR */
        transactionsWithoutQR.length === 0 ? (
          <Card className="bg-white/[0.02] border-white/5 min-h-[60vh]">
            <CardContent className="h-full flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-white/5 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    ¡Perfecto!
                  </h3>
                  <p className="text-sm text-white/60 max-w-md mx-auto">
                    Todas las transacciones tienen códigos QR generados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactionsWithoutQR.map((tx) => (
              <div
                key={tx.id}
                className="relative bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-white mb-1">{tx.ticket_name}</h4>
                    <p className="text-xs text-white/60">{tx.user_name}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Sin QR
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-white/40 mb-1">Comprados</div>
                    <div className="text-lg font-bold text-blue-400">{tx.quantity}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/40 mb-1">Generados</div>
                    <div className="text-lg font-bold text-green-400">{tx.actualQRs}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/40 mb-1">Faltantes</div>
                    <div className="text-lg font-bold text-red-400">{tx.missingQRs}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* QR Codes as Tickets */
        currentQRCodes.length === 0 ? (
          <Card className="bg-white/[0.02] border-white/5 min-h-[60vh]">
            <CardContent className="h-full flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-white/5 p-4">
                  <QrCode className="h-12 w-12 text-white/40" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {searchTerm ? "No se encontraron entradas" : "No hay entradas"}
                  </h3>
                  <p className="text-sm text-white/60 max-w-md mx-auto">
                    {searchTerm ? "Intenta con otro término de búsqueda" : "Las entradas aparecerán aquí cuando haya ventas"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentQRCodes.map((qr) => {
                const isScanned = qr.scan;

                return (
                  <div
                    key={qr.id}
                    className="relative bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">{qr.ticket_name}</h4>
                        <p className="text-xs text-white/60">{qr.user_name}</p>
                        <p className="text-xs text-white/40 truncate max-w-[200px]">{qr.user_email}</p>
                      </div>
                      <button
                        onClick={() => handleToggleScan(qr.id, qr.scan)}
                        disabled={updatingQR === qr.id}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-all ${
                          isScanned
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                        } ${updatingQR === qr.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {updatingQR === qr.id ? (
                          <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            {isScanned ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                Escaneado
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3" />
                                Pendiente
                              </>
                            )}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {qr.order_id && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40">Pedido</span>
                          <span className="font-mono text-white/70">{qr.order_id}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">Compra</span>
                        <span className="text-white/70">
                          {new Date(qr.created_at).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                          })}
                        </span>
                      </div>
                      {isScanned && qr.scanner_name && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/40">Escaneado por</span>
                            <span className="text-white/70">{qr.scanner_name}</span>
                          </div>
                          {qr.updated_at && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/40">Fecha escaneo</span>
                              <span className="text-white/70">
                                {new Date(qr.updated_at).toLocaleDateString(undefined, {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                })}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-white/60">
                  Mostrando {startIndex + 1} - {Math.min(endIndex, filteredQRCodes.length)} de {filteredQRCodes.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm px-4 py-2 rounded-lg bg-white/5">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )
      )}
        </div>
      )}
    </div>
  );

  // Return based on mode
  if (showTabsOnly) {
    return tabsSection;
  }

  if (showContentOnly) {
    return contentSection;
  }

  // Default: show both
  return (
    <div className="space-y-4">
      {tabsSection}
      {contentSection}
    </div>
  );
}
