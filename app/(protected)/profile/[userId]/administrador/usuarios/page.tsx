import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllUsers } from "@/lib/supabase/actions/profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle, Users, Shield } from "lucide-react";
import { UsersTable } from "@/components/users-table";

interface UsuariosPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UsuariosPage = async ({ params }: UsuariosPageProps) => {
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

  // Get all users
  const { users, error } = await getAllUsers();

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
            USUARIOS
          </h1>
          <p className="text-[#404040] mt-1 text-sm sm:text-base">
            Listado completo de usuarios del sistema
          </p>
        </div>
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardContent className="py-12 text-center">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminCount = users?.filter(u => u.admin).length || 0;
  const totalUsers = users?.length || 0;
  const usersWithPhone = users?.filter(u => u.phone).length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
          USUARIOS
        </h1>
        <p className="text-[#404040] mt-1 text-sm sm:text-base">
          Listado completo de usuarios del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-[#404040] mt-1">Usuarios registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-[#404040] mt-1">Con permisos admin</p>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-[#303030]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Perfiles Completos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWithPhone}</div>
            <p className="text-xs text-[#404040] mt-1">Con teléfono registrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Listado de Usuarios</h2>
        </div>

        {users && users.length > 0 ? (
          <UsersTable users={users} />
        ) : (
          <div className="text-center py-24 rounded-xl bg-white/[0.02] border border-white/5">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm text-white/40">No hay usuarios registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;
