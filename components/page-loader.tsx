"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    // Check if this is the first visit or if we should show the loader
    const hasVisited = sessionStorage.getItem("hasVisited")

    if (hasVisited) {
      // If already visited in this session, don't show loader
      setIsLoading(false)
      return
    }

    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setIsAnimatingOut(true)
      // Mark as visited
      sessionStorage.setItem("hasVisited", "true")

      // Remove loader after animation completes
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }, 2000) // Show for at least 2 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-800",
        isAnimatingOut && "opacity-0 scale-110"
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      {/* Loader Content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo with Animation */}
        <div className="relative">
          <h1
            className={cn(
              "text-6xl sm:text-8xl font-bold tracking-tight transition-all duration-1000",
              isAnimatingOut ? "scale-150 opacity-0" : "scale-100 opacity-100"
            )}
            style={{ fontFamily: 'LOT, sans-serif' }}
          >
            HUNT
          </h1>

          {/* Animated underline */}
          <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent">
            <div className="h-full w-full bg-gradient-to-r from-primary to-primary/50 animate-shimmer" />
          </div>
        </div>

        {/* Loading Dots */}
        <div className={cn(
          "flex gap-2 transition-all duration-500",
          isAnimatingOut && "opacity-0 translate-y-4"
        )}>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>

        {/* Loading Text */}
        <p className={cn(
          "text-sm text-muted-foreground animate-pulse transition-all duration-500",
          isAnimatingOut && "opacity-0"
        )}>
          Preparando tu experiencia...
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}
