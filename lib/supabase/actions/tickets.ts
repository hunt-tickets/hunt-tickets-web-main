"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Server actions for secure operations
 * All sensitive operations should be server actions
 */

export async function createTicketPurchase(
  ticketTierId: string,
  quantity: number,
  paymentMethodId: string
) {
  const supabase = await createClient();

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  // Start a transaction using Supabase's RPC
  const { data, error } = await supabase.rpc("purchase_tickets", {
    p_user_id: user.id,
    p_ticket_tier_id: ticketTierId,
    p_quantity: quantity,
    p_payment_method_id: paymentMethodId,
  });

  if (error) {
    console.error("Purchase error:", error);

    // Handle specific errors
    if (error.message.includes("insufficient_tickets")) {
      throw new Error("Not enough tickets available");
    }
    if (error.message.includes("payment_failed")) {
      throw new Error("Payment processing failed");
    }

    throw new Error("Purchase failed. Please try again.");
  }

  // Revalidate relevant paths
  revalidatePath("/tickets");
  revalidatePath(`/events/${data.event_id}`);

  return data;
}

export async function cancelTicketOrder(orderId: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  // Verify user owns this order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, event:events(event_date)")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    throw new Error("Order not found");
  }

  // Check if cancellation is allowed (e.g., 24 hours before event)
  const eventDate = new Date(order.event.event_date);
  const now = new Date();
  const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilEvent < 24) {
    throw new Error("Cannot cancel within 24 hours of event");
  }

  // Process cancellation via RPC for atomicity
  const { data, error } = await supabase.rpc("cancel_order", {
    p_order_id: orderId,
    p_user_id: user.id,
  });

  if (error) {
    throw new Error("Cancellation failed");
  }

  revalidatePath("/tickets");
  revalidatePath("/profile");

  return data;
}

export async function transferTicket(
  ticketId: string,
  recipientEmail: string
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  // Verify ticket ownership and transfer eligibility
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("*, ticket_tier:ticket_tiers(transfer_allowed)")
    .eq("id", ticketId)
    .eq("owner_id", user.id)
    .single();

  if (ticketError || !ticket) {
    throw new Error("Ticket not found");
  }

  if (!ticket.ticket_tier.transfer_allowed) {
    throw new Error("This ticket type cannot be transferred");
  }

  // Find recipient user
  const { data: recipientData } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", recipientEmail)
    .single();

  if (!recipientData) {
    throw new Error("Recipient not found");
  }

  // Process transfer
  const { error: transferError } = await supabase.rpc("transfer_ticket", {
    p_ticket_id: ticketId,
    p_from_user_id: user.id,
    p_to_user_id: recipientData.id,
  });

  if (transferError) {
    throw new Error("Transfer failed");
  }

  revalidatePath("/tickets");

  return { success: true };
}

export async function getEventTickets(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      ticket_type:tickets_types(id, name)
    `)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    return null;
  }

  return data;
}

export async function getAllEventTransactions(eventId: string) {
  const supabase = await createClient();

  // Helper function to fetch all transactions with pagination
  async function fetchAllTransactions(tableName: string, source: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allData: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          id,
          quantity,
          total,
          status,
          created_at,
          ticket_id,
          user_id,
          tickets!inner(
            event_id,
            name,
            price
          ),
          user:profiles!user_id(
            name,
            lastName,
            email
          )
        `)
        .eq("tickets.event_id", eventId)
        .eq("status", "PAID WITH QR")
        .order("created_at", { ascending: false })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error(`❌ Error fetching ${tableName}:`, error);
        break;
      }

      console.log(`✅ ${tableName} - Fetched ${data?.length || 0} records (from ${from} to ${from + batchSize - 1})`);

      if (data && data.length > 0) {
        allData = [...allData, ...data.map(t => ({ ...t, source }))];
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }

    return allData;
  }

  // Get all transactions from all sources
  console.log(`🔍 Fetching transactions for event: ${eventId}`);
  const [appTransactions, webTransactions, cashTransactions] = await Promise.all([
    fetchAllTransactions("transactions", "app"),
    fetchAllTransactions("transactions_web", "web"),
    fetchAllTransactions("transactions_cash", "cash"),
  ]);

  console.log(`📊 Transaction Summary:`);
  console.log(`   App: ${appTransactions.length} transactions`);
  console.log(`   Web: ${webTransactions.length} transactions`);
  console.log(`   Cash: ${cashTransactions.length} transactions`);

  // Combine and sort all transactions by date
  const allTransactions = [
    ...appTransactions,
    ...webTransactions,
    ...cashTransactions,
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  console.log(`   Total: ${allTransactions.length} transactions`);

  return allTransactions;
}

