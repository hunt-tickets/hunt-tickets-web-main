"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import { addTeamMemberToProducer } from "@/lib/actions/producers";
import { useRouter } from "next/navigation";

interface AddTeamMemberDialogProps {
  producerId: string;
}

export function AddTeamMemberDialog({ producerId }: AddTeamMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const roles = [
    { value: "Administrador", label: "Administrador" },
    { value: "Analista", label: "Analista" },
    { value: "Vendedor", label: "Vendedor" },
  ];

  const handleSubmit = async () => {
    if (!email) {
      setError("Por favor ingresa un correo electrónico");
      return;
    }

    if (!rol) {
      setError("Por favor selecciona un rol");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await addTeamMemberToProducer(producerId, email, rol);

      if (result.success) {
        setOpen(false);
        setEmail("");
        setRol("");
        router.refresh();
      } else {
        setError(result.message || "Error al agregar el miembro");
      }
    } catch {
      setError("Error inesperado al agregar el miembro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="rounded-full bg-white/90 hover:bg-white border border-white/80 text-black transition-all duration-300"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Miembro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] rounded-2xl bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">Agregar Miembro al Equipo</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Ingresa el correo electrónico del usuario y selecciona su rol en el equipo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Email Input */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Role Select */}
          <div className="space-y-3">
            <Label htmlFor="rol" className="text-sm font-medium">
              Rol
            </Label>
            <Select value={rol} onValueChange={setRol}>
              <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 focus:border-primary/50">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-background border-white/10">
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value} className="rounded-lg">
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setEmail("");
              setRol("");
              setError(null);
            }}
            className="flex-1 rounded-xl h-11 border-white/10 hover:bg-white/5"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
