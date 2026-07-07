import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { outingImage } from "@/lib/outings-images";
import type { OutingRow } from "@/lib/outings.functions";

const categoryStyles: Record<string, string> = {
  Camping: "bg-forest text-forest-foreground",
  Beach: "bg-sand text-sand-foreground",
  Mountain: "bg-terracotta text-terracotta-foreground",
};
const monthShort = ["JAN", "FEV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOU", "SEP", "OCT", "NOV", "DEC"];

export function OutingCard({ outing }: { outing: OutingRow }) {
  const spotsLeft = outing.spots_total - outing.spots_taken;
  const d = new Date(outing.date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = monthShort[d.getMonth()];
  const weekday = d.toLocaleDateString("fr-FR", { weekday: "long" });
  const pct = Math.min(100, Math.round((outing.spots_taken / outing.spots_total) * 100));
  const full = spotsLeft === 0;
  const img = outingImage(outing);

  return (
    <Link
      to="/outings/$id"
      params={{ id: outing.id }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img src={img} alt={outing.title} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-2xl bg-background/95 px-3 py-2 text-center shadow-soft backdrop-blur">
          <span className="font-serif text-2xl font-bold leading-none text-foreground">{day}</span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-terracotta">{month}</span>
        </div>
        <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${categoryStyles[outing.category]}`}>
          {outing.category}
        </span>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-cream">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5" /> {outing.destination.split(",")[0]}
          </span>
          <span className="rounded-full bg-cream/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-forest">
            {full ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{weekday}</p>
          <h3 className="mt-1.5 font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-terracotta">
            {outing.title}
          </h3>
        </div>
        <div className="mt-auto space-y-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full transition-all duration-500 ${full ? "bg-destructive" : "bg-terracotta"}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center -space-x-2">
              {outing.participants.slice(0, 4).map((p) => (
                <div key={p.user_id} title={p.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-card"
                  style={{ background: p.avatar_color }}>
                  {p.initials}
                </div>
              ))}
              {outing.spots_taken > 4 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground ring-2 ring-card">
                  +{outing.spots_taken - 4}
                </div>
              )}
            </div>
            <ArrowUpRight className="h-5 w-5 text-forest transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
