"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

interface EventCardProps {
  id: string; // Event ID for navigation
  title: string;
  date: string; // Date string from API
  location: string;
  image: string;
  price?: number; // Optional price
  href?: string; // Optional custom URL (defaults to /eventos/{id})
}

export function EventCard({
  id,
  title,
  date,
  location,
  image,
  price,
  href,
}: EventCardProps) {
  // Parse date to extract day and month
  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('es-ES', { month: 'short' });

  return (
    <Link href={href || `/eventos/${id}`} className="block">
      <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden group cursor-pointer bg-white/8 border border-white/10 hover:border-white/20 backdrop-blur-sm">
        {/* Event image with hover effect */}
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Date badge in top right corner */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-400/50 rounded-lg sm:rounded-xl px-2.5 py-2 sm:px-4 sm:py-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-white leading-none">
              {day}
            </div>
            <div className="text-xs sm:text-sm text-white/90 uppercase leading-none mt-0.5 sm:mt-1">
              {month}
            </div>
          </div>
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Event information overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
          {/* Event title */}
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-balance mb-2 sm:mb-3 line-clamp-2">
            {title}
          </h2>

          {/* Event details */}
          <div className="flex flex-col gap-1 sm:gap-1.5 text-white/90 text-sm sm:text-base">
            <span className="line-clamp-1">{location}</span>
            {price && <span className="font-medium">Desde ${formatPrice(price)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
