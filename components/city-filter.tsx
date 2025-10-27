"use client";

import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CityFilterProps {
  // List of unique cities from events
  cities: string[];
  // Currently selected city
  selectedCity: string | null;
  // Callback when city changes
  onCityChange: (city: string | null) => void;
}

export function CityFilter({ cities, selectedCity, onCityChange }: CityFilterProps) {
  return (
    <div className="w-full h-full">
      <Select
        value={selectedCity || "all"}
        onValueChange={(value) => onCityChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-full h-full bg-white/12 border border-white/20 backdrop-blur-sm rounded-[20px] text-white data-[placeholder]:text-white/70 focus:border-white/30 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-white/70" />
            <SelectValue placeholder="Todas las ciudades" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/15 backdrop-blur-md border border-white/25 rounded-[20px] text-white shadow-xl">
          <SelectItem value="all">Todas las ciudades</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