export async function getCompleteEventTransactions(eventId: string) {
  const supabase = await createClient();

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('admin').eq('id', user.id).single();
    isAdmin = profile?.admin === true;
  }

  // Helper function to fetch all transactions with complete data
  async function fetchCompleteTransactions(tableName: string, source: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allData: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    // Build select query based on table
    let selectQuery = '';
    if (tableName === 'transactions') {
      selectQuery = 'id, created_at, ticket_id, quantity, price, variable_fee, tax, total, status, order_id, user_id, tracker';
    } else if (tableName === 'transactions_web') {
      selectQuery = 'id, created_at, ticket_id, quantity, price, variable_fee, tax, total, status, order_id, user_id, promoter_id, order';
    } else {
      // transactions_cash
      selectQuery = 'id, created_at, ticket_id, quantity, price, variable_fee, tax, total, status, order_id, user_id, promoter_id';
    }

    while (hasMore) {
      const { data, error } = await supabase
        .from(tableName)
        .select(selectQuery)
        .eq('status', 'PAID WITH QR')
        .order('created_at', { ascending: false })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        break;
      }

      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allData = [...allData, ...(data as any[]).map(t => ({ ...t, source }))];
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }

    return allData;
  }

  // Get tickets
  const { data: tickets } = await supabase
    .from('tickets')
    .select('id, name')
    .eq('event_id', eventId);

  if (!tickets || tickets.length === 0) {
    return [];
  }

  const ticketIds = tickets.map(t => t.id);
  const ticketMap: Record<string, string> = {};
  tickets.forEach(t => {
    ticketMap[t.id] = t.name;
  });

  // Get all transactions in parallel
  const [appTxs, webTxs, cashTxs] = await Promise.all([
    fetchCompleteTransactions('transactions', 'app'),
    fetchCompleteTransactions('transactions_web', 'web'),
    fetchCompleteTransactions('transactions_cash', 'cash'),
  ]);

  // Filter by event tickets
  const allTxs = [
    ...appTxs.filter(t => ticketIds.includes(t.ticket_id)),
    ...webTxs.filter(t => ticketIds.includes(t.ticket_id)),
    ...cashTxs.filter(t => ticketIds.includes(t.ticket_id)),
  ];

  // Get unique user IDs and promoter IDs
  const userIds = new Set<string>();
  const promoterIds = new Set<string>();
  allTxs.forEach(tx => {
    if (tx.user_id) userIds.add(tx.user_id);
    if (tx.promoter_id) promoterIds.add(tx.promoter_id);
  });

  const allUserIds = [...userIds, ...promoterIds];

  console.log(`📋 Total unique user IDs: ${allUserIds.length}`);

  // Get profiles with pagination to handle large datasets
  const profileMap: Record<string, { name: string | null; lastName: string | null; email: string | null }> = {};

  if (allUserIds.length > 0) {
    // Process in chunks of 1000
    const chunkSize = 1000;
    for (let i = 0; i < allUserIds.length; i += chunkSize) {
      const chunk = allUserIds.slice(i, i + chunkSize);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, "lastName", email')
        .in('id', chunk);

      if (profilesError) {
        console.error(`Error fetching profiles chunk ${i / chunkSize + 1}:`, profilesError);
      } else {
        console.log(`✅ Fetched ${profiles?.length || 0} profiles in chunk ${i / chunkSize + 1}`);
        profiles?.forEach(p => {
          profileMap[p.id] = p;
        });
      }
    }
  }

  console.log(`📊 Total profiles loaded: ${Object.keys(profileMap).length}`);

  // Get Bold data if admin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boldDataMap: Record<string, any> = {};
  if (isAdmin) {
    const boldReferences = new Set<string>();
    appTxs.forEach(tx => {
      if (tx.tracker) boldReferences.add(tx.tracker);
    });
    webTxs.forEach(tx => {
      if (tx.order) boldReferences.add(tx.order);
    });

    if (boldReferences.size > 0) {
      const { data: boldData } = await supabase
        .from('bold_transactions')
        .select('*')
        .in('referencia', Array.from(boldReferences));

      boldData?.forEach(bold => {
        boldDataMap[bold.referencia] = bold;
      });
    }
  }

  // Format transactions
  const formattedTransactions = allTxs.map((tx, index) => {
    const userProfile = tx.user_id && profileMap[tx.user_id] ? profileMap[tx.user_id] : null;
    const promoterProfile = tx.promoter_id && profileMap[tx.promoter_id] ? profileMap[tx.promoter_id] : null;
    const ticketName = ticketMap[tx.ticket_id] || '';
    const reference = tx.source === 'app' ? tx.tracker : tx.source === 'web' ? tx.order : null;
    const bold = isAdmin && reference ? boldDataMap[reference] : null;

    // Log first 3 transactions to debug
    if (index < 3) {
      console.log(`🔍 Transaction ${index + 1}:`, {
        user_id: tx.user_id,
        has_profile: !!userProfile,
        profile: userProfile,
        promoter_id: tx.promoter_id,
        has_promoter: !!promoterProfile,
      });
    }

    const formatName = (name: string | null, lastName: string | null) => {
      if (!name && !lastName) return '';
      const fullName = `${name || ''} ${lastName || ''}`.trim();
      const words = fullName.split(/\s+/).filter(word => word.length > 0);
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    return {
      id: tx.id,
      created_at: tx.created_at,
      user_fullname: userProfile ? formatName(userProfile.name, userProfile.lastName) : '',
      user_email: userProfile?.email || '',
      ticket_name: ticketName,
      quantity: tx.quantity,
      price: tx.price,
      variable_fee: tx.variable_fee,
      tax: tx.tax,
      total: tx.total,
      status: tx.status,
      type: tx.source,
      cash: tx.source === 'cash',
      order_id: tx.order_id,
      promoter_fullname: promoterProfile ? formatName(promoterProfile.name, promoterProfile.lastName) : '',
      promoter_email: promoterProfile?.email || '',
      ...(isAdmin && bold ? {
        bold_id: bold.id,
        bold_fecha: bold.fecha,
        bold_estado: bold.estado_actual,
        bold_metodo_pago: bold.metodo_de_pago,
        bold_valor_compra: bold.valor_de_la_compra,
        bold_propina: bold.propina,
        bold_iva: bold.iva,
        bold_impoconsumo: bold.impoconsumo,
        bold_valor_total: bold.valor_total,
        bold_rete_fuente: bold.valor_rete_fuente,
        bold_rete_iva: bold.valor_rete_iva,
        bold_rete_ica: bold.valor_rete_ica,
        bold_comision_porcentaje: bold.comision_bold_porcentaje,
        bold_comision_fija: bold.comision_bold_fija,
        bold_total_deduccion: bold.total_deduccion,
        bold_deposito_cuenta: bold.deposito_en_cuenta_bold,
        bold_banco: bold.banco,
        bold_franquicia: bold.franquicia,
        bold_pais_tarjeta: bold.pais_tarjeta,
      } : {
        bold_id: null,
        bold_fecha: null,
        bold_estado: null,
        bold_metodo_pago: null,
      }),
    };
  });

  return formattedTransactions.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getTicketsSalesAnalytics(eventId: string) {
  const supabase = await createClient();

  // Helper function to fetch all transactions with pagination
  async function fetchAllTransactions(tableName: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allData: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error, count } = await supabase
        .from(tableName)
        .select("ticket_id, quantity, total, tickets!inner(event_id)", { count: 'exact' })
        .eq("tickets.event_id", eventId)
        .eq("status", "PAID WITH QR")
        .range(from, from + batchSize - 1);

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        break;
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }

      // Log progress
      if (count !== null) {
        console.log(`📊 ${tableName} - Fetched ${allData.length} of ${count} records`);
      }
    }

    return allData;
  }

  // Get all transactions for this event grouped by ticket
  const appTransactions = await fetchAllTransactions("transactions");
  const webTransactions = await fetchAllTransactions("transactions_web");
  const cashTransactions = await fetchAllTransactions("transactions_cash");

  // Calculate total quantities for debugging
  const appQuantityTotal = appTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const webQuantityTotal = webTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const cashQuantityTotal = cashTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);

  console.log("📊 Analytics Debug - App Transactions:", appTransactions.length, "records, Total Quantity:", appQuantityTotal);
  console.log("📊 Analytics Debug - Web Transactions:", webTransactions.length, "records, Total Quantity:", webQuantityTotal);
  console.log("📊 Analytics Debug - Cash Transactions:", cashTransactions.length, "records, Total Quantity:", cashQuantityTotal);

  // Combine all transactions
  const allTransactions = [
    ...appTransactions.map(t => ({ ...t, source: 'app' })),
    ...webTransactions.map(t => ({ ...t, source: 'web' })),
    ...cashTransactions.map(t => ({ ...t, source: 'cash' }))
  ];

  const totalQuantitySum = appQuantityTotal + webQuantityTotal + cashQuantityTotal;
  console.log("📊 Analytics Debug - All Transactions:", allTransactions.length, "records");
  console.log("📊 Analytics Debug - TOTAL TICKETS SOLD (TypeScript Method):", totalQuantitySum);
  console.log("📊 Analytics Debug - Sample Transaction:", allTransactions[0]);

  // Group by ticket_id
  const analytics: Record<string, {
    ticketId: string;
    app: { quantity: number; total: number };
    web: { quantity: number; total: number };
    cash: { quantity: number; total: number };
    total: { quantity: number; total: number };
  }> = {};

  allTransactions.forEach(transaction => {
    if (!analytics[transaction.ticket_id]) {
      analytics[transaction.ticket_id] = {
        ticketId: transaction.ticket_id,
        app: { quantity: 0, total: 0 },
        web: { quantity: 0, total: 0 },
        cash: { quantity: 0, total: 0 },
        total: { quantity: 0, total: 0 }
      };
    }

    const source = transaction.source as 'app' | 'web' | 'cash';
    analytics[transaction.ticket_id][source].quantity += transaction.quantity || 0;
    analytics[transaction.ticket_id][source].total += transaction.total || 0;
    analytics[transaction.ticket_id].total.quantity += transaction.quantity || 0;
    analytics[transaction.ticket_id].total.total += transaction.total || 0;
  });

  // Calculate final totals from analytics object to verify
  const finalTotalQuantity = Object.values(analytics).reduce((sum, ticket) => sum + ticket.total.quantity, 0);
  const finalTotalRevenue = Object.values(analytics).reduce((sum, ticket) => sum + ticket.total.total, 0);

  console.log("📊 Analytics Debug - Final Analytics Object:", analytics);
  console.log("📊 Analytics Debug - Number of Tickets with Data:", Object.keys(analytics).length);
  console.log("📊 Analytics Debug - Final Total Quantity (after grouping):", finalTotalQuantity);
  console.log("📊 Analytics Debug - Final Total Revenue:", finalTotalRevenue);
  console.log("📊 Analytics Debug - Verification: Sum matches?", finalTotalQuantity === totalQuantitySum);

  return analytics;
}

