"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Globe, Code, Palette, Rocket, Zap, Sparkles } from "lucide-react"

interface WebsitePortfolioItem {
  id: string
  title: string
  description: string
  url: string
  screenshot: string
  tags: string[]
}

interface Service {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  color: string
}

// Páginas web desarrolladas
const websiteProjects: WebsitePortfolioItem[] = [
  {
    id: "1",
    title: "Perro Negro",
    description: "Plataforma de venta de tickets para eventos",
    url: "https://perronegro.biotickets.com/",
    screenshot: "/placeholder.svg",
    tags: ["E-commerce", "Eventos"],
  },
  {
    id: "2",
    title: "Proyecto Web 2",
    description: "Descripción del segundo proyecto",
    url: "https://ejemplo2.com",
    screenshot: "/placeholder.svg",
    tags: ["Corporativo", "Web App"],
  },
  {
    id: "3",
    title: "Proyecto Web 3",
    description: "Descripción del tercer proyecto",
    url: "https://ejemplo3.com",
    screenshot: "/placeholder.svg",
    tags: ["Landing Page", "Marketing"],
  },
]

// Servicios ofrecidos
const services: Service[] = [
  {
    id: "1",
    title: "Desarrollo Web",
    description: "Sitios y aplicaciones web de alto rendimiento con las últimas tecnologías",
    icon: <Code className="h-6 w-6" />,
    features: ["React/Next.js", "Responsive Design", "SEO Optimizado", "Performance"],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "2",
    title: "Diseño UI/UX",
    description: "Experiencias digitales intuitivas que convierten usuarios en clientes",
    icon: <Palette className="h-6 w-6" />,
    features: ["Prototipos", "Design System", "User Research", "Branding"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "3",
    title: "E-commerce",
    description: "Tiendas online que venden 24/7 con conversión optimizada",
    icon: <Rocket className="h-6 w-6" />,
    features: ["Pasarelas de pago", "Gestión de inventario", "Analytics", "Marketing"],
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "4",
    title: "Aplicaciones Web",
    description: "Soluciones personalizadas que automatizan y escalan tu negocio",
    icon: <Zap className="h-6 w-6" />,
    features: ["APIs", "Dashboards", "Automatización", "Integraciones"],
    color: "from-green-500/20 to-emerald-500/20",
  },
]

interface PortfolioWithServicesProps {
  activeTab: "portfolio" | "services"
  onTabChange: (tab: "portfolio" | "services") => void
}

export function PortfolioWithServices({ activeTab, onTabChange }: PortfolioWithServicesProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  return (
    <div className="space-y-12">
      {/* Enhanced Tabs */}
      <div className="relative">
        <div className="flex gap-4 p-1.5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-fit">
          <button
            onClick={() => onTabChange("portfolio")}
            className={`relative px-8 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${
              activeTab === "portfolio"
                ? "text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            style={{ fontFamily: 'LOT, sans-serif' }}
          >
            {activeTab === "portfolio" && (
              <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm" />
            )}
            <span className="relative z-10">Portafolio</span>
          </button>
          <button
            onClick={() => onTabChange("services")}
            className={`relative px-8 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${
              activeTab === "services"
                ? "text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            style={{ fontFamily: 'LOT, sans-serif' }}
          >
            {activeTab === "services" && (
              <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm" />
            )}
            <span className="relative z-10">Servicios</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "portfolio" ? (
          /* Portfolio Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {websiteProjects.map((project, index) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[4/3] rounded-[20px] overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 block"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Screenshot */}
                <Image
                  src={project.screenshot}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Tags */}
                <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <div
                      key={tagIndex}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1"
                    >
                      <span className="text-xs font-medium text-white/90">{tag}</span>
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-white/60" />
                    <span className="text-xs text-white/60">
                      {project.url.replace(/^https?:\/\//, '').split('/')[0]}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'LOT, sans-serif' }}>
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/80 mb-4">{project.description}</p>

                  <div className="inline-flex items-center gap-2 text-sm text-white/90 group-hover:text-white transition-colors">
                    Visitar sitio
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-primary/10" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* Enhanced Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {services.map((service, index) => (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="group relative rounded-[24px] overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-8"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with animated background */}
                  <div className="mb-6 inline-flex">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                      <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 group-hover:bg-white/15 transition-all duration-300">
                        <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                          {service.icon}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title with sparkle effect */}
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300" style={{ fontFamily: 'LOT, sans-serif' }}>
                      {service.title}
                    </h3>
                    <Sparkles className={`h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ${hoveredService === service.id ? 'rotate-12' : ''}`} />
                  </div>

                  {/* Description */}
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features with enhanced styling */}
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm text-white/80 group-hover:text-white/90 transition-colors duration-300"
                        style={{
                          animationDelay: `${featureIndex * 50}ms`,
                        }}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 group-hover:bg-primary group-hover:scale-150 transition-all duration-300" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
