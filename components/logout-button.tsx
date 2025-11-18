"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    // Sign out from Supabase
    await supabaseClient.auth.signOut();

    // Refresh the router cache to update server components
    // This ensures the AuthButton re-renders with the logged-out state
    router.refresh();

    // Navigate to home page
    router.push("/");
  };

  return (
    <button
      onClick={logout}
      className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-all duration-200 hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground dark:focus:bg-accent dark:focus:text-accent-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Cerrar sesión
    </button>
  );
}
