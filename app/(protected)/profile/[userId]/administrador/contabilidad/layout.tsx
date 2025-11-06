import React, { ReactNode } from "react";
import { AccountingSidebar } from "@/components/accounting-sidebar";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

interface AccountingLayoutProps {
  children: ReactNode;
  params: Promise<{
    userId: string;
  }>;
}

const AccountingLayout = async ({ children, params }: AccountingLayoutProps) => {
  const { userId } = await params;
  const supabase = await createClient();

  // Auth check
  if (!userId) {
    redirect("/login");
  }

  // Get user profile to verify admin access
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, admin")
    .eq("id", userId)
    .single();

  if (!profile?.admin) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Accounting Sidebar */}
      <AccountingSidebar userId={userId} />

      {/* Main Content - with left margin to accommodate fixed sidebar */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AccountingLayout;
