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
import { UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { EditUserSheet } from "@/components/edit-user-sheet";

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
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border border-[#303030] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-[#303030]">
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Teléfono</TableHead>
                <TableHead className="font-semibold">Documento</TableHead>
                <TableHead className="font-semibold">Rol</TableHead>
                <TableHead className="font-semibold">Fecha Registro</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => {
                const fullName = [user.name, user.lastName]
                  .filter(Boolean)
                  .join(' ') || 'Sin nombre';

                const documentId = user.prefix && user.document_id
                  ? `${user.prefix}-${user.document_id}`
                  : user.document_id || '-';

                return (
                  <TableRow key={user.id} className="border-[#303030] hover:bg-white/5">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <UserCircle className="h-4 w-4" />
                        </div>
                        <span className="truncate">{fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#606060]">
                      {user.email || '-'}
                    </TableCell>
                    <TableCell className="text-[#606060]">
                      {user.phone || '-'}
                    </TableCell>
                    <TableCell className="text-[#606060]">
                      {documentId}
                    </TableCell>
                    <TableCell>
                      {user.admin ? (
                        <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#303030] text-[#606060]">
                          Usuario
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-[#606060]">
                      {new Date(user.created_at).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <EditUserSheet user={user} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-sm text-[#606060]">
          <span>Mostrar</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-9 w-[70px] rounded-lg border-[#303030] bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
          <span>
            de {users.length} usuarios
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 rounded-lg border-[#303030] hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            <span className="text-sm text-[#606060]">
              Página {currentPage} de {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 rounded-lg border-[#303030] hover:bg-white/5"
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
