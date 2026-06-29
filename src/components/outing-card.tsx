import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { Outing } from "@/lib/mock-data";

const categoryStyles: Record<string, string> = {
  Camping: "bg-forest text-forest-foreground",
  Beach: "bg-sand text-sand-foreground",
  Mountain: "bg-terracotta text-terracotta-foreground",
};


export function OutingCard({ outing }: { outing: Outing }) {
  const spotsLeft = outing.spotsTotal - outing.spotsTaken;
  const date = new Date(outing.date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to="/outings/$id"
      params={{ id: outing.id }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={outing.image}
          alt={outing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyles[outing.category]}`}
        >
          {outing.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
          {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-serif text-xl font-bold leading-tight text-foreground">
          {outing.title}
        </h3>
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-terracotta" /> {outing.destination}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-terracotta" /> {date}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-background"
            style={{ background: outing.organizer.avatarColor }}
            aria-label={`Organized by ${outing.organizer.name}`}
          >
            {outing.organizer.initials}
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {outing.spotsTaken}/{outing.spotsTotal} joined
          </span>
        </div>
      </div>
    </Link>
  );
}
