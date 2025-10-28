import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Search, UserPlus } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-glow-button";

interface PerfilesPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const PerfilesPage = async ({ params }: PerfilesPageProps) => {
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

  // Get all profiles for admin
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
          ADMINISTRAR PERFILES
        </h1>
        <p className="text-[#404040] mt-1 text-sm sm:text-base">
          Gestiona usuarios y permisos del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles?.length || 0}</div>
            <p className="text-xs text-[#404040] mt-1">Usuarios registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles?.filter(p => p.admin).length || 0}
            </div>
            <p className="text-xs text-[#404040] mt-1">Con permisos admin</p>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Productores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles?.filter(p => p.producer).length || 0}
            </div>
            <p className="text-xs text-[#404040] mt-1">Pueden crear eventos</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Usuarios del Sistema</CardTitle>
            <HoverButton
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground"
              glowColor="#000000"
              backgroundColor="transparent"
              textColor="inherit"
              hoverTextColor="inherit"
            >
              <UserPlus className="h-4 w-4" />
              Invitar Usuario
            </HoverButton>
          </div>
        </CardHeader>
        <CardContent>
          {profiles && profiles.length > 0 ? (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[#303030] hover:bg-background/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {profile.first_name} {profile.last_name}
                      </p>
                      <p className="text-sm text-[#404040]">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.admin && (
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        Admin
                      </span>
                    )}
                    {profile.producer && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-600">
                        Productor
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hay usuarios registrados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilesPage;