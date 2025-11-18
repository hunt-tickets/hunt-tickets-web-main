import { cache } from "react";
import { createClient } from "../../server";
import type { City, EventFull } from "../../types";

/**
 * 📌 **Crea una transacción web**
 * @param data - Datos de la transacción.
 * @returns Transacción creada o un error.
 */
export const createTransactionWeb = async (data: {
  p_order: string;
  p_user_id: string;
  p_ticket_id: string;
  p_price: number;
  p_variable_fee: number;
  p_tax: number;
  p_quantity: number;
  p_total: number;
  p_seller_uid: string | null;
}) => {
  const supabase = await createClient();

  const { data: result, error } = await supabase.rpc(
    "create_transaction_web",
    data
  );

  if (error) {
    console.error("❌ Error creando la transacción:", error.message);
    throw new Error("No se pudo guardar la transacción");
  }

  return result;
};

/**
 * Obtiene todas las ciudades de la tabla `cities`
 * @returns Un array de objetos con `id` y `name` o un error
 */
export const getCities = async (): Promise<City[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("cities").select("id, name");

  if (error) {
    console.log("Error fetching cities:", error.message);
    return [];
  }

  return data as City[];
};

/**
 * Obtiene todos los eventos activos sin límite
 * @param cityId - ID de la ciudad (opcional)
 * @returns Lista de todos los eventos activos con información completa
 */
