"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SignOutButtonProps {
  children: ReactNode;
}

export function SignOutButton({ children }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabaseClient.auth.signOut();

    // Refresh the router cache to update server components
    router.refresh();

    // Navigate to home page
    router.push("/");
  };

  return (
    <div onClick={handleSignOut} className="cursor-pointer">
      {children}
    </div>
  );
}
