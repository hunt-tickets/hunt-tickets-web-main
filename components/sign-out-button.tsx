"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SignOutButtonProps {
  children: ReactNode;
}

export function SignOutButton({ children }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();

    // Sign out from Supabase
    await supabase.auth.signOut();

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
