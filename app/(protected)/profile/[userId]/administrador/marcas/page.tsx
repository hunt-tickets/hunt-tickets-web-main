import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllProducers, getAllArtists, getAllVenues } from "@/lib/supabase/actions/tickets";
import { MarcasTabs } from "@/components/marcas-tabs";

interface MarcasPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function MarcasPage({ params }: MarcasPageProps) {
  const { userId } = await params;
  const supabase = await createClient();

  // Auth check
  if (!userId) {
    redirect("/login");
  }

  // Get user profile to verify admin/producer access
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, admin, producers_admin(producer_id)")
    .eq("id", userId)
    .single();

  const producersAdmin = Array.isArray(profile?.producers_admin)
    ? profile.producers_admin
    : profile?.producers_admin
    ? [profile.producers_admin]
    : [];
  const isProducer = producersAdmin.length > 0;

  if (!profile?.admin && !isProducer) {
    notFound();
  }

  // Fetch all producers, artists, and venues
  const [producers, artists, venues] = await Promise.all([
    getAllProducers(),
    getAllArtists(),
    getAllVenues(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Marcas</h1>
          <p className="text-xs text-muted-foreground">
            Gestión de productores, artistas, venues y patrocinadores
          </p>
        </div>
      </div>

      {/* Marcas Tabs */}
      <MarcasTabs
        producers={producers || []}
        artists={artists || []}
        venues={venues || []}
        userId={userId}
      />
    </div>
  );
}
