"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProfileTabs from "@/components/profile_layout_tabs_switch";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Don't apply profile layout wrapper for admin routes
  if (pathname?.includes("/administrador")) {
    return <>{children}</>;
  }

  return (
    <div className="bg-background">
      <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-24 pb-6 sm:pb-8">
        <div className="space-y-6">
          <ProfileTabs />
          {children}
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
