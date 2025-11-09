"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  link?: string
  category: string
}

// Datos de ejemplo para el portafolio
const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Festival Música & Arte",
    description: "Diseño y producción de experiencias inmersivas",
    image: "/placeholder.svg",
    category: "Eventos",
  },
  {
    id: "2",
    title: "Concierto Arena",
    description: "Gestión integral de eventos masivos",
    image: "/placeholder.svg",
    category: "Conciertos",
  },
  {
    id: "3",
    title: "Conferencia Tech",
    description: "Organización de eventos corporativos",
    image: "/placeholder.svg",
    category: "Corporativo",
  },
]

export function Portfolio() {
  return (
    <div className="space-y-8">
      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[4/3] rounded-[20px] overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
          >
            {/* Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <span className="text-xs font-medium text-white/90">{item.category}</span>
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'LOT, sans-serif' }}>
                {item.title}
              </h3>
              <p className="text-sm text-white/80 mb-4">{item.description}</p>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                >
                  Ver proyecto
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-primary/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
