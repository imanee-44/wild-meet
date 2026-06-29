import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteNav, MobileNav } from "@/components/site-nav";
import { OutingCard } from "@/components/outing-card";
import { outings, type Category } from "@/lib/mock-data";

const search = z.object({
  category: z.enum(["All", "Camping", "Beach", "Mountain"]).optional(),
});

export const Route = createFileRoute("/explore")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Explore outings — WildMeet" },
      { name: "description", content: "Browse upcoming camping, beach and mountain outings near you. Filter by terrain and date." },
      { property: "og:title", content: "Explore outings — WildMeet" },
      { property: "og:description", content: "Find your next outdoor adventure on WildMeet." },
    ],
  }),
  component: Explore,
});

type Filter = "All" | Category;
type DateFilter = "Any" | "ThisMonth" | "NextMonth";

const filters: Filter[] = ["All", "Camping", "Beach", "Mountain"];
const dateFilters: { id: DateFilter; label: string }[] = [
  { id: "Any", label: "Any date" },
  { id: "ThisMonth", label: "This month" },
  { id: "NextMonth", label: "Next month" },
];

function Explore() {
  const { category } = Route.useSearch();
  const [active, setActive] = useState<Filter>((category as Filter) ?? "All");
  const [dateFilter, setDateFilter] = useState<DateFilter>("Any");

  const filtered = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    return outings.filter((o) => {
      if (active !== "All" && o.category !== active) return false;
      if (dateFilter !== "Any") {
        const d = new Date(o.date);
        const target = dateFilter === "ThisMonth" ? thisMonth : thisMonth + 1;
        const targetYear = thisYear + (target > 11 ? 1 : 0);
        const m = target % 12;
        if (!(d.getMonth() === m && d.getFullYear() === targetYear)) return false;
      }
      return true;
    });
  }, [active, dateFilter]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Explore
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-6xl">
            Upcoming adventures
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Small groups, real people, weekends well spent. Filter by terrain or date and find one that fits.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-[73px] z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  active === f
                    ? "border-forest bg-forest text-forest-foreground shadow-soft"
                    : "border-border bg-background text-foreground hover:border-terracotta hover:text-terracotta"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {dateFilters.map((d) => (
              <button
                key={d.id}
                onClick={() => setDateFilter(d.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  dateFilter === d.id
                    ? "bg-terracotta text-terracotta-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center">
            <p className="font-serif text-2xl text-foreground">Nothing here — yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another filter, or host the trip you wish existed.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "outing" : "outings"} matching your filters
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((o) => (
                <OutingCard key={o.id} outing={o} />
              ))}
            </div>
          </>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
