"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Client-side realtime subscriptions
 * Only use for truly real-time features where server-side won't work
 */

// Hook for real-time ticket availability
export function useTicketAvailability(ticketTierId: string) {
  const [available, setAvailable] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchInitialData() {
      const { data, error } = await supabaseClient
        .from("ticket_inventory")
        .select("available_count")
        .eq("ticket_tier_id", ticketTierId)
        .single();

      if (!error && data) {
        setAvailable(data.available_count);
      }
      setLoading(false);
    }

    function setupRealtimeSubscription() {
      channel = supabaseClient
        .channel(`ticket_availability:${ticketTierId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "ticket_inventory",
            filter: `ticket_tier_id=eq.${ticketTierId}`,
          },
          (payload) => {
            if (payload.new && "available_count" in payload.new) {
              setAvailable(payload.new.available_count as number);
            }
          }
        )
        .subscribe();
    }

    fetchInitialData();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, [ticketTierId]);

  return { available, loading };
}

// Hook for chat or live comments (example of presence)
export function useLivePresence(roomId: string, userId: string) {
  const [presences, setPresences] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const channel = supabaseClient.channel(`room:${roomId}`)
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setPresences(state);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId,
            onlineAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.untrack();
      supabaseClient.removeChannel(channel);
    };
  }, [roomId, userId]);

  return presences;
}

// Optimistic updates for better UX
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const update = async (newData: T) => {
    setError(null);
    setIsUpdating(true);

    // Optimistic update
    const previousData = data;
    setData(newData);

    try {
      const result = await updateFn(newData);
      setData(result);
      return result;
    } catch (err) {
      // Rollback on error
      setData(previousData);
      setError(err as Error);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { data, update, error, isUpdating };
}