"use client"

import { useEffect, useState } from "react"

interface FixedHeroWrapperProps {
  children: React.ReactNode
}

export function FixedHeroWrapper({ children }: FixedHeroWrapperProps) {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    // Set initial height
    const setVh = () => {
      const vh = window.innerHeight
      setHeight(vh)
      // Also set CSS custom property as fallback
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Set on mount
    setVh()

    // Update on resize (but throttled to avoid performance issues)
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(setVh, 100)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      {/* Fixed Hero Background */}
      <div
        className="fixed top-0 left-0 right-0 w-full z-0"
        style={{
          height: height ? `${height}px` : '100vh',
        }}
      >
        {children}
      </div>

      {/* Spacer */}
      <div
        style={{
          height: height ? `${height}px` : '100vh',
        }}
      />
    </>
  )
}
