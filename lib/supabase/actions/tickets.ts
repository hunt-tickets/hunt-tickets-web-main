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