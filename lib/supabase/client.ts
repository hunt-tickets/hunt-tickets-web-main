import { createBrowserClient } from "@supabase/ssr";

/**
 * Global singleton Supabase client for browser usage.
 * This is initialized once and reused across all client components
 * to reduce unnecessary connections and improve performance.
 */
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
);
