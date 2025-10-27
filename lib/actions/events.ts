"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { EventFinancialReport } from "@/lib/supabase/types";
import { toZonedTime } from "date-fns-tz";
import { formatISO } from "date-fns";

const eventFormSchema = z.object({
  name: z.string().min(1, "El nombre del evento es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  start_date: z.string().min(1, "La fecha de inicio es requerida"),
  start_time: z.string().min(1, "La hora de inicio es requerida"),
  end_date: z.string().min(1, "La fecha de finalización es requerida"),
  end_time: z.string().min(1, "La hora de finalización es requerida"),
  venue_id: z.string().min(1, "El venue es requerido"),
  age: z.string().min(1, "La edad mínima es requerida"),
  cash_sales: z.string().min(1, "Seleccione una opción"),
  status: z.string().min(1, "El estado es requerido"),
  priority: z.string().min(1, "Seleccione una opción"),
  lists: z.string().min(1, "Seleccione una opción"),
  courtesies: z.string().min(1, "Seleccione una opción"),
  guest_list: z.string().min(1, "Seleccione una opción"),
  guest_list_quantity: z.string().optional(),
  guest_list_info: z.string().optional(),
  guest_list_max_date: z.string().optional(),
  guest_list_max_time: z.string().optional(),
});

export type EventFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    start_date?: string[];
    start_time?: string[];
    end_date?: string[];
    end_time?: string[];
    venue_id?: string[];
    age?: string[];
    cash_sales?: string[];
    status?: string[];
    priority?: string[];
    lists?: string[];
    courtesies?: string[];
    guest_list?: string[];
    guest_list_quantity?: string[];
    guest_list_info?: string[];
    guest_list_max_date?: string[];
    guest_list_max_time?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createEvent(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "No autenticado",
      success: false,
    };
  }

  // Extract form data
  const rawFormData = {
    name: formData.get("name"),
    description: formData.get("description"),
    start_date: formData.get("start_date"),
    start_time: formData.get("start_time"),
    end_date: formData.get("end_date"),
    end_time: formData.get("end_time"),
    venue_id: formData.get("venue_id"),
    age: formData.get("age"),
    cash_sales: formData.get("cash_sales"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    lists: formData.get("lists"),
    courtesies: formData.get("courtesies"),
    guest_list: formData.get("guest_list"),
    guest_list_quantity: formData.get("guest_list_quantity") || "",
    guest_list_info: formData.get("guest_list_info") || "",
    guest_list_max_date: formData.get("guest_list_max_date") || "",
    guest_list_max_time: formData.get("guest_list_max_time") || "",
  };

  // Extract files for logging
  const flyerFile = formData.get("flyer") as File;
  const walletFile = formData.get("wallet") as File;

  console.log("📋 Raw FormData before validation:", rawFormData);
  console.log("📁 Files received:", {
    flyer: flyerFile
      ? { name: flyerFile.name, size: flyerFile.size, type: flyerFile.type }
      : null,
    wallet: walletFile
      ? { name: walletFile.name, size: walletFile.size, type: walletFile.type }
      : null,
  });

  // Validate form data
  const validatedFields = eventFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    // Format errors from issues (Zod v4 stable API)
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of validatedFields.error.issues) {
      const fieldName = issue.path[0] as string;
      if (fieldName) {
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(issue.message);
      }
    }

    console.log("✅ Validation result:", {
      success: false,
      errors: fieldErrors,
    });

    return {
      errors: fieldErrors as EventFormState["errors"],
      message: "Campos inválidos. Por favor revise el formulario.",
      success: false,
    };
  }

  console.log("✅ Validation result:", {
    success: true,
    errors: null,
  });

  const { data: validData } = validatedFields;
  console.log(validData);

  try {
    // Convert dates from Bogota timezone to UTC (matching mobile app behavior)
    const BOGOTA_TZ = "America/Bogota";

    const startDateTimeBogota = toZonedTime(
      `${validData.start_date}T${validData.start_time}`,
      BOGOTA_TZ
    );
    const startDateTime = formatISO(startDateTimeBogota);

    const endDateTimeBogota = toZonedTime(
      `${validData.end_date}T${validData.end_time}`,
      BOGOTA_TZ
    );
    const endDateTime = formatISO(endDateTimeBogota);

    // Parse guest list max hour if provided
    let guestListMaxHour = null;
    if (validData.guest_list_max_date && validData.guest_list_max_time) {
      const guestListMaxBogota = toZonedTime(
        `${validData.guest_list_max_date}T${validData.guest_list_max_time}`,
        BOGOTA_TZ
      );
      guestListMaxHour = formatISO(guestListMaxBogota);
    }

    // File upload validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    // Validate flyer file
    if (flyerFile && flyerFile.size > 0) {
      if (flyerFile.size > MAX_FILE_SIZE) {
        return {
          message: "La imagen del flyer es muy grande. Máximo 5MB.",
          success: false,
        };
      }
      if (!ALLOWED_TYPES.includes(flyerFile.type)) {
        return {
          message:
            "Formato de imagen no válido para flyer. Use JPG, PNG o WebP.",
          success: false,
        };
      }
    }

    // Validate wallet file
    if (walletFile && walletFile.size > 0) {
      if (walletFile.size > MAX_FILE_SIZE) {
        return {
          message: "La imagen de wallet es muy grande. Máximo 5MB.",
          success: false,
        };
      }
      if (!ALLOWED_TYPES.includes(walletFile.type)) {
        return {
          message:
            "Formato de imagen no válido para wallet. Use JPG, PNG o WebP.",
          success: false,
        };
      }
    }

    // Create event in database
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert({
        name: validData.name,
        description: validData.description,
        date: startDateTime,
        end_date: endDateTime,
        venue_id: validData.venue_id,
        age: parseInt(validData.age),
        status: validData.status === "Activo",
        priority: validData.priority === "Activo",
        cash: validData.cash_sales === "Activo",
        private_list: validData.lists === "Activo",
        access_pass: validData.courtesies === "Activo",
        guest_list: validData.guest_list === "Activo",
        guest_list_quantity: validData.guest_list_quantity
          ? parseInt(validData.guest_list_quantity)
          : 0,
        guest_list_info: validData.guest_list_info || null,
        guest_list_max_hour: guestListMaxHour,
        variable_fee: 0.1,
        fixed_fee: 0,
      })
      .select()
      .single();

    if (eventError) {
      console.error("Error creating event:", eventError);
      return {
        message: "Error al crear el evento. Por favor intente nuevamente.",
        success: false,
      };
    }

    let flyerUrl = null;
    let walletUrl = null;

    // Upload flyer if provided (using event ID from created event)
    if (flyerFile && flyerFile.size > 0) {
      const flyerExt = flyerFile.name.split(".").pop();
      const flyerPath = `flyers/${eventData.id}.${flyerExt}`;

      const { error: flyerError } = await supabase.storage
        .from("events")
        .upload(flyerPath, flyerFile);

      if (flyerError) {
        console.error("Error uploading flyer:", flyerError);
        return {
          message: `Error al subir la imagen del flyer: ${flyerError.message}`,
          success: false,
        };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("events").getPublicUrl(flyerPath);
      flyerUrl = publicUrl;
    }

    // Upload wallet image if provided (to variants folder)
    if (walletFile && walletFile.size > 0) {
      const walletExt = walletFile.name.split(".").pop();
      const walletPath = `variants/${eventData.id}.${walletExt}`;

      const { error: walletError } = await supabase.storage
        .from("events")
        .upload(walletPath, walletFile);

      if (walletError) {
        console.error("Error uploading wallet:", walletError);
        return {
          message: `Error al subir la imagen de wallet: ${walletError.message}`,
          success: false,
        };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("events").getPublicUrl(walletPath);
      walletUrl = publicUrl;
    }

    // Update event with image URLs if uploaded
    if (flyerUrl || walletUrl) {
      const updateData: { flyer?: string; flyer_apple?: string } = {};
      if (flyerUrl) updateData.flyer = flyerUrl;
      if (walletUrl) updateData.flyer_apple = walletUrl;

      const { error: updateError } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", eventData.id);

      if (updateError) {
        console.error("Error updating event with image URLs:", updateError);
        // Don't fail the whole operation, images are uploaded successfully
      }
    }

    // Get user's producer ID to link event
    const { data: profile } = await supabase
      .from("profiles")
      .select("producers_admin(producer_id)")
      .eq("id", user.id)
      .single();

    // Link event to producer if user is a producer
    if (profile?.producers_admin && profile.producers_admin.length > 0) {
      const producerId = profile.producers_admin[0].producer_id;

      await supabase.from("events_producers").insert({
        event_id: eventData.id,
        producer_id: producerId,
      });
    }

    // Revalidate the administrador page to show the new event
    revalidatePath(`/profile/${user.id}/administrador`);

    return {
      message: "Evento creado exitosamente",
      success: true,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      message: "Error inesperado al crear el evento",
      success: false,
    };
  }
}

/**
 * Fetches full financial report for a specific event (includes all arrays)
 * Use getEventFinancialSummary() instead if you don't need transaction details
 * @param eventId - The UUID of the event
 * @returns EventFinancialReport or null if error
 */
export async function getEventFinancialReport(
  eventId: string
): Promise<EventFinancialReport | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc(
      "get_event_sales_summary_with_validation",
      {
        p_event_id: eventId,
      }
    );

    if (error) {
      console.error("Error fetching financial report:", error);
      return null;
    }

    return data as EventFinancialReport;
  } catch (error) {
    console.error("Unexpected error fetching financial report:", error);
    return null;
  }
}
