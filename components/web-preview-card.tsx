"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

interface WebPreviewCardProps {
  url: string
  title?: string
}

export function WebPreviewCard({ url, title = "Ver más eventos" }: WebPreviewCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="group relative aspect-[3/4] rounded-[20px] overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white/60">Cargando...</span>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={url}
        className="absolute inset-0 w-full h-full"
        onLoad={() => setIsLoaded(true)}
        title={title}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading="lazy"
      />

      {/* Overlay with title and link */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-2" style={{ fontFamily: 'LOT, sans-serif' }}>
            {title}
          </h3>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-white transition-colors pointer-events-auto"
          >
            Abrir en nueva pestaña
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
