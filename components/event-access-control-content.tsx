"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CheckCircle2, Clock, QrCode, BarChart3, List } from "lucide-react";
import { Input } from "@/components/ui/input";

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
}

export function EventAccessControlContent({ qrCodes, transactionsWithoutQR }: EventAccessControlContentProps) {
  const [mainTab, setMainTab] = useState<"analytics" | "list">("analytics");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "scanned" | "pending" | "noqr">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Filter by tab
  const tabFilteredQRCodes = useMemo(() => {
    if (activeTab === "scanned") {
      return qrCodes.filter(qr => qr.scan === true);
    } else if (activeTab === "pending") {
      return qrCodes.filter(qr => qr.scan === false);
    }
    return qrCodes;
  }, [qrCodes, activeTab]);

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
    const scanned = qrCodes.filter(qr => qr.scan === true).length;
    const pending = qrCodes.filter(qr => qr.scan === false).length;
    const scanRate = qrCodes.length > 0 ? (scanned / qrCodes.length) * 100 : 0;

    return {
      total: qrCodes.length,
      scanned,
      pending,
      scanRate: scanRate.toFixed(1),
    };
  }, [qrCodes]);

  // Reset to first page when search or tab changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: "all" | "scanned" | "pending" | "noqr") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Calculate missing QR codes (not quantity, but actual missing QRs)
  const totalTicketsWithoutQR = transactionsWithoutQR.reduce((sum, t) => sum + t.missingQRs, 0);

  // Calculate breakdown by ticket type
  const ticketBreakdown = useMemo(() => {
    const breakdown = new Map<string, {
      total: number;
      scanned: number;
      pending: number;
      scanRate: number;
    }>();

    qrCodes.forEach(qr => {
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
  }, [qrCodes]);

  return (
    <div className="space-y-4">
      {/* Main Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setMainTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
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
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
            mainTab === "list"
              ? "bg-white/10 text-white border border-white/20"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <List className="h-4 w-4" />
          Lista
        </button>
      </div>

      {/* Analytics Tab Content */}
      {mainTab === "analytics" && (
        <div className="space-y-4">
          {/* Statistics KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Total QR Codes</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
          <div className="text-xs text-green-400/60 mb-1">Escaneadas</div>
          <div className="text-2xl font-bold text-green-400">{stats.scanned}</div>
          <div className="text-xs text-green-400/40 mt-1">{stats.scanRate}% del total</div>
        </div>
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <div className="text-xs text-yellow-400/60 mb-1">Pendientes</div>
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
        </div>
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="text-xs text-red-400/60 mb-1">Sin QR</div>
          <div className="text-2xl font-bold text-red-400">{totalTicketsWithoutQR}</div>
          <div className="text-xs text-red-400/40 mt-1">{transactionsWithoutQR.length} transacciones</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Total General</div>
          <div className="text-2xl font-bold">{stats.total + totalTicketsWithoutQR}</div>
        </div>
      </div>

          {/* Breakdown by Ticket Type */}
          {ticketBreakdown.length > 0 && (
            <Card className="bg-white/[0.02] border-white/5">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-white/60" />
                  Desglose por Tipo de Entrada
                </h3>
                <div className="overflow-x-auto">
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Canal</th>
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
                          <td className="px-4 py-3 text-sm text-white/70">
                            {tx.source === 'app' ? 'App' : tx.source === 'web' ? 'Web' : 'Efectivo'}
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
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === "all"
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              Todas ({qrCodes.length})
            </button>
            <button
              onClick={() => handleTabChange("scanned")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === "scanned"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              Escaneadas ({stats.scanned})
            </button>
            <button
              onClick={() => handleTabChange("pending")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === "pending"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <Clock className="h-4 w-4" />
              Pendientes ({stats.pending})
            </button>
            <button
              onClick={() => handleTabChange("noqr")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === "noqr"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <QrCode className="h-4 w-4" />
              Sin QR ({transactionsWithoutQR.length})
            </button>
          </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Buscar por usuario, email, entrada, pedido..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        <div className="text-sm text-white/60">
          {filteredQRCodes.length} entrada{filteredQRCodes.length !== 1 ? 's' : ''} encontrada{filteredQRCodes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "noqr" ? (
        /* Transactions without QR */
        transactionsWithoutQR.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                ¡Perfecto!
              </h3>
              <p className="text-sm text-muted-foreground">
                Todas las transacciones tienen códigos QR generados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactionsWithoutQR.map((tx) => (
              <div
                key={tx.id}
                className="relative bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-lg p-4 hover:border-red-500/40 transition-all"
              >
                {/* Perforated edge effect */}
                <div className="absolute top-0 left-8 right-8 h-px bg-red-500/20"
                  style={{
                    backgroundImage: 'radial-gradient(circle, transparent 40%, currentColor 40%)',
                    backgroundSize: '8px 2px',
                    backgroundPosition: '0 0'
                  }}
                />

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
                <div className="grid grid-cols-3 gap-2 mb-3">
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

                {/* Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                  <span>{tx.source === 'app' ? 'App' : tx.source === 'web' ? 'Web' : 'Efectivo'}</span>
                  <span>{new Date(tx.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* QR Codes as Tickets */
        currentQRCodes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <QrCode className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                {searchTerm ? "No se encontraron entradas" : "No hay entradas"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Intenta con otro término de búsqueda" : "Las entradas aparecerán aquí cuando haya ventas"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentQRCodes.map((qr) => {
                const isScanned = qr.scan;
                const borderColor = isScanned ? "green-500/20" : "yellow-500/20";
                const bgGradient = isScanned
                  ? "from-green-500/10 to-green-500/5"
                  : "from-yellow-500/10 to-yellow-500/5";

                return (
                  <div
                    key={qr.id}
                    className={`relative bg-gradient-to-br ${bgGradient} border border-${borderColor} rounded-lg p-4 hover:border-opacity-60 transition-all`}
                  >
                    {/* Perforated edge effect */}
                    <div
                      className={`absolute top-0 left-8 right-8 h-px ${isScanned ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}
                      style={{
                        backgroundImage: 'radial-gradient(circle, transparent 40%, currentColor 40%)',
                        backgroundSize: '8px 2px',
                        backgroundPosition: '0 0'
                      }}
                    />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white mb-1">{qr.ticket_name}</h4>
                        <p className="text-xs text-white/60">{qr.user_name}</p>
                        <p className="text-xs text-white/40 truncate max-w-[200px]">{qr.user_email}</p>
                      </div>
                      {isScanned ? (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          Escaneado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          <Clock className="h-3 w-3" />
                          Pendiente
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-3">
                      {qr.order_id && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40">Pedido</span>
                          <span className="font-mono text-white/70">{qr.order_id}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">Compra</span>
                        <span className="text-white/70">
                          {new Date(qr.created_at).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
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
                                {new Date(qr.updated_at).toLocaleDateString('es-CO', {
                                  day: '2-digit',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-white/40">
                        {qr.source === 'app' ? 'App' : qr.source === 'web' ? 'Web' : 'Efectivo'}
                      </span>
                      <div className="flex gap-1">
                        {qr.apple && (
                          <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/60">Apple</span>
                        )}
                        {qr.google && (
                          <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/60">Google</span>
                        )}
                      </div>
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
}
