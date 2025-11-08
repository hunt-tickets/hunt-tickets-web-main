"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Download } from "lucide-react";

interface Transaction {
  id: string;
  quantity: number;
  total: number;
  status: string;
  created_at: string;
  source: string;
  tickets: {
    name: string;
    price: number;
  };
  user: {
    name: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
}

interface CompleteTransaction {
  id: string;
  created_at: string;
  user_fullname: string;
  user_email: string;
  ticket_name: string;
  quantity: number;
  price: number;
  variable_fee: number;
  tax: number;
  total: number;
  status: string;
  type: string;
  cash: boolean;
  order_id: string;
  promoter_fullname: string;
  promoter_email: string;
  // Basic Bold data - always present for all users
  bold_id: string | null;
  bold_fecha: string | null;
  bold_estado: string | null;
  bold_metodo_pago: string | null;
  // Detailed Bold financial data - only present for admins
  bold_valor_compra?: number | null;
  bold_propina?: number | null;
  bold_iva?: number | null;
  bold_impoconsumo?: number | null;
  bold_valor_total?: number | null;
  bold_rete_fuente?: number | null;
  bold_rete_iva?: number | null;
  bold_rete_ica?: number | null;
  bold_comision_porcentaje?: number | null;
  bold_comision_fija?: number | null;
  bold_total_deduccion?: number | null;
  bold_deposito_cuenta?: number | null;
  bold_banco?: string | null;
  bold_franquicia?: string | null;
  bold_pais_tarjeta?: string | null;
}

interface EventTransactionsContentProps {
  eventName: string;
  transactions: Transaction[];
  completeTransactions: CompleteTransaction[];
  isAdmin: boolean;
}

export function EventTransactionsContent({
  eventName,
  transactions,
  completeTransactions,
  isAdmin,
}: EventTransactionsContentProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadCSV = () => {
    // Generate complete CSV similar to edge function Excel
    const baseHeaders = [
      'ID Transacción',
      'Fecha y Hora',
      'Nombre Completo',
      'Correo Electrónico',
      'Tipo de Entrada',
      'Cantidad',
      'Precio Unitario',
      'Comisión Hunt',
      'Impuesto',
      'Total Transacción',
      'Estado',
      'Canal de Venta',
      'Pago en Efectivo',
      'ID de Orden',
      'Promotor',
      'Correo Promotor',
      'Bold ID',
      'Bold Fecha',
      'Bold Estado',
      'Bold Método Pago',
      'Tiene Datos Bold',
    ];

    const adminHeaders = isAdmin ? [
      'Bold Valor Compra',
      'Bold Propina',
      'Bold IVA',
      'Bold Impoconsumo',
      'Bold Valor Total',
      'Bold Retefuente',
      'Bold ReteIVA',
      'Bold ReteICA',
      'Bold Comisión %',
      'Bold Comisión Fija',
      'Bold Total Deducción',
      'Bold Depósito',
      'Bold Banco',
      'Bold Franquicia',
      'Bold País Tarjeta',
      'Diferencia Total',
    ] : [];

    const headers = [...baseHeaders, ...adminHeaders];

    const rows = completeTransactions.map(t => {
      const baseRow = [
        t.id,
        t.created_at,
        t.user_fullname || 'N/A',
        t.user_email || 'N/A',
        t.ticket_name,
        t.quantity,
        t.price,
        t.variable_fee,
        t.tax,
        t.total,
        t.status,
        t.type === 'app' ? 'App Móvil' : t.type === 'web' ? 'Sitio Web' : 'Efectivo',
        t.cash ? 'Sí' : 'No',
        t.order_id || 'N/A',
        t.promoter_fullname || 'N/A',
        t.promoter_email || 'N/A',
        t.bold_id || 'N/A',
        t.bold_fecha || 'N/A',
        t.bold_estado || 'N/A',
        t.bold_metodo_pago || 'N/A',
        t.bold_id ? 'Sí' : 'No',
      ];

      const adminRow = isAdmin ? [
        t.bold_valor_compra !== undefined && t.bold_valor_compra !== null ? t.bold_valor_compra : 'N/A',
        t.bold_propina !== undefined && t.bold_propina !== null ? t.bold_propina : 'N/A',
        t.bold_iva !== undefined && t.bold_iva !== null ? t.bold_iva : 'N/A',
        t.bold_impoconsumo !== undefined && t.bold_impoconsumo !== null ? t.bold_impoconsumo : 'N/A',
        t.bold_valor_total !== undefined && t.bold_valor_total !== null ? t.bold_valor_total : 'N/A',
        t.bold_rete_fuente !== undefined && t.bold_rete_fuente !== null ? t.bold_rete_fuente : 'N/A',
        t.bold_rete_iva !== undefined && t.bold_rete_iva !== null ? t.bold_rete_iva : 'N/A',
        t.bold_rete_ica !== undefined && t.bold_rete_ica !== null ? t.bold_rete_ica : 'N/A',
        t.bold_comision_porcentaje !== undefined && t.bold_comision_porcentaje !== null ? t.bold_comision_porcentaje : 'N/A',
        t.bold_comision_fija !== undefined && t.bold_comision_fija !== null ? t.bold_comision_fija : 'N/A',
        t.bold_total_deduccion !== undefined && t.bold_total_deduccion !== null ? t.bold_total_deduccion : 'N/A',
        t.bold_deposito_cuenta !== undefined && t.bold_deposito_cuenta !== null ? t.bold_deposito_cuenta : 'N/A',
        t.bold_banco || 'N/A',
        t.bold_franquicia || 'N/A',
        t.bold_pais_tarjeta || 'N/A',
        // Calculate difference between Hunt total and Bold total (similar to edge function)
        (t.bold_valor_total !== undefined && t.bold_valor_total !== null && t.total !== undefined && t.total !== null)
          ? (parseFloat(String(t.total)) - parseFloat(String(t.bold_valor_total))).toFixed(2)
          : 'N/A',
      ] : [];

      return [...baseRow, ...adminRow];
    });

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma, newline, or quote
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transacciones_${eventName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Transacciones del Evento</h3>
          <p className="text-sm text-muted-foreground">
            {transactions.length} transaccion{transactions.length !== 1 ? 'es' : ''} registrada{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
        >
          <Download className="h-4 w-4" />
          Descargar CSV Completo
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Total Transacciones</div>
          <div className="text-2xl font-bold">{transactions.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Por App</div>
          <div className="text-2xl font-bold">{transactions.filter(t => t.source === 'app').length}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">Por Web</div>
          <div className="text-2xl font-bold">{transactions.filter(t => t.source === 'web').length}</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-xs text-white/40 mb-1">En Efectivo</div>
          <div className="text-2xl font-bold">{transactions.filter(t => t.source === 'cash').length}</div>
        </div>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              No hay transacciones
            </h3>
            <p className="text-sm text-muted-foreground">
              Las transacciones aparecerán aquí cuando se realicen ventas
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Tipo Entrada</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Cant.</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Canal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-white/[0.02] transition-colors">
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
                      <td className="px-4 py-3 text-sm text-white/90">
                        {transaction.tickets.name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {transaction.user ? (
                          <div>
                            <div className="text-white/90">
                              {transaction.user.name} {transaction.user.lastName}
                            </div>
                            <div className="text-xs text-white/40">
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