export const getAllActiveEvents = async (
  cityId?: string
): Promise<EventFull[]> => {
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select(
      `
      id,
      name,
      description,
      date,
      end_date,
      status,
      flyer,
      venue_id,
      age,
      variable_fee,
      fixed_fee,
      priority,
      venues!inner (
        id,
        name,
        address,
        latitude,
        longitude,
        city,
        cities!inner (
          id,
          name
        )
      )
    `
    )
    .eq("status", true)
    .gte("end_date", new Date().toISOString())
    .order("priority", { ascending: false })
    .order("date", { ascending: true });

  if (cityId) {
    query = query.eq("venues.city", cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching all active events:", error.message);
    return [];
  }

  const events: EventFull[] = (data || []).map(
    (event: Record<string, unknown>) => {
      // Ensure we have valid date strings with fallbacks
      const dateString = (event.date as string) || new Date().toISOString();
      const endDateString = (event.end_date as string) || dateString;

      const eventDate = new Date(dateString);
      const endDate = new Date(endDateString);

      return {
        id: event.id as string,
        name: (event.name as string) || "Evento sin nombre",
        flyer: (event.flyer as string) || "/placeholder.svg",
        date: dateString,
        hour: eventDate.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end_date: endDate.toISOString().split("T")[0],
        end_hour: endDate.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        variable_fee: event.variable_fee as number,
        age: (event.age as number) || 18,
        description: (event.description as string) || "",
        venue_id: (event.venue_id as string) || "",
        venue_name:
          ((event.venues as Record<string, unknown>)?.name as string) ||
          "Venue por confirmar",
        venue_logo: "",
        venue_latitude:
          ((event.venues as Record<string, unknown>)?.latitude as number) || 0,
        venue_longitude:
          ((event.venues as Record<string, unknown>)?.longitude as number) || 0,
        venue_address:
          ((event.venues as Record<string, unknown>)?.address as string) ||
          "Dirección por confirmar",
        venue_city:
          ((
            (event.venues as Record<string, unknown>)?.cities as Record<
              string,
              unknown
            >
          )?.name as string) || "Ciudad",
        producers: [],
        tickets: [],
      };
    }
  );

  return events;
};

/**
 * Obtiene los eventos populares (puede filtrar por ciudad si se proporciona cityId)
 * @param cityId - ID de la ciudad (opcional)
 * @param limit - Número máximo de eventos a devolver (por defecto 7)
 * @returns Lista de eventos populares con información completa
 */
export const getPopularEvents = async (
  cityId?: string,
  limit: number = 7
): Promise<EventFull[]> => {
  const supabase = await createClient();

  // Build query for popular events with venue and city information
  // Join events with venues and cities to get complete location data
  let query = supabase
    .from("events")
    .select(
      `
      id,
      name,
      description,
      date,
      end_date,
      status,
      flyer,
      venue_id,
      age,
      variable_fee,
      fixed_fee,
      priority,
      venues!inner (
        id,
        name,
        address,
        latitude,
        longitude,
        city,
        cities!inner (
          id,
          name
        )
      )
    `
    )
    // Only get active/published events
    .eq("status", true)
    // Only get events that haven't ended yet (users can buy until end_date)
    .gte("end_date", new Date().toISOString())
    // Order by priority first (if it's a featured flag), then by date
    .order("priority", { ascending: false })
    .order("date", { ascending: true })
    .limit(limit);

  // Apply city filter if provided
  if (cityId) {
    query = query.eq("venues.city", cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching popular events:", error.message);
    return [];
  }

  // Transform the data to match EventFull interface
  // Map fields from the actual database schema including venue information
  const events: EventFull[] = (data || []).map(
    (event: Record<string, unknown>) => {
      // Ensure we have valid date strings with fallbacks
      const dateString = (event.date as string) || new Date().toISOString();
      const endDateString = (event.end_date as string) || dateString;

      // Extract time from the date timestamps
      const eventDate = new Date(dateString);
      const endDate = new Date(endDateString);

      return {
        id: event.id as string,
        name: (event.name as string) || "Evento sin nombre",
        flyer: (event.flyer as string) || "/placeholder.svg",
        date: dateString,
        // Extract hour from the timestamp
        hour: eventDate.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end_date: endDate.toISOString().split("T")[0],
        end_hour: endDate.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        variable_fee: event.variable_fee as number,
        age: (event.age as number) || 18,
        description: (event.description as string) || "",
        venue_id: (event.venue_id as string) || "",
        // Use venue data from the joined tables
        venue_name:
          ((event.venues as Record<string, unknown>)?.name as string) ||
          "Venue por confirmar",
        venue_logo: "",
        venue_latitude:
          ((event.venues as Record<string, unknown>)?.latitude as number) || 0,
        venue_longitude:
          ((event.venues as Record<string, unknown>)?.longitude as number) || 0,
        venue_address:
          ((event.venues as Record<string, unknown>)?.address as string) ||
          "Dirección por confirmar",
        venue_city:
          ((
            (event.venues as Record<string, unknown>)?.cities as Record<
              string,
              unknown
            >
          )?.name as string) || "Ciudad",
        // Empty arrays until we have proper relationships
        producers: [],
        tickets: [],
      };
    }
  );

  return events;
};

// Types for better TypeScript support
export type EventFilters = {
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

// Paginated query with filters - cached at request level
export const getEvents = async (filters: EventFilters = {}) => {
  const supabase = await createClient();

  // Start building the query
  let query = supabase.from("events").select(
    `
      *,
      venue:venues(*),
      event_categories(
        category:categories(*)
      )
    `,
    { count: "exact" }
  ); // Get total count for pagination

  // Apply filters conditionally
  if (filters.category) {
    query = query.eq("event_categories.category.slug", filters.category);
  }

  if (filters.city) {
    query = query.eq("venues.city", filters.city);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("min_price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("max_price", filters.maxPrice);
  }

  if (filters.startDate) {
    query = query.gte("event_date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("event_date", filters.endDate);
  }

  if (filters.search) {
    // Full text search on indexed columns
    query = query.textSearch("fts", filters.search);
  }

  // Pagination
  const limit = filters.limit || 20;
  const offset = filters.offset || 0;
  query = query.range(offset, offset + limit - 1);

  // Order by relevance for search, date otherwise
  if (filters.search) {
    query = query.order("rank", { ascending: false });
  } else {
    query = query.order("event_date", { ascending: true });
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching events:", error);
    return { events: [], total: 0, error };
  }

  return {
    events: data || [],
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  };
};

/**
 * Fetches a single event by ID with all available details
 * @param eventId - The UUID of the event to fetch
 * @returns EventFull object or null if not found
 */
export const getEventById = async (
  eventId: string
): Promise<EventFull | null> => {
  const supabase = await createClient();

  // Fetch event data with venue information
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      name,
      description,
      date,
      end_date,
      status,
      flyer,
      venue_id,
      age,
      variable_fee,
      fixed_fee,
      priority,
      venues (
        id,
        name,
        address,
        latitude,
        longitude,
        logo,
        google_maps_link,
        google_website_url,
        google_phone_number,
        google_avg_rating,
        google_total_reviews,
        ai_description,
        cities (
          id,
          name
        )
      ),
      events_producers (
        producers (
          id,
          name,
          logo
        )
      ),
      tickets (
        id,
        name,
        price,
        description,
        status
      )
    `
    )
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Transform the data to match EventFull interface
  // Ensure we have valid date strings with fallbacks
  const dateString = data.date || new Date().toISOString();
  const endDateString = data.end_date || dateString;

  const eventDate = new Date(dateString);
  const endDate = new Date(endDateString);

  return {
    id: data.id,
    name: data.name || "Evento sin nombre",
    flyer: data.flyer || "/placeholder.svg",
    date: dateString,
    hour: eventDate.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    end_date: endDate.toISOString().split("T")[0],
    end_hour: endDate.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    age: data.age || 18,
    description: data.description || "",
    variable_fee: data.variable_fee,
    venue_id: data.venue_id || "",
    venue_name:
      (((data as Record<string, unknown>).venues as Record<string, unknown>)
        ?.name as string) || "Venue por confirmar",
    venue_logo:
      (((data as Record<string, unknown>).venues as Record<string, unknown>)
        ?.logo as string) || "",
    venue_latitude:
      (((data as Record<string, unknown>).venues as Record<string, unknown>)
        ?.latitude as number) || 0,
    venue_longitude:
      (((data as Record<string, unknown>).venues as Record<string, unknown>)
        ?.longitude as number) || 0,
    venue_address:
      (((data as Record<string, unknown>).venues as Record<string, unknown>)
        ?.address as string) || "Dirección por confirmar",
    venue_city:
      ((
        ((data as Record<string, unknown>).venues as Record<string, unknown>)
          ?.cities as Record<string, unknown>
      )?.name as string) || "Ciudad",
    venue_google_maps_link: (
      (data as Record<string, unknown>).venues as Record<string, unknown>
    )?.google_maps_link as string,
    venue_google_website_url: (
      (data as Record<string, unknown>).venues as Record<string, unknown>
    )?.google_website_url as string,
    venue_google_phone_number: (
      (data as Record<string, unknown>).venues as Record<string, unknown>
    )?.google_phone_number as string,
    venue_google_avg_rating: (
      (data as Record<string, unknown>).venues as Record<string, unknown>
    )?.google_avg_rating as string,
    venue_google_total_reviews: (
      (data as Record<string, unknown>).venues as Record<string, unknown>
    )?.google_total_reviews as string,
    venue_ai_description: (
      (data as Record<string, unknown>).venues as Record<string, unknown>
    )?.ai_description as string,
    producers: (
      ((data as Record<string, unknown>).events_producers as Array<
        Record<string, unknown>
      >) || []
    ).map((ep: Record<string, unknown>) => ({
      id: (ep.producers as Record<string, unknown>).id as string,
      name: (ep.producers as Record<string, unknown>).name as string,
      description:
        ((ep.producers as Record<string, unknown>).description as string) || "",
      email: ((ep.producers as Record<string, unknown>).email as string) || "",
      phone: ((ep.producers as Record<string, unknown>).phone as string) || "",
      logo: (ep.producers as Record<string, unknown>).logo as string,
      banner: (ep.producers as Record<string, unknown>).banner as string,
    })),
    tickets: (
      ((data as Record<string, unknown>).tickets as Array<
        Record<string, unknown>
      >) || []
    )
      .filter((ticket: Record<string, unknown>) => ticket.status === true)
      .map((ticket: Record<string, unknown>) => ({
        id: ticket.id as string,
        name: ticket.name as string,
        price: ticket.price as number,
        description: (ticket.description as string) || "",
      })),
  };
};

/**
 * Fetches all events for a specific producer
 * @param producerId - The UUID of the producer
 * @returns Array of EventFull objects
 */
export const getEventsByProducerId = async (
  producerId: string
): Promise<EventFull[]> => {
  const supabase = await createClient();

  // Fetch events through the events_producers join table
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      name,
      description,
      date,
      end_date,
      status,
      flyer,
      venue_id,
      age,
      variable_fee,
      fixed_fee,
      priority,
      venues (
        id,
        name,
        address,
        latitude,
        longitude,
        logo,
        google_maps_link,
        google_website_url,
        google_phone_number,
        google_avg_rating,
        google_total_reviews,
        ai_description,
        cities (
          id,
          name
        )
      ),
      events_producers!inner (
        producers (
          id,
          name,
          logo
        )
      ),
      tickets (
        id,
        name,
        price,
        description,
        status
      )
    `
    )
    .eq("events_producers.producer_id", producerId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching events by producer ID:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Transform the data to match EventFull interface
  return data.map((event) => {
    // Ensure we have valid date strings with fallbacks
    const dateString = event.date || new Date().toISOString();
    const endDateString = event.end_date || dateString;

    const eventDate = new Date(dateString);
    const endDate = new Date(endDateString);

    return {
      id: event.id,
      name: event.name || "Evento sin nombre",
      flyer: event.flyer || "/placeholder.svg",
      date: dateString,
      hour: eventDate.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      end_date: endDate.toISOString().split("T")[0],
      end_hour: endDate.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      age: event.age || 18,
      description: event.description || "",
      variable_fee: event.variable_fee,
      venue_id: event.venue_id || "",
      venue_name:
        (((event as Record<string, unknown>).venues as Record<string, unknown>)
          ?.name as string) || "Venue por confirmar",
      venue_logo:
        (((event as Record<string, unknown>).venues as Record<string, unknown>)
          ?.logo as string) || "",
      venue_latitude:
        (((event as Record<string, unknown>).venues as Record<string, unknown>)
          ?.latitude as number) || 0,
      venue_longitude:
        (((event as Record<string, unknown>).venues as Record<string, unknown>)
          ?.longitude as number) || 0,
      venue_address:
        (((event as Record<string, unknown>).venues as Record<string, unknown>)
          ?.address as string) || "Dirección por confirmar",
      venue_city:
        ((
          ((event as Record<string, unknown>).venues as Record<string, unknown>)
            ?.cities as Record<string, unknown>
        )?.name as string) || "Ciudad",
      venue_google_maps_link: (
        (event as Record<string, unknown>).venues as Record<string, unknown>
      )?.google_maps_link as string,
      venue_google_website_url: (
        (event as Record<string, unknown>).venues as Record<string, unknown>
      )?.google_website_url as string,
      venue_google_phone_number: (
        (event as Record<string, unknown>).venues as Record<string, unknown>
      )?.google_phone_number as string,
      venue_google_avg_rating: (
        (event as Record<string, unknown>).venues as Record<string, unknown>
      )?.google_avg_rating as string,
      venue_google_total_reviews: (
        (event as Record<string, unknown>).venues as Record<string, unknown>
      )?.google_total_reviews as string,
      venue_ai_description: (
        (event as Record<string, unknown>).venues as Record<string, unknown>
      )?.ai_description as string,
      producers: (
        ((event as Record<string, unknown>).events_producers as Array<
          Record<string, unknown>
        >) || []
      ).map((ep: Record<string, unknown>) => ({
        id: (ep.producers as Record<string, unknown>).id as string,
        name: (ep.producers as Record<string, unknown>).name as string,
        description:
          ((ep.producers as Record<string, unknown>).description as string) ||
          "",
        email: ((ep.producers as Record<string, unknown>).email as string) || "",
        phone: ((ep.producers as Record<string, unknown>).phone as string) || "",
        logo: (ep.producers as Record<string, unknown>).logo as string,
        banner: (ep.producers as Record<string, unknown>).banner as string,
      })),
      tickets: (
        ((event as Record<string, unknown>).tickets as Array<
          Record<string, unknown>
        >) || []
      )
        .filter((ticket: Record<string, unknown>) => ticket.status === true)
        .map((ticket: Record<string, unknown>) => ({
          id: ticket.id as string,
          name: ticket.name as string,
          price: ticket.price as number,
          description: (ticket.description as string) || "",
        })),
    };
  });
};

// Batch check ticket availability
export const checkTicketAvailability = cache(
  async (ticketTierIds: string[]) => {
    if (ticketTierIds.length === 0) return {};

    const supabase = await createClient();

    // Single query to check all availabilities
    const { data, error } = await supabase
      .from("ticket_inventory")
      .select("ticket_tier_id, available_count")
      .in("ticket_tier_id", ticketTierIds)
      .gte("available_count", 1);

    if (error) {
      console.error("Error checking availability:", error);
      return {};
    }

    // Convert to map for O(1) lookups
    return data.reduce((acc, item) => {
      acc[item.ticket_tier_id] = item.available_count > 0;
      return acc;
    }, {} as Record<string, boolean>);
  }
);

/**
 * Type for events returned from get_all_events_ordered RPC function
 */
export type EventSummary = {
  id: string;
  date: string; // Formatted date like "01 ENE"
  name: string;
  flyer: string;
  status: "ACTIVO" | "FINALIZADO" | "BORRADOR" | "INACTIVO";
  url: string;
};

/**
 * Fetches all events for the current user using the database RPC function.
 * Returns only essential event data (id, name, flyer, date, status, url).
 * This is much more efficient than getEventsByProducerId for listing events.
 *
 * Authorization is handled by the database function:
 * - Admins see all events
 * - Producers see only their events
 *
 * @returns Array of EventSummary objects ordered by end_date DESC
 */
export const getAllEventsOrdered = async (): Promise<EventSummary[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_all_events_ordered");

  if (error) {
    console.error("Error fetching events from RPC:", error.message);
    return [];
  }

  // The RPC returns JSONB array
  return (data || []) as EventSummary[];
};

/**
 * Fetches comprehensive financial report for an event
 * Uses React cache() to deduplicate requests within a single render
 *
 * Returns detailed breakdown including:
 * - Sales by channel (app, web, cash)
 * - Ticket counts
 * - Bold payment processing costs (gateway + POS terminals)
 * - Revenue splits and tax calculations
 * - Settlement amounts
 * - Chart data for visualizations
 *
 * @param eventId - UUID of the event
 * @returns EventFinancialReport or null if error
 */
export const getEventFinancialReport = cache(async (eventId: string) => {
  const supabase = await createClient();

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

  return data;
});
