"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

type Language = "es" | "en"

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>("es")
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          "flex w-20 h-10 p-1 rounded-full",
          "bg-zinc-950 border border-zinc-800",
          className
        )}
      />
    )
  }

  const isDark = resolvedTheme === "dark"
  const isSpanish = language === "es"

  const handleLanguageChange = () => {
    const newLang: Language = isSpanish ? "en" : "es"
    setLanguage(newLang)
    localStorage.setItem("language", newLang)
    // Here you can add logic to change the language throughout the app
    // For example, trigger a context update or use i18n library
  }

  return (
    <div
      className={cn(
        "relative flex w-20 h-10 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark
          ? "bg-zinc-900 border border-zinc-700"
          : "bg-zinc-100 border border-zinc-300",
        className
      )}
      onClick={handleLanguageChange}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleLanguageChange()
        }
      }}
      aria-label={`Switch to ${isSpanish ? "English" : "Spanish"}`}
    >
      {/* Background text - always visible */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <div className="flex justify-center items-center w-8 h-8">
          <span
            className={cn(
              "text-xs font-medium transition-colors duration-300",
              isSpanish
                ? isDark ? "text-white" : "text-zinc-900"
                : isDark ? "text-zinc-600" : "text-zinc-400"
            )}
          >
            ES
          </span>
        </div>
        <div className="flex justify-center items-center w-8 h-8">
          <span
            className={cn(
              "text-xs font-medium transition-colors duration-300",
              !isSpanish
                ? isDark ? "text-white" : "text-zinc-900"
                : isDark ? "text-zinc-600" : "text-zinc-400"
            )}
          >
            EN
          </span>
        </div>
      </div>

      {/* Sliding circle with active text */}
      <div
        className={cn(
          "absolute flex justify-center items-center w-8 h-8 rounded-full transition-all duration-300 ease-in-out",
          isSpanish
            ? "left-1"
            : "left-[calc(100%-2.25rem)]",
          isDark
            ? "bg-zinc-700"
            : "bg-white shadow-sm"
        )}
      >
        <span
          className={cn(
            "text-xs font-semibold",
            isDark ? "text-white" : "text-zinc-900"
          )}
        >
          {isSpanish ? "ES" : "EN"}
        </span>
      </div>
    </div>
  )
}
