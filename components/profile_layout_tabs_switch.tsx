"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Ticket, HelpCircle, Settings } from "lucide-react";

const ProfileTabs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // Hide tabs if in administrador section
  const isAdministrador = pathname.includes("/administrador");

  // Determine current tab from pathname
  const getCurrentTab = () => {
    if (pathname.includes("/tickets")) return "tickets";
    if (pathname.includes("/soporte")) return "soporte";
    if (pathname.includes("/ajustes")) return "ajustes";

    return "general";
  };

  const currentTab = getCurrentTab();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const handleTabChange = (value: string) => {
    if (!userId) return;

    if (value === "general") {
      router.push("/profile");
    } else {
      router.push(`/profile/${userId}/${value}`);
    }
  };

  if (!userId || isAdministrador) {
    return null;
  }

  const tabs = [
    { value: "general", icon: User, label: "General" },
    { value: "tickets", icon: Ticket, label: "Entradas" },
    { value: "soporte", icon: HelpCircle, label: "Soporte" },
    { value: "ajustes", icon: Settings, label: "Ajustes" },
  ];

  return (
    <>
      {/* Desktop: Full width tabs */}
      <div className="hidden md:flex w-full gap-2 p-1 bg-background/50 backdrop-blur-sm rounded-full border border-[#303030]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full
                text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-background/80'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Mobile: Fixed bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 w-full h-16 bg-background/95 backdrop-blur-md border-t border-[#303030] z-50 grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`
                flex flex-col items-center justify-center gap-1
                transition-all duration-300
                ${
                  isActive
                    ? 'text-primary'
                    : 'text-foreground/70'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ProfileTabs;
