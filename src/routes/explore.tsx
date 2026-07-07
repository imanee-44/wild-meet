import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, Filter, Mountain as MountainIcon, Search, Tent, Waves } from "lucide-react";
import { SiteNav, MobileNav } from "@/components/site-nav";
import { OutingCard } from "@/components/outing-card";
import { listOutings, type OutingRow } from "@/lib/outings.functions";
import { outingImage } from "@/lib/outings-images";

const search = z.object({
  category: z.enum(["All", "Camping", "Beach", "Mountain"]).optional(),
});

const outingsQO = () => queryOptions({
  queryKey: ["outings"],
  queryFn: () => listOutings(),
});

export const Route = createFileRoute("/explore")({
  validateSearch: search,
  loader: ({ context }) => { context.queryClient.ensureQueryData(outingsQO()); },
  head: () => ({
    meta: [
      { title: "Explorer les sorties — WildMeet" },
      { name: "description", content: "Parcours les sorties nature à venir au Maroc : camping, plage, montagne." },
      { property: "og:title", content: "Explorer les sorties — WildMeet" },
      { property: "og:description", content: "Trouve ta prochaine aventure au Maroc." },
    ],
  }),
  component: Explore,
});

type CategoryFilter = "All" | "Camping" | "Beach" | "Mountain";
type DateFilter = "Any" | "ThisMonth" | "NextMonth";

const filters: { id: CategoryFilter; label: string; icon: typeof Tent | null }[] = [
  { id: "All", label: "Tout", icon: null },
  { id: "Camping", label: "Camping", icon: Tent },
  { id: "Beach", label: "Plage", icon: Waves },
  { id: "Mountain", label: "Montagne", icon: MountainIcon },
];
const dateFilters: { id: DateFilter; label: string }[] = [
  { id: "Any", label: "Toutes dates" },
  { id: "ThisMonth", label: "Ce mois-ci" },
  { id: "NextMonth", label: "Le mois prochain" },
];

function Explore() {
  const { category } = Route.useSearch();
  const { data: outings } = useSuspenseQuery(outingsQO());
  const [active, setActive] = useState<CategoryFilter>((category as CategoryFilter) ?? "All");
  const [dateFilter, setDateFilter] = useState<DateFilter>("Any");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const q = query.trim().toLowerCase();
    return outings.filter((o) => {
      if (active !== "All" && o.category !== active) return false;
      if (q && !`${o.title} ${o.destination}`.toLowerCase().includes(q)) return false;
      if (dateFilter !== "Any") {
        const d = new Date(o.date);
        const target = dateFilter === "ThisMonth" ? thisMonth : thisMonth + 1;
        const targetYear = thisYear + (target > 11 ? 1 : 0);
        const m = target % 12;
        if (!(d.getMonth() === m && d.getFullYear() === targetYear)) return false;
      }
      return true;
    });
  }, [active, dateFilter, query, outings]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const counts = useMemo(() => ({
    All: outings.length,
    Camping: outings.filter((o) => o.category === "Camping").length,
    Beach: outings.filter((o) => o.category === "Beach").length,
    Mountain: outings.filter((o) => o.category === "Mountain").length,
  }), [outings]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="relative overflow-hidden border-b border-border bg-forest text-cream">
        <div className="texture-grain absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-sand">
              N°{String(outings.length).padStart(2, "0")} · Édition de la semaine
            </p>
            <h1 className="font-serif text-5xl font-bold leading-[1.02] sm:text-7xl">
              Les prochaines <span className="italic text-sand">échappées</span>.
            </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-cream/85 sm:text-lg">
            Sorties confirmées, petits groupes, ambiance choisie. Filtre par terrain, cherche un spot, garde ta place avant jeudi soir.
          </p>
        </div>
      </header>

      <div className="sticky top-[73px] z-20 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => {
              const Icon = f.icon;
              const isActive = active === f.id;
              return (
                <button key={f.id} onClick={() => setActive(f.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "border-forest bg-forest text-forest-foreground shadow-soft"
                      : "border-border bg-background text-foreground hover:border-terracotta hover:text-terracotta"
                  }`}>
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {f.label}
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-cream/20 text-cream" : "bg-muted text-muted-foreground"}`}>
                    {counts[f.id as keyof typeof counts]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher un spot…"
                className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-terracotta" />
            </div>
            <div className="flex gap-1 rounded-full border border-border bg-background p-1">
              {dateFilters.map((d) => (
                <button key={d.id} onClick={() => setDateFilter(d.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    dateFilter === d.id ? "bg-terracotta text-terracotta-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center">
            <Filter className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-serif text-2xl text-foreground">Rien ne colle à ces filtres.</p>
            <p className="mt-2 text-sm text-muted-foreground">Essaie une autre combinaison, ou organise la sortie qui te manque.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-baseline justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-serif text-2xl font-bold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "sortie" : "sorties"} au programme
              </p>
              <p className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:block">Trié par date de départ</p>
            </div>

            {featured && (
              <div className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <FeaturedCard o={featured} />
                {rest[0] && (
                  <div className="grid gap-6">
                    <OutingCard outing={rest[0]} />
                  </div>
                )}
              </div>
            )}

            {rest.length > 1 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(1).map((o) => (<OutingCard key={o.id} outing={o} />))}
              </div>
            )}
          </>
        )}
      </main>

      <MobileNav />
    </div>
  );
}

function FeaturedCard({ o }: { o: OutingRow }) {
  const spotsLeft = o.spots_total - o.spots_taken;
  const d = new Date(o.date);
  const dateStr = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <a href={`/outings/${o.id}`} className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl text-cream shadow-lift">
      <img src={outingImage(o)} alt={o.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="relative z-10 flex flex-col gap-4 p-8 sm:p-10">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em]">
          <span className="rounded-full bg-terracotta px-3 py-1">À la une</span>
          <span className="text-cream/80">{o.category}</span>
        </div>
        <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">{o.title}</h2>
        <p className="max-w-md text-sm text-cream/85">{o.description.slice(0, 140)}…</p>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-sm">
          <span className="capitalize">{dateStr}</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-cream/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest">
            {spotsLeft > 0 ? `${spotsLeft} places libres` : "Complet"} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
