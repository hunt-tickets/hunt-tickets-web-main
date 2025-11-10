import { Portfolio } from "@/components/portfolio";
import { Component } from "@/components/ui/gradient-bar-hero-section";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Gradient Bar Hero Section with Shader Background - Fixed position */}
      <div className="fixed top-0 left-0 right-0 h-screen w-full z-0">
        <Component />
      </div>

      {/* Spacer for hero height */}
      <div className="h-screen" />

      {/* Portfolio Section */}
      <section className="relative z-10 py-16 sm:py-20 bg-[#101010] rounded-t-[32px] sm:rounded-t-[48px] -mt-16 sm:-mt-20">
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'LOT, sans-serif' }}>Portafolio</h2>
            <p className="text-white/70 mt-2">Algunos de nuestros proyectos más destacados</p>
          </div>

          {/* Portfolio component */}
          <Portfolio />
        </div>
      </section>
    </div>
  );
}
