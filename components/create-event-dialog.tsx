"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createEvent, type EventFormState } from "@/lib/actions/events";
import { CreateEventSubmitButton } from "@/components/create-event-submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-glow-button";

interface VenueOption {
  id: string;
  name: string;
}

interface CreateEventDialogProps {
  className?: string;
  eventVenues?: VenueOption[];
}

const initialState: EventFormState = {
  message: undefined,
  errors: {},
  success: false,
};

interface StatusSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

function StatusSelect({
  label,
  name,
  value,
  onChange,
  required,
}: StatusSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs sm:text-sm">
        {label} {required && "*"}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger className="w-full h-9 sm:h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" side="bottom" align="start">
          <SelectItem value="Activo">Activo</SelectItem>
          <SelectItem value="Inactivo">Inactivo</SelectItem>
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

export function CreateEventDialog({
  className,
  eventVenues = [],
}: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createEvent, initialState);

  // Form field states for controlled selects and dates
  const [venueId, setVenueId] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("Inactivo");
  const [cashSales, setCashSales] = useState("Inactivo");
  const [priority, setPriority] = useState("Inactivo");
  const [lists, setLists] = useState("Inactivo");
  const [courtesies, setCourtesies] = useState("Inactivo");
  const [guestList, setGuestList] = useState("Inactivo");

  // Close dialog on success
  useEffect(() => {
    if (state.success) {
      // Reset form
      setVenueId("");
      setAge("");
      setStatus("Inactivo");
      setCashSales("Inactivo");
      setPriority("Inactivo");
      setLists("Inactivo");
      setCourtesies("Inactivo");
      setGuestList("Inactivo");
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <HoverButton
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap text-sm font-medium bg-primary text-primary-foreground ${className}`}
        glowColor="#000000"
        backgroundColor="transparent"
        textColor="inherit"
        hoverTextColor="inherit"
      >
        <Plus className="h-4 w-4" />
        Crear Evento
      </HoverButton>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[75vh] sm:max-h-[85vh] overflow-y-auto overflow-x-hidden p-5 sm:p-6">
        <DialogHeader className="space-y-1.5 pb-3">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Crear Evento
          </DialogTitle>
          {/* <DialogDescription className="text-xs sm:text-sm text-muted-foreground"></DialogDescription> */}
        </DialogHeader>

        <form
          action={formAction}
          className="space-y-4 sm:space-y-6 w-full overflow-x-hidden"
        >
          {/* Error message */}
          {state.message && !state.success && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {state.message && state.success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                {state.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Información Básica */}
          <div className="space-y-3 sm:space-y-4 pb-4 border-b">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Información Básica
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">
                Nombre del Evento *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ej: Fiesta de Año Nuevo"
                required
                className="h-9 sm:h-10 w-full"
              />
              {state.errors?.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">
                Descripción *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe el evento..."
                className="min-h-[100px] resize-none w-full"
                required
              />
              {state.errors?.description && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.description[0]}
                </p>
              )}
            </div>
          </div>

          {/* Fechas y Horarios - Using native date inputs instead of Calendar component */}
          <div className="space-y-3 sm:space-y-4 pb-4 border-b">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Fechas y Horarios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-xs sm:text-sm">
                  Fecha de Inicio *
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                  className="h-9 sm:h-10 w-full"
                />
                {state.errors?.start_date && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {state.errors.start_date[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_time" className="text-xs sm:text-sm">
                  Hora de Inicio *
                </Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="time"
                  required
                  className="h-9 sm:h-10 w-full"
                />
                {state.errors?.start_time && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {state.errors.start_time[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-xs sm:text-sm">
                  Fecha de Finalización *
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  required
                  className="h-9 sm:h-10 w-full"
                />
                {state.errors?.end_date && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {state.errors.end_date[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time" className="text-xs sm:text-sm">
                  Hora de Finalización *
                </Label>
                <Input
                  id="end_time"
                  name="end_time"
                  type="time"
                  required
                  className="h-9 sm:h-10 w-full"
                />
                {state.errors?.end_time && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {state.errors.end_time[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación y Detalles */}
          <div className="space-y-3 sm:space-y-4 pb-4 border-b">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Ubicación y Detalles
            </h3>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Venue *</Label>
              <Select value={venueId} onValueChange={setVenueId} required>
                <SelectTrigger className="w-full h-9 sm:h-10">
                  <SelectValue placeholder="Seleccione un venue" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  className="max-h-[200px]"
                >
                  {eventVenues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="venue_id" value={venueId} />
              {state.errors?.venue_id && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.venue_id[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Edad Mínima *</Label>
                <Select value={age} onValueChange={setAge} required>
                  <SelectTrigger className="w-full h-9 sm:h-10">
                    <SelectValue placeholder="Seleccione edad" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" align="start">
                    <SelectItem value="0">0+</SelectItem>
                    <SelectItem value="12">12+</SelectItem>
                    <SelectItem value="15">15+</SelectItem>
                    <SelectItem value="18">18+</SelectItem>
                    <SelectItem value="21">21+</SelectItem>
                    <SelectItem value="25">25+</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="age" value={age} />
                {state.errors?.age && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {state.errors.age[0]}
                  </p>
                )}
              </div>

              <StatusSelect
                label="Estado"
                name="status"
                value={status}
                onChange={setStatus}
                required
              />
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-3 sm:space-y-4 pb-4 border-b">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Imágenes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="flyer" className="text-xs sm:text-sm">
                  Flyer del Evento
                </Label>
                <Input
                  id="flyer"
                  name="flyer"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="h-9 sm:h-10 cursor-pointer w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Imagen principal del evento (Máx. 5MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-xs sm:text-sm">
                  Imagen para Wallet
                </Label>
                <Input
                  id="wallet"
                  name="wallet"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="h-9 sm:h-10 cursor-pointer w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Para Apple/Google Wallet (Máx. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Configuración de Ventas - Using StatusSelect helper component */}
          <div className="space-y-3 sm:space-y-4 pb-4 border-b">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Configuración de Ventas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <StatusSelect
                label="Venta en Efectivo"
                name="cash_sales"
                value={cashSales}
                onChange={setCashSales}
              />

              <StatusSelect
                label="Prioridad"
                name="priority"
                value={priority}
                onChange={setPriority}
              />

              <StatusSelect
                label="Listas"
                name="lists"
                value={lists}
                onChange={setLists}
              />

              <StatusSelect
                label="Cortesías"
                name="courtesies"
                value={courtesies}
                onChange={setCourtesies}
              />
            </div>
          </div>

          {/* Guest List */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Guest List
            </h3>

            <StatusSelect
              label="Habilitar Guest List"
              name="guest_list"
              value={guestList}
              onChange={setGuestList}
            />

            <div className="space-y-2">
              <Label
                htmlFor="guest_list_quantity"
                className="text-xs sm:text-sm"
              >
                Cantidad Máxima
              </Label>
              <Input
                id="guest_list_quantity"
                name="guest_list_quantity"
                type="number"
                placeholder="Ej: 100"
                min="0"
                className="h-9 sm:h-10 w-full"
              />
              {state.errors?.guest_list_quantity && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.guest_list_quantity[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="guest_list_max_date"
                  className="text-xs sm:text-sm"
                >
                  Fecha Límite
                </Label>
                <Input
                  id="guest_list_max_date"
                  name="guest_list_max_date"
                  type="date"
                  className="h-9 sm:h-10 w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Fecha límite para guest list
                </p>
                {state.errors?.guest_list_max_date && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {state.errors.guest_list_max_date[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="guest_list_max_time"
                  className="text-xs sm:text-sm"
                >
                  Hora Límite
                </Label>
                <Input
                  id="guest_list_max_time"
                  name="guest_list_max_time"
                  type="time"
                  className="h-9 sm:h-10 w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Hora límite para guest list
                </p>
                {state.errors?.guest_list_max_time && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {state.errors.guest_list_max_time[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest_list_info" className="text-xs sm:text-sm">
                Información Adicional
              </Label>
              <Textarea
                id="guest_list_info"
                name="guest_list_info"
                placeholder="Información adicional sobre el guest list..."
                className="min-h-[80px] resize-none w-full"
              />
              {state.errors?.guest_list_info && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.guest_list_info[0]}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto h-9 sm:h-10"
            >
              Cancelar
            </Button>
            <CreateEventSubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