export async function getTicketTypes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tickets_types")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching ticket types:", error);
    return [];
  }

  return data || [];
}

export async function createTicket(eventId: string, ticketData: {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  capacity?: number;
  max_date?: string;
  status: boolean;
  section?: string;
  row?: string;
  seat?: string;
  palco?: string;
  hex?: string;
  family?: string;
  reference?: string;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "No autenticado" };
  }

  const { error } = await supabase
    .from("tickets")
    .insert({
      event_id: eventId,
      name: ticketData.name,
      description: ticketData.description || null,
      price: ticketData.price,
      quantity: ticketData.quantity,
      capacity: ticketData.capacity || null,
      max_date: ticketData.max_date || null,
      status: ticketData.status,
      section: ticketData.section || null,
      row: ticketData.row || null,
      seat: ticketData.seat || null,
      palco: ticketData.palco || null,
      hex: ticketData.hex || null,
      family: ticketData.family || null,
      reference: ticketData.reference || null,
    });

  if (error) {
    console.error("Error creating ticket:", error);
    return { success: false, message: "Error al crear la entrada" };
  }

  revalidatePath(`/profile/[userId]/administrador/event/${eventId}`);

  return { success: true, message: "Entrada creada exitosamente" };
}

export async function updateTicket(ticketId: string, ticketData: {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  capacity?: number;
  max_date?: string;
  status: boolean;
  section?: string;
  row?: string;
  seat?: string;
  palco?: string;
  hex?: string;
  family?: string;
  reference?: string;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "No autenticado" };
  }

  const { error } = await supabase
    .from("tickets")
    .update({
      name: ticketData.name,
      description: ticketData.description || null,
      price: ticketData.price,
      quantity: ticketData.quantity,
      capacity: ticketData.capacity || null,
      max_date: ticketData.max_date || null,
      status: ticketData.status,
      section: ticketData.section || null,
      row: ticketData.row || null,
      seat: ticketData.seat || null,
      palco: ticketData.palco || null,
      hex: ticketData.hex || null,
      family: ticketData.family || null,
      reference: ticketData.reference || null,
    })
    .eq("id", ticketId);

  if (error) {
    console.error("Error updating ticket:", error);
    return { success: false, message: "Error al actualizar la entrada" };
  }

  revalidatePath(`/profile/[userId]/administrador/event`);

  return { success: true, message: "Entrada actualizada exitosamente" };
}

export async function getEventProducers(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_producers")
    .select(`
      id,
      created_at,
      producer:producers!inner(
        id,
        name,
        logo
      )
    `)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event producers:", error);
    return null;
  }

  // Transform the data to ensure producer is an object, not an array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data?.map((item: any) => ({
    ...item,
    producer: Array.isArray(item.producer) ? item.producer[0] : item.producer
  })) || null;
}

export async function getEventArtists(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_artists")
    .select(`
      id,
      created_at,
      artist:artists!inner(
        id,
        name,
        description,
        category,
        logo
      )
    `)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event artists:", error);
    return null;
  }

  // Transform the data to ensure artist is an object, not an array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data?.map((item: any) => ({
    ...item,
    artist: Array.isArray(item.artist) ? item.artist[0] : item.artist
  })) || null;
}

export async function getAllProducers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("producers")
    .select("id, name, logo")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching all producers:", error);
    return [];
  }

  return data || [];
}

export async function getAllArtists() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artists")
    .select("id, name, description, category, logo")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching all artists:", error);
    return [];
  }

  return data || [];
}