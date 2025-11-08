"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { GLSLHills } from "@/components/ui/glsl-hills"

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const words = ["YOUR", "TU", "THE", "LA"]

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
      }, 1000)
    }, 2500) // Show for at least 2.5 seconds

    return () => clearTimeout(timer)
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (isAnimatingOut) return

    const currentWord = words[currentWordIndex]

    if (isTyping) {
      if (displayedText.length < currentWord.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1))
        }, 100)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setIsTyping(false)
        }, 800)
        return () => clearTimeout(timer)
      }
    } else {
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 50)
        return () => clearTimeout(timer)
      } else {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
        setIsTyping(true)
      }
    }
  }, [displayedText, isTyping, currentWordIndex, isAnimatingOut, words])

  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-1000",
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
            "text-[clamp(3rem,12vw,8rem)] font-black tracking-tight transition-all duration-1000 mb-4",
            isAnimatingOut ? "scale-110 opacity-0 blur-md" : "scale-100 opacity-100 blur-0"
          )}
          style={{ fontFamily: "LOT, sans-serif" }}
        >
          <span className="text-foreground">
            HUNT{" "}
            <span className="inline-flex items-baseline min-w-[2ch]">
              <span className="text-primary">{displayedText}</span>
              <span className="text-primary animate-pulse">|</span>
            </span>
          </span>
        </h1>

        {/* Loading indicator */}
        <div
          className={cn(
            "flex items-center gap-1.5 transition-all duration-500",
            isAnimatingOut && "opacity-0 translate-y-4"
          )}
        >
          <div
            className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-pulse"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-pulse"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </div>
    </div>
  )
}
