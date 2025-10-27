"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedCityFilterProps {
  cities: string[];
  selectedCity: string | null;
  onCityChange: (city: string | null) => void;
}

export function EnhancedCityFilter({ cities, selectedCity, onCityChange }: EnhancedCityFilterProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Select
      value={selectedCity || "all"}
      onValueChange={(value) => onCityChange(value === "all" ? null : value)}
    >
      <SelectTrigger
        className={`w-full !h-12 pl-4 pr-4 py-0 bg-white/10 border rounded-3xl text-base text-white data-[placeholder]:text-white/50 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 transition-all duration-200 ${
          isFocused
            ? 'border-white/40 bg-white/15'
            : 'border-white/20 hover:border-white/30 hover:bg-white/12'
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div className="flex items-center gap-2">
          <MapPin className={`h-5 w-5 transition-colors duration-200 ${
            isFocused ? 'text-white/80' : 'text-white/50'
          }`} />
          <SelectValue placeholder="Todas las ciudades" />
        </div>
      </SelectTrigger>

        <SelectContent className="bg-[#101010]/95 backdrop-blur-xl border border-white/20 rounded-2xl text-white text-base">
          <SelectItem
            value="all"
            className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-base"
          >
            Todas las ciudades
          </SelectItem>

          {cities.map((city) => (
            <SelectItem
              key={city}
              value={city}
              className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-base"
            >
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
}
