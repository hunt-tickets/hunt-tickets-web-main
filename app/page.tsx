import { PopularEvents } from "@/components/popular-events";
import { Component } from "@/components/ui/gradient-bar-hero-section";
import AnimatedBackground from "@/components/ui/animated-background";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* New Gradient Bar Hero Section */}
      <Component />

      {/* Popular Events Section - Fetches real data from Supabase */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-black via-gray-900/50 to-black overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Popular Events component handles all event display logic */}
          <PopularEvents
            // Optionally pass a cityId to filter events by city
            // cityId="some-city-id"
            limit={6} // Display 6 events in the grid (plus 1 featured)
          />
        </div>
      </section>
    </div>
  );
}
