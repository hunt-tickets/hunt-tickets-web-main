import { ReactNode } from "react";
import ProfileTabs from "@/components/profile_layout_tabs_switch";

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-background">
      <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
          <ProfileTabs />
          {children}
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
