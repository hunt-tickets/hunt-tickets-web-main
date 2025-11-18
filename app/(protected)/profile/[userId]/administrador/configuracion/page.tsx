import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConfiguracionTabs } from "@/components/configuracion-tabs";

interface ConfiguracionPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const ConfiguracionPage = async ({ params }: ConfiguracionPageProps) => {
  const { userId } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    redirect("/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("admin")
    .eq("id", user.id)
    .single();

  if (!profile?.admin) {
    notFound();
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">CONFIGURACIÓN</h1>
        <p className="text-xs text-muted-foreground">
          Administra la configuración del sistema
        </p>
      </div>

      {/* Configuration Tabs */}
      <ConfiguracionTabs />
    </div>
  );
};

export default ConfiguracionPage;