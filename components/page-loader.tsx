"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const LETTERS = ["H", "U", "N", "T"]
const LETTER_DURATION = 600 // Duration each letter is shown (ms)

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)

  useEffect(() => {
    // Check if this is the first visit or if we should show the loader
    const hasVisited = sessionStorage.getItem("hasVisited")

    if (hasVisited) {
      // If already visited in this session, don't show loader
      setIsLoading(false)
      return
    }

    // Cycle through letters H → U → N → T
    const letterInterval = setInterval(() => {
      setCurrentLetterIndex((prev) => (prev + 1) % LETTERS.length)
    }, LETTER_DURATION)

    // Total duration: 4 cycles through all letters (2.4s per cycle)
    const totalDuration = LETTER_DURATION * LETTERS.length * 2 // ~4.8 seconds

    // Start exit animation
    const timer = setTimeout(() => {
      setIsAnimatingOut(true)
      // Mark as visited
      sessionStorage.setItem("hasVisited", "true")

      // Remove loader after animation completes
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }, totalDuration)

    return () => {
      clearInterval(letterInterval)
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
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

      {/* Morphing Letters */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative w-[clamp(8rem,30vw,20rem)] h-[clamp(8rem,30vw,20rem)] flex items-center justify-center">
          {LETTERS.map((letter, index) => (
            <div
              key={letter}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
                index === currentLetterIndex
                  ? "opacity-100 scale-100 blur-0"
                  : "opacity-0 scale-90 blur-sm"
              )}
            >
              <span
                className="text-[clamp(6rem,25vw,16rem)] font-black text-white leading-none"
                style={{ fontFamily: "LOT, sans-serif" }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional: Loading dots indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === currentLetterIndex
                ? "bg-white scale-125"
                : "bg-white/30 scale-100"
            )}
          />
        ))}
      </div>
    </div>
  )
}
