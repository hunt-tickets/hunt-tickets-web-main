"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          "flex w-16 h-8 p-1 rounded-full",
          "bg-zinc-950 border border-zinc-800",
          className
        )}
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div
      className={cn(
        "relative flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark
          ? "bg-zinc-950 border border-zinc-800"
          : "bg-white border border-zinc-200",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setTheme(isDark ? "light" : "dark")
        }
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Background icons - always visible */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <div className="flex justify-center items-center w-6 h-6">
          <Moon
            className={cn(
              "w-4 h-4 transition-colors duration-300",
              isDark ? "text-white" : "text-gray-400"
            )}
            strokeWidth={1.5}
          />
        </div>
        <div className="flex justify-center items-center w-6 h-6">
          <Sun
            className={cn(
              "w-4 h-4 transition-colors duration-300",
              isDark ? "text-gray-500" : "text-gray-700"
            )}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Sliding circle with active icon */}
      <div
        className={cn(
          "absolute flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 ease-in-out",
          isDark
            ? "left-1 bg-zinc-800"
            : "left-[calc(100%-1.75rem)] bg-gray-200"
        )}
      >
        {isDark ? (
          <Moon
            className="w-4 h-4 text-white"
            strokeWidth={1.5}
          />
        ) : (
          <Sun
            className="w-4 h-4 text-gray-700"
            strokeWidth={1.5}
          />
        )}
      </div>
    </div>
  )
}
