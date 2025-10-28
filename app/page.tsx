import { PopularEvents } from "@/components/popular-events";
import { Component } from "@/components/ui/gradient-bar-hero-section";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Gradient Bar Hero Section with Shader Background - Fixed position */}
      <div className="sticky top-0 h-screen w-full">
        <Component />
      </div>

      {/* Popular Events Section - Parallax effect */}
      <section className="relative z-10 py-16 sm:py-20 bg-[#101010] rounded-t-[32px] sm:rounded-t-[48px] -mt-16 sm:-mt-20">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'LOT, sans-serif' }}>Eventos Populares</h2>
          </div>

          {/* Popular Events component handles all event display logic */}
          <PopularEvents
            // Optionally pass a cityId to filter events by city
            // cityId="some-city-id"
            limit={6} // Display 6 events in the grid
          />
        </div>
      </section>
    </div>
  );
}
