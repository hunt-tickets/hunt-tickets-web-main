"use client";

import { Calendar, MapPin, Users } from "lucide-react";
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
    <Link href={`/eventos/${id}`} className="block h-full">
      <Card className="group overflow-hidden bg-white/8 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-200 hover:shadow-lg cursor-pointer h-full rounded-[20px]">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.02]"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              {category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-xl line-clamp-2 leading-tight flex-1">
              {title}
            </h3>
            <div className="w-2 h-2 rounded-full bg-green-500 ml-3 mt-1 flex-shrink-0"></div>
          </div>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
            {attendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-white" suppressHydrationWarning>
                  {attendees.toLocaleString()} interesados
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
