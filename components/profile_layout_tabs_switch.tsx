"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Ticket, HelpCircle, Settings } from "lucide-react";

const ProfileTabs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

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

  if (!userId) {
    return null;
  }

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      {/* Desktop: Full width grid tabs */}
      <TabsList className="hidden md:grid w-full grid-cols-4">
        <TabsTrigger value="general" className="gap-2">
          <User className="h-4 w-4" />
          General
        </TabsTrigger>
        <TabsTrigger value="tickets" className="gap-2">
          <Ticket className="h-4 w-4" />
          Entradas
        </TabsTrigger>
        <TabsTrigger value="soporte" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Soporte
        </TabsTrigger>
        <TabsTrigger value="ajustes" className="gap-2">
          <Settings className="h-4 w-4" />
          Ajustes
        </TabsTrigger>
      </TabsList>

      {/* Mobile: Fixed bottom navigation */}
      <TabsList className="md:hidden fixed bottom-0 left-0 right-0 w-full h-16 rounded-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 grid grid-cols-4">
        <TabsTrigger value="general" className="flex-col gap-1 h-full">
          <User className="h-5 w-5" />
          <span className="text-xs">General</span>
        </TabsTrigger>
        <TabsTrigger value="tickets" className="flex-col gap-1 h-full">
          <Ticket className="h-5 w-5" />
          <span className="text-xs">Tickets</span>
        </TabsTrigger>
        <TabsTrigger value="soporte" className="flex-col gap-1 h-full">
          <HelpCircle className="h-5 w-5" />
          <span className="text-xs">Soporte</span>
        </TabsTrigger>
        <TabsTrigger value="ajustes" className="flex-col gap-1 h-full">
          <Settings className="h-5 w-5" />
          <span className="text-xs">Ajustes</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProfileTabs;
