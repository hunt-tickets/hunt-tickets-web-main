"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: string;
  quantity: number;
  total: number;
  status: string;
  created_at: string;
  source: string;
  order_id: string | null;
  tickets: {
    name: string;
    price: number;
    event: {
      id: string;
      name: string;
    };
  };
  user: {
    name: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
  qr_code: {
    id: string;
    svg: string;
  }[] | null;
}

interface AllTransactionsContentProps {
  transactions: Transaction[];
}

export function AllTransactionsContent({ transactions }: AllTransactionsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "qr-discrepancies">("all");
  const itemsPerPage = 50;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter transactions with QR discrepancies
  const qrDiscrepancyTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (t.status !== "PAID WITH QR") return false;
      const qrCount = t.qr_code?.length || 0;
      return t.quantity !== qrCount;
    });
  }, [transactions]);

  // Get base transactions based on active tab
  const baseTransactions = useMemo(() => {
    return activeTab === "qr-discrepancies" ? qrDiscrepancyTransactions : transactions;
  }, [activeTab, qrDiscrepancyTransactions, transactions]);

  // Filter transactions based on search
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return baseTransactions;

    const search = searchTerm.toLowerCase();
    return baseTransactions.filter(t =>
      t.tickets.event.name.toLowerCase().includes(search) ||
      t.tickets.name.toLowerCase().includes(search) ||
      (t.user?.name && t.user.name.toLowerCase().includes(search)) ||
      (t.user?.lastName && t.user.lastName.toLowerCase().includes(search)) ||
      (t.user?.email && t.user.email.toLowerCase().includes(search)) ||
      (t.order_id && t.order_id.toLowerCase().includes(search)) ||
      t.id.toLowerCase().includes(search)
    );
  }, [baseTransactions, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Calculate totals for current page
  const pageTotals = useMemo(() => {
    return currentTransactions.reduce((acc, t) => ({
      total: acc.total + t.total,
      quantity: acc.quantity + t.quantity,
    }), { total: 0, quantity: 0 });
  }, [currentTransactions]);

  // Reset to first page when search or tab changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: "all" | "qr-discrepancies") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => handleTabChange("all")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "all"
              ? "text-white"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          Todas las Transacciones
          {activeTab === "all" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => handleTabChange("qr-discrepancies")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === "qr-discrepancies"
              ? "text-white"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          Discrepancias de QR
          {qrDiscrepancyTransactions.length > 0 && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === "qr-discrepancies"
                ? "bg-red-500/20 text-red-400"
                : "bg-red-500/10 text-red-500/60"
            }`}>
              {qrDiscrepancyTransactions.length}
            </span>
          )}
          {activeTab === "qr-discrepancies" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Buscar por evento, entrada, cliente, pedido..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        <div className="text-sm text-white/60">
          {filteredTransactions.length} transaccion{filteredTransactions.length !== 1 ? 'es' : ''} encontrada{filteredTransactions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Total Transacciones</div>
          <div className="text-2xl font-bold">{filteredTransactions.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Por App</div>
          <div className="text-2xl font-bold">{filteredTransactions.filter(t => t.source === 'app').length}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Por Web</div>
          <div className="text-2xl font-bold">{filteredTransactions.filter(t => t.source === 'web').length}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">En Efectivo</div>
          <div className="text-2xl font-bold">{filteredTransactions.filter(t => t.source === 'cash').length}</div>
        </div>
      </div>

      {/* Transactions Table */}
      {currentTransactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              {searchTerm ? "No se encontraron transacciones" : "No hay transacciones"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "Intenta con otro término de búsqueda" : "Las transacciones aparecerán aquí cuando se realicen ventas"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Nº Pedido</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Evento</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Tipo Entrada</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Cliente</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Cant.</th>
                      {activeTab === "qr-discrepancies" && (
                        <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">QRs</th>
                      )}
                      <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Canal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentTransactions.map((transaction) => {
                      const qrCount = transaction.qr_code?.length || 0;
                      const hasDiscrepancy = activeTab === "qr-discrepancies" && transaction.quantity !== qrCount;

                      return (
                        <tr
                          key={transaction.id}
                          onClick={() => setSelectedTransaction(transaction)}
                          className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                            hasDiscrepancy ? "bg-red-500/5" : ""
                          }`}
                        >
                        <td className="px-4 py-3 text-sm">
                          <div className="text-white/90">
                            {new Date(transaction.created_at).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-white/40">
                            {new Date(transaction.created_at).toLocaleTimeString('es-CO', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-white/90 font-mono text-xs">
                            {transaction.order_id || <span className="text-white/40">N/A</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/90 max-w-[200px] truncate" title={transaction.tickets.event.name}>
                          {transaction.tickets.event.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-white/90">
                          {transaction.tickets.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transaction.user ? (
                            <div>
                              <div className="text-white/90">
                                {transaction.user.name} {transaction.user.lastName}
                              </div>
                              <div className="text-xs text-white/40 truncate max-w-[150px]" title={transaction.user.email || ''}>
                                {transaction.user.email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-white/40">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-center font-medium text-white/90">
                          {transaction.quantity}
                        </td>
                        {activeTab === "qr-discrepancies" && (
                          <td className="px-4 py-3 text-sm text-center">
                            <span className={`font-medium ${
                              qrCount < transaction.quantity
                                ? "text-red-400"
                                : qrCount > transaction.quantity
                                ? "text-yellow-400"
                                : "text-white/90"
                            }`}>
                              {qrCount}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-right font-medium text-white/90">
                          {formatCurrency(transaction.total)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.source === 'app'
                              ? 'bg-purple-500/10 text-purple-400'
                              : transaction.source === 'web'
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {transaction.source === 'app' ? 'App' : transaction.source === 'web' ? 'Web' : 'Efectivo'}
                          </span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                  {/* Totals Footer */}
                  <tfoot className="border-t-2 border-white/10 bg-white/[0.02]">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-white/90">
                        Totales de esta página
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-bold text-white/90">
                        {pageTotals.quantity}
                      </td>
                      {activeTab === "qr-discrepancies" && (
                        <td className="px-4 py-3 text-sm text-center font-bold text-white/90">
                          {currentTransactions.reduce((acc, t) => acc + (t.qr_code?.length || 0), 0)}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-right font-bold text-white/90">
                        {formatCurrency(pageTotals.total)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/60">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredTransactions.length)} de {filteredTransactions.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm px-4 py-2 rounded-lg bg-white/5">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Transaction Detail Sidebar */}
      {selectedTransaction && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setSelectedTransaction(null)}
          />

          {/* Sidebar Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[700px] bg-[#1a1a1a] border-l border-white/10 z-50 overflow-y-auto">
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Detalle de Transacción</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* QR Discrepancy Warning */}
              {(() => {
                const qrCount = selectedTransaction.qr_code?.length || 0;
                const hasDiscrepancy = selectedTransaction.status === "PAID WITH QR" && selectedTransaction.quantity !== qrCount;

                if (hasDiscrepancy) {
                  return (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1.5"></div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-red-400 mb-1">Discrepancia de Códigos QR</h3>
                          <p className="text-sm text-white/70">
                            {qrCount < selectedTransaction.quantity
                              ? `Faltan ${selectedTransaction.quantity - qrCount} código(s) QR. Se esperaban ${selectedTransaction.quantity} pero solo hay ${qrCount}.`
                              : `Hay ${qrCount - selectedTransaction.quantity} código(s) QR de más. Se esperaban ${selectedTransaction.quantity} pero hay ${qrCount}.`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* QR Code - Prominent Display */}
              {selectedTransaction.qr_code && selectedTransaction.qr_code.length > 0 && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-sm font-semibold text-white/90">
                      Código QR de Entrada {selectedTransaction.qr_code.length > 1 && `(1 de ${selectedTransaction.qr_code.length})`}
                    </h3>
                    <div
                      className="bg-white p-4 rounded-lg shadow-lg"
                      dangerouslySetInnerHTML={{ __html: selectedTransaction.qr_code[0].svg }}
                    />
                    <p className="text-xs text-white/40 font-mono">{selectedTransaction.qr_code[0].id}</p>
                    {selectedTransaction.qr_code.length > 1 && (
                      <p className="text-xs text-white/60">
                        + {selectedTransaction.qr_code.length - 1} código(s) QR más
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Summary Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-white/40 mb-1">Cantidad</div>
                  <div className="text-2xl font-bold text-white/90">{selectedTransaction.quantity}</div>
                  <div className="text-xs text-white/40 mt-1">tickets</div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-white/40 mb-1">Total Pagado</div>
                  <div className="text-2xl font-bold text-green-400">{formatCurrency(selectedTransaction.total)}</div>
                </div>
              </div>

              {/* Event & Ticket Info */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                <h3 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Evento y Entrada
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-white/40 mb-1">Evento</div>
                    <div className="text-sm font-medium text-white/90">{selectedTransaction.tickets.event.name}</div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <div className="text-xs text-white/40 mb-1">Tipo de Entrada</div>
                    <div className="text-sm font-medium text-white/90">{selectedTransaction.tickets.name}</div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <div className="text-xs text-white/40 mb-1">Precio Base por Unidad</div>
                    <div className="text-sm font-medium text-white/90">{formatCurrency(selectedTransaction.tickets.price)}</div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                <h3 className="text-sm font-semibold text-white/60 mb-3">Cliente</h3>
                {selectedTransaction.user ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-white/40 mb-1">Nombre Completo</div>
                      <div className="text-sm font-medium text-white/90">
                        {selectedTransaction.user.name} {selectedTransaction.user.lastName}
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div>
                      <div className="text-xs text-white/40 mb-1">Correo Electrónico</div>
                      <div className="text-sm font-medium text-white/90 break-all">{selectedTransaction.user.email}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/40">Sin información del cliente</p>
                )}
              </div>

              {/* Transaction Details */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                <h3 className="text-sm font-semibold text-white/60 mb-3">Detalles de Transacción</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-white/40 mb-1">Fecha</div>
                      <div className="text-sm font-medium text-white/90">
                        {new Date(selectedTransaction.created_at).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-1">Hora</div>
                      <div className="text-sm font-medium text-white/90">
                        {new Date(selectedTransaction.created_at).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-white/40 mb-1">Canal</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        selectedTransaction.source === 'app'
                          ? 'bg-purple-500/10 text-purple-400'
                          : selectedTransaction.source === 'web'
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        {selectedTransaction.source === 'app' ? 'App' : selectedTransaction.source === 'web' ? 'Web' : 'Efectivo'}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-1">Estado</div>
                      <div className="text-sm font-medium text-green-400">{selectedTransaction.status}</div>
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <div className="text-xs text-white/40 mb-1">Nº Pedido</div>
                    <div className="text-xs font-mono text-white/90">{selectedTransaction.order_id || 'N/A'}</div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <div className="text-xs text-white/40 mb-1">ID Transacción</div>
                    <div className="text-xs font-mono text-white/60 break-all">{selectedTransaction.id}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
