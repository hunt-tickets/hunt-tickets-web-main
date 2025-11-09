"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ui/theme-toggle";
import { LanguageToggle } from "./ui/language-toggle";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "./auth-button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled
        ? 'bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center"
          >
            <span className="text-2xl font-bold tracking-tight transition-all duration-300 ease-out hover:tracking-wide" style={{ fontFamily: 'LOT, sans-serif' }}>
              HUNT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/eventos"
              className="px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-muted hover:text-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground rounded-full"
            >
              Eventos
            </Link>
            <Link
              href="/productor"
              className="px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-muted hover:text-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground rounded-full"
            >
              Productor
            </Link>
            <Link
              href="/sobre-nosotros"
              className="px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-muted hover:text-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground rounded-full"
            >
              Sobre Nosotros
            </Link>
          </nav>
        </div>

        {/* Right side - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <AuthButton />
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* Right side - Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen with Glass Effect */}
      <div
        className={`fixed inset-0 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 45 }}
      >
        {/* Glass Background */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" />

        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-8 pt-16">
          <nav className="flex flex-col items-center gap-8 w-full max-w-sm">
            <Link
              href="/eventos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center px-6 py-4 text-2xl font-bold text-foreground/80 transition-all duration-300 hover:text-foreground hover:scale-110 rounded-2xl hover:bg-muted/50 dark:hover:bg-accent/30"
              style={{ fontFamily: 'LOT, sans-serif' }}
            >
              Eventos
            </Link>
            <Link
              href="/productor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center px-6 py-4 text-2xl font-bold text-foreground/80 transition-all duration-300 hover:text-foreground hover:scale-110 rounded-2xl hover:bg-muted/50 dark:hover:bg-accent/30"
              style={{ fontFamily: 'LOT, sans-serif' }}
            >
              Productor
            </Link>
            <Link
              href="/sobre-nosotros"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center px-6 py-4 text-2xl font-bold text-foreground/80 transition-all duration-300 hover:text-foreground hover:scale-110 rounded-2xl hover:bg-muted/50 dark:hover:bg-accent/30"
              style={{ fontFamily: 'LOT, sans-serif' }}
            >
              Sobre Nosotros
            </Link>

            <div className="mt-8 w-full flex justify-center">
              <AuthButton />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
