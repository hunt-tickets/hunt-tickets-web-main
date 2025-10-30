import React, { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";

interface AdministradorLayoutProps {
  children: ReactNode;
  params: Promise<{
    userId: string;
  }>;
}

const AdministradorLayout = async ({ children, params }: AdministradorLayoutProps) => {
  const { userId } = await params;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar userId={userId} />

      {/* Main Content - with left margin to accommodate fixed sidebar */}
      <main className="lg:ml-64 min-h-screen">
        <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 pt-20 lg:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdministradorLayout;
