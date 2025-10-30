"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCircle, ChevronLeft, ChevronRight, Shield, Phone, Mail, FileText, Calendar, Cake } from "lucide-react";
import { EditUserSheet } from "@/components/edit-user-sheet";

// Calculate age from birthdate
function calculateAge(birthdate: string): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

interface User {
  id: string;
  name: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  birthdate: string | null;
  gender: string | null;
  prefix: string | null;
  document_id: string | null;
  admin: boolean;
  created_at: string;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Calculate pagination
  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = users.slice(startIndex, endIndex);

  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-white/5">
              <TableHead className="font-medium text-white/50 py-3 text-xs uppercase tracking-wider">Usuario</TableHead>
              <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider">Contacto</TableHead>
              <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider">Edad</TableHead>
              <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider">Documento</TableHead>
              <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider">Rol</TableHead>
              <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider">Registro</TableHead>
              <TableHead className="font-medium text-white/50 text-xs uppercase tracking-wider text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {currentUsers.map((user) => {
                const fullName = [user.name, user.lastName]
                  .filter(Boolean)
                  .join(' ') || 'Sin nombre';

                // Prefix is for phone, not document
                const phoneNumber = user.phone
                  ? user.prefix
                    ? `${user.prefix} ${user.phone}`
                    : user.phone
                  : null;

                const initials = fullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <TableRow
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-all duration-200 group"
                  >
                    {/* Usuario */}
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0 font-semibold text-sm text-white/90 ring-1 ring-white/10">
                          {initials}
                        </div>
                        <div className="flex flex-col min-w-0 gap-0.5">
                          <span className="font-medium text-white truncate">{fullName}</span>
                          {user.email && (
                            <span className="text-xs text-white/40 truncate flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Contacto */}
                    <TableCell className="py-5">
                      <div className="flex flex-col gap-1">
                        {phoneNumber ? (
                          <span className="text-sm text-white/70 flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-white/40" />
                            {phoneNumber}
                          </span>
                        ) : (
                          <span className="text-sm text-white/30">Sin teléfono</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Edad */}
                    <TableCell className="py-5">
                      {user.birthdate ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-white/70 flex items-center gap-1.5">
                            <Cake className="h-3.5 w-3.5 text-white/40" />
                            {calculateAge(user.birthdate)} años
                          </span>
                          <span className="text-xs text-white/40">
                            {new Date(user.birthdate).toLocaleDateString('es-CO', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-white/30">-</span>
                      )}
                    </TableCell>

                    {/* Documento */}
                    <TableCell className="py-5">
                      {user.document_id ? (
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-white/40" />
                          <span className="text-sm text-white/70 font-mono">{user.document_id}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-white/30">-</span>
                      )}
                    </TableCell>

                    {/* Rol */}
                    <TableCell className="py-5">
                      {user.admin ? (
                        <Badge
                          variant="default"
                          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-200 shadow-sm"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-white/10 text-white/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200"
                        >
                          Usuario
                        </Badge>
                      )}
                    </TableCell>

                    {/* Registro */}
                    <TableCell className="py-5">
                      <div className="flex items-center gap-1.5 text-sm text-white/50">
                        <Calendar className="h-3.5 w-3.5 text-white/30" />
                        {new Date(user.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right py-5">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <EditUserSheet user={user} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-sm pt-4">
          <span className="text-white/40">Mostrar</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-9 w-[70px] rounded-lg border-white/10 bg-transparent hover:bg-white/[0.02] transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-white/10">
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-white/40">
            de <span className="text-white/70 font-medium">{users.length.toLocaleString()}</span> usuarios
          </span>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 px-3 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <span className="text-sm text-white/50 px-3">
            Página <span className="text-white font-medium">{currentPage}</span> de <span className="text-white/70">{totalPages}</span>
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 px-3 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
