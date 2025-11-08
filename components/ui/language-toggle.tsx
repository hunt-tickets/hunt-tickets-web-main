"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Language = "es" | "en";

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    // Here you can add logic to change the language throughout the app
    // For example, trigger a context update or use i18n library
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 transition-all duration-200 hover:bg-muted dark:hover:bg-accent/50"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Cambiar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("es")}
          className={`cursor-pointer ${
            language === "es" ? "bg-muted dark:bg-accent/50 font-medium" : ""
          }`}
        >
          <span className="flex items-center gap-2">
            🇪🇸 ESP
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`cursor-pointer ${
            language === "en" ? "bg-muted dark:bg-accent/50 font-medium" : ""
          }`}
        >
          <span className="flex items-center gap-2">
            🇺🇸 EN
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
