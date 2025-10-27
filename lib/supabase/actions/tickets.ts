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