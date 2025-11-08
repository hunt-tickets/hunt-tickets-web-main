"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { GLSLHills } from "@/components/ui/glsl-hills"

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check if this is the first visit or if we should show the loader
    const hasVisited = sessionStorage.getItem("hasVisited")

    if (hasVisited) {
      // If already visited in this session, don't show loader
      setIsLoading(false)
      return
    }

    // Progress counter - increment to 100% over 4 seconds
    const duration = 4000 // 4 seconds
    const increment = 100 / (duration / 16) // 60fps (16ms per frame)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return next
      })
    }, 16)

    // Start exit animation when progress reaches 100%
    const timer = setTimeout(() => {
      setIsAnimatingOut(true)
      // Mark as visited
      sessionStorage.setItem("hasVisited", "true")

      // Remove loader after animation completes
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-800",
        isAnimatingOut && "opacity-0"
      )}
    >
      {/* Shader Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <GLSLHills speed={0.3} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
      </div>

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <h1
          className={cn(
            "text-[clamp(4rem,20vw,12rem)] font-black tracking-tight transition-all duration-800 tabular-nums",
            isAnimatingOut ? "scale-110 opacity-0 blur-lg" : "scale-100 opacity-100 blur-0"
          )}
          style={{ fontFamily: "LOT, sans-serif" }}
        >
          <span className="text-foreground">
            {Math.floor(progress)}
            <span className="text-primary">%</span>
          </span>
        </h1>
      </div>
    </div>
  )
}
