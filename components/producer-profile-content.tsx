"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, LayoutDashboard, Settings, Mail, Shield, MoreVertical, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTeamMemberDialog } from "@/components/add-team-member-dialog";

interface Producer {
  id: string;
  name: string | null;
  logo: string | null;
  created_at: string;
}

interface TeamMember {
  id: string;
  rol: string | null;
  profile: {
    id: string;
    name: string | null;
    lastName: string | null;
    email: string | null;
  };
}

interface ProducerProfileContentProps {
  producer: Producer;
  team: TeamMember[];
  userId: string;
}

type TabType = "dashboard" | "equipo" | "configuracion";

export function ProducerProfileContent({ producer, team, userId }: ProducerProfileContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const displayName = producer.name || "Sin nombre";

  // Temporary fake data for team
  const fakeTeam: TeamMember[] = [
    {
      id: "1",
      rol: "Dueño",
      profile: {
        id: "1",
        name: "Juan",
        lastName: "Pérez",
        email: "juan.perez@example.com",
      },
    },
    {
      id: "2",
      rol: "Administrador",
      profile: {
        id: "2",
        name: "María",
        lastName: "González",
        email: "maria.gonzalez@example.com",
      },
    },
    {
      id: "3",
      rol: "Analista",
      profile: {
        id: "3",
        name: "Carlos",
        lastName: "Rodríguez",
        email: "carlos.rodriguez@example.com",
      },
    },
    {
      id: "4",
      rol: "Vendedor",
      profile: {
        id: "4",
        name: "Ana",
        lastName: "Martínez",
        email: "ana.martinez@example.com",
      },
    },
  ];

  // Use fake team if real team is empty
  const displayTeam = team.length > 0 ? team : fakeTeam;

  const tabs = [
    { value: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { value: "equipo", icon: Users, label: "Equipo" },
    { value: "configuracion", icon: Settings, label: "Configuración" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header with producer info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Producer Logo */}
          <div className="flex-shrink-0">
            {producer.logo ? (
              <img
                src={producer.logo}
                alt={displayName}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-white/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>

          {/* Producer Name and Breadcrumb */}
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Link href={`/profile/${userId}/administrador/marcas`} className="hover:text-white transition-colors">
                Marcas
              </Link>
              <span>/</span>
              <span className="text-white">{displayName}</span>
            </div>
            <h1 className="text-xl font-bold sm:text-2xl">{displayName}</h1>
            <p className="text-xs text-muted-foreground">Productor</p>
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-white/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Mobile Tabs */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-white/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "dashboard" && (
          <Card className="bg-white/[0.02] border-white/5 p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LayoutDashboard className="h-12 w-12 text-white/40 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Dashboard</h3>
              <p className="text-sm text-white/60 max-w-md">
                Aquí verás las estadísticas y métricas del productor
              </p>
            </div>
          </Card>
        )}

        {activeTab === "equipo" && (
          <div className="space-y-4">
            {/* Add Member Button */}
            <div className="flex justify-end">
              <AddTeamMemberDialog producerId={producer.id} />
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50">Total Miembros</p>
                      <p className="text-2xl font-bold text-white">
                        {displayTeam.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50">Administradores</p>
                      <p className="text-2xl font-bold text-white">
                        {displayTeam.filter(m => m.rol === "Administrador").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50">Analistas</p>
                      <p className="text-2xl font-bold text-white">
                        {displayTeam.filter(m => m.rol === "Analista").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50">Vendedores</p>
                      <p className="text-2xl font-bold text-white">
                        {displayTeam.filter(m => m.rol === "Vendedor").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Table */}
            <Card className="bg-white/[0.02] border-white/5">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-white/5">
                      <TableHead className="font-medium text-white/50 py-3 pl-6 text-xs uppercase tracking-wider">
                        Miembro
                      </TableHead>
                      <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider">
                        Contacto
                      </TableHead>
                      <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider">
                        Rol
                      </TableHead>
                      <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider text-center pr-6">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayTeam.map((member) => {
                      const fullName = `${member.profile.name || ""} ${member.profile.lastName || ""}`.trim() || "Sin nombre";
                      const email = member.profile.email || "Sin correo";
                      const role = member.rol || "Sin rol";

                      const initials = fullName
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <TableRow
                          key={member.id}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-all duration-200 group"
                        >
                          {/* Miembro */}
                          <TableCell className="py-5 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0 font-semibold text-sm text-white/90 ring-1 ring-white/10">
                                {initials}
                              </div>
                              <div className="flex flex-col min-w-0 gap-0.5">
                                <span className="font-medium text-white truncate">{fullName}</span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Contacto */}
                          <TableCell className="py-5">
                            {email !== "Sin correo" ? (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-white/40" />
                                <span className="text-sm text-white/70">{email}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-white/30">Sin correo</span>
                            )}
                          </TableCell>

                          {/* Rol */}
                          <TableCell className="py-5">
                            {role === "Dueño" ? (
                              <Badge
                                variant="default"
                                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 shadow-sm"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Dueño
                              </Badge>
                            ) : role === "Administrador" ? (
                              <Badge
                                variant="default"
                                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-200 shadow-sm"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Administrador
                              </Badge>
                            ) : role === "Analista" ? (
                              <Badge
                                variant="default"
                                className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 border border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-200 shadow-sm"
                              >
                                Analista
                              </Badge>
                            ) : role === "Vendedor" ? (
                              <Badge
                                variant="default"
                                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-200 shadow-sm"
                              >
                                Vendedor
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-white/10 text-white/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200"
                              >
                                {role}
                              </Badge>
                            )}
                          </TableCell>

                          {/* Acciones */}
                          <TableCell className="text-center py-5 pr-6">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-white/[0.05]"
                                  >
                                    <MoreVertical className="h-4 w-4 text-white/60" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="center"
                                  className="w-48 bg-[#1a1a1a] border-white/10 shadow-xl rounded-xl p-2"
                                >
                                  <DropdownMenuItem
                                    className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-white/[0.08] focus:bg-white/[0.08] transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Edit className="h-4 w-4 text-white/60" />
                                      <span className="text-sm font-medium text-white">Cambiar Rol</span>
                                    </div>
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator className="my-2 bg-white/5" />

                                  <DropdownMenuItem
                                    className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Trash2 className="h-4 w-4 text-red-400" />
                                      <span className="text-sm font-medium text-red-400 group-hover:text-red-300">Eliminar</span>
                                    </div>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "configuracion" && (
          <Card className="bg-white/[0.02] border-white/5 p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-white/40 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Configuración</h3>
              <p className="text-sm text-white/60 max-w-md">
                Configura los ajustes del productor
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
