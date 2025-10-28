"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header and footer for auth routes
  const isAuthRoute = pathname?.startsWith("/login") ||
                      pathname?.startsWith("/sign-up") ||
                      pathname?.startsWith("/forgot-password") ||
                      pathname?.startsWith("/update-password") ||
                      pathname?.startsWith("/confirm") ||
                      pathname?.startsWith("/error") ||
                      pathname?.startsWith("/sign-up-success");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
