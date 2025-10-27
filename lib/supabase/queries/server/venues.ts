import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

/**
 * Fetches all venues ordered by name
 * Uses React cache() to deduplicate requests within a single render
 * Returns venues with id and name for dropdown usage
 */
export const getVenues = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("venues")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching venues:", error);
    return [];
  }

  return data || [];
});
