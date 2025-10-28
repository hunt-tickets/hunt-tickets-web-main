"use client"

import { Scene } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, Shield, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Alcance Masivo",
    description: "Conecta con miles de usuarios en toda Latinoamérica.",
  },
  {
    icon: BarChart3,
    title: "Análisis Real",
    description: "Métricas detalladas de ventas y comportamiento.",
  },
  {
    icon: Shield,
    title: "Pagos Seguros",
    description: "Transacciones protegidas y liquidaciones rápidas.",
  },
  {
    icon: Zap,
    title: "Gestión Simple",
    description: "Herramientas intuitivas para tus eventos.",
  },
];

const ProductorHero = () => {
  return (
    <div className="min-h-svh w-screen bg-gradient-to-br from-[#000] to-[#1A2428] text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl space-y-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary" className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-full">
            ✨ Plataforma para Productores
          </Badge>

          <div className="space-y-6 flex items-center justify-center flex-col ">
            <h1 className="text-3xl md:text-6xl font-semibold tracking-tight max-w-3xl" style={{ fontFamily: 'LOT, sans-serif' }}>
              Impulsa tus eventos
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl">
              La plataforma líder para productores de eventos en Latinoamérica.
              Gestiona, promociona y maximiza el éxito de tus eventos con nuestras herramientas especializadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button asChild className="text-sm px-8 py-3 rounded-xl bg-white text-black border border-white/10 shadow-none hover:bg-white/90 transition-none">
                <Link href="https://wa.me/573228597640" target="_blank" rel="noopener noreferrer">
                  Convertirme en Productor
                </Link>
              </Button>
              <Button asChild className="text-sm px-8 py-3 rounded-xl bg-transparent text-white border border-white/20 shadow-none hover:bg-white/10 transition-none">
                <Link href="/eventos">Ver Eventos</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3"
            >
              <feature.icon size={18} className="text-white/80 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base font-medium">{feature.title}</h3>
              <p className="text-xs md:text-sm text-neutral-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Desde 5%
            </div>
            <p className="text-neutral-400 text-xs">Comisión competitiva</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
              48h
            </div>
            <p className="text-neutral-400 text-xs">Tiempo de liquidación</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
              24/7
            </div>
            <p className="text-neutral-400 text-xs">Soporte disponible</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
              +150%
            </div>
            <p className="text-neutral-400 text-xs">Crecimiento promedio</p>
          </div>
        </div>
      </div>
      <div className='absolute inset-0'>
        <Scene />
      </div>
    </div>
  );
};

export { ProductorHero };
