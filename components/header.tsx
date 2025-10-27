"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ui/theme-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthButton } from "./auth-button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
          <ThemeToggle />
        </div>

        {/* Right side - Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/eventos" className="relative flex w-full cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-all duration-200 hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground dark:focus:bg-accent dark:focus:text-accent-foreground">
                  Eventos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sobre-nosotros" className="relative flex w-full cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-all duration-200 hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground dark:focus:bg-accent dark:focus:text-accent-foreground">
                  Sobre Nosotros
                </Link>
              </DropdownMenuItem>
              <div className="px-2 py-2 flex flex-col items-center gap-3">
                <AuthButton />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
