"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Client-side mutations for user interactions
 * These should be minimal and mostly call server actions
 */

// Purchase ticket - calls server action for security
export async function purchaseTicket(
  ticketTierId: string,
  quantity: number,
  paymentMethodId: string
) {
  // This should actually call a server action
  const response = await fetch("/api/purchase-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticketTierId,
      quantity,
      paymentMethodId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Purchase failed");
  }

  return response.json();
}

// Update user preferences (non-sensitive)
export async function updateUserPreferences(preferences: Record<string, unknown>) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({
      user_id: user.id,
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Add to favorites (can be client-side for UX)
export async function toggleFavorite(eventId: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;
    return false; // Not favorited anymore
  } else {
    // Add favorite
    const { error } = await supabase
      .from("user_favorites")
      .insert({
        user_id: user.id,
        event_id: eventId,
      });

    if (error) throw error;
    return true; // Now favorited
  }
}

// Upload user avatar with optimization
export async function uploadAvatar(file: File) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Validate file
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large (max 5MB)");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("user-uploads")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(filePath);

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    // Clean up uploaded file
    await supabase.storage.from("user-uploads").remove([filePath]);
    throw updateError;
  }

  return publicUrl;
}