"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User } from "lucide-react";
import { LogoutButton } from "./logout-button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButton() {
  // State to track the current user
  const [user, setUser] = useState<SupabaseUser | null>(null);
  // Loading state while checking auth
  const [loading, setLoading] = useState(true);
  // State to control dropdown open/close
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Get initials from email
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // Show nothing while loading to prevent layout shift
  if (loading) {
    return <div className="h-9 w-24" />; // Placeholder with approximate size
  }

  return user ? (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.email as string)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Mi cuenta</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-all duration-200 hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground dark:focus:bg-accent dark:focus:text-accent-foreground"
            onClick={() => setOpen(false)}
          >
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex gap-3">
      <Button asChild variant={"ghost"} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-xs sm:text-sm font-medium bg-background/50 hover:bg-background/70 text-foreground border border-border backdrop-blur-sm">
        <Link href="/login">Ingresar</Link>
      </Button>
      <Button asChild variant={"ghost"} className="px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-xs sm:text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href="/sign-up">Registrarse</Link>
      </Button>
    </div>
  );
}
