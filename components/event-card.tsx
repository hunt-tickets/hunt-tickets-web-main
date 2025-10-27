"use client";

import { Calendar, MapPin, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: string; // Event ID for navigation
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
  attendees?: number;
}

export function EventCard({
  id,
  title,
  date,
  location,
  image,
  category,
  attendees,
}: EventCardProps) {
  return (
    <Link href={`/eventos/${id}`} className="block h-full group">
      {/* Outer glow effect */}
      <div className="relative h-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-[24px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white/10 via-white/8 to-white/5 border-2 border-white/10 hover:border-cyan-500/30 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer h-full rounded-[22px] group-hover:scale-[1.01]">
          {/* Image Section */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Category Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/20 px-3 py-1 hover:shadow-cyan-500/40 transition-shadow">
                {category}
              </Badge>
            </div>

            {/* Trending indicator */}
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
              <div className="p-2 bg-cyan-500/20 backdrop-blur-sm rounded-xl border border-cyan-400/30">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
              </div>
            </div>

            {/* Arrow indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="relative p-6">
            {/* Title with status indicator */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl line-clamp-2 leading-tight flex-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
                {title}
              </h3>
              <div className="relative ml-3 mt-1 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
              </div>
            </div>

            {/* Details with enhanced styling */}
            <div className="flex flex-col gap-3 text-sm">
              {/* Date */}
              <div className="flex items-center gap-3 group/item">
                <div className="p-1.5 bg-cyan-500/10 rounded-lg group-hover/item:bg-cyan-500/20 transition-colors">
                  <Calendar className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                </div>
                <span className="text-white/80 group-hover/item:text-white transition-colors">{date}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 group/item">
                <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover/item:bg-blue-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </div>
                <span className="text-white/80 line-clamp-1 group-hover/item:text-white transition-colors">{location}</span>
              </div>

              {/* Attendees */}
              {attendees && (
                <div className="flex items-center gap-3 group/item">
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg group-hover/item:bg-indigo-500/20 transition-colors">
                    <Users className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                  </div>
                  <span className="font-medium text-white group-hover/item:text-cyan-400 transition-colors" suppressHydrationWarning>
                    {attendees.toLocaleString()} interesados
                  </span>
                </div>
              )}
            </div>

            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </CardContent>

          {/* Decorative corner glow */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </Card>
      </div>
    </Link>
  );
}
