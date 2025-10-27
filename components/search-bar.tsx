"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  // Current search query
  searchQuery: string;
  // Callback when search changes
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {

  return (
    <div className="relative h-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
      <Input
        type="search"
        placeholder="Buscar eventos, lugares..."
        className="pl-10 h-full text-base bg-white/12 border border-white/20 backdrop-blur-sm rounded-[20px] text-white placeholder:text-white/70 focus-visible:border-white/30 focus-visible:ring-0 shadow-lg"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
