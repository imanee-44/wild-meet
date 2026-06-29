import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Check, MapPin, Users } from "lucide-react";
import { SiteNav, MobileNav } from "@/components/site-nav";
import { getOuting, outings } from "@/lib/mock-data";

import type { Outing } from "@/lib/mock-data";

export const Route = createFileRoute("/outings/$id")({
  loader: ({ params }): Outing => {
    const outing = getOuting(params.id);
    if (!outing) throw notFound();
    return outing;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — WildMeet` },
          { name: "description", content: loaderData.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.title} — WildMeet` },
          { property: "og:description", content: loaderData.description.slice(0, 155) },
          { property: "og:image", content: loaderData.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-4xl font-bold">Outing not found</h1>
        <p className="mt-3 text-muted-foreground">This trip might have wrapped up. Try another one.</p>
        <Link to="/explore" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Browse outings</Link>
      </div>
    </div>
  ),
  component: OutingDetail,
});

function OutingDetail() {
  const o = Route.useLoaderData() as Outing;
  const [joined, setJoined] = useState(false);
  const spotsLeft = Math.max(0, o.spotsTotal - o.spotsTaken - (joined ? 1 : 0));

  const date = new Date(o.date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = new Date(o.date).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const related = outings.filter((x) => x.category === o.category && x.id !== o.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Cover */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <img src={o.image} alt={o.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-6 pb-10 sm:px-8 sm:pb-14">
          <Link to="/explore" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cream/90 hover:text-cream">
            <ArrowLeft className="h-4 w-4" /> Back to explore
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-terracotta-foreground">
            {o.category === "Camping" && "🏕️"} {o.category === "Beach" && "🏖️"} {o.category === "Mountain" && "🏔️"} {o.category}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-cream sm:text-6xl">{o.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/90">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {o.destination}</span>
            <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {date} · {time}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground">About this adventure</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">{o.description}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground">What to bring</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {o.whatToBring.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-medium">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-forest-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-foreground">Who's going</h2>
              <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" /> {o.spotsTaken + (joined ? 1 : 0)}/{o.spotsTotal}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {o.participants.map((p) => (
                <div
                  key={p.name}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-background"
                  style={{ background: p.color }}
                  title={p.name}
                >
                  {p.initials}
                </div>
              ))}
              {joined && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-terracotta-foreground ring-2 ring-background">
                  You
                </div>
              )}
              {spotsLeft > 0 && (
                <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-sand-foreground">
                  {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                </span>
              )}
            </div>
          </section>
        </div>

        {/* Sticky side panel */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: o.organizer.avatarColor }}
              >
                {o.organizer.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Organized by</p>
                <p className="truncate font-serif text-lg font-semibold text-foreground">{o.organizer.name}</p>
              </div>
            </div>

            <div className="my-6 h-px bg-border" />

            <div className="space-y-3 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-semibold text-foreground">{date.split(",")[0]}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-semibold text-foreground">{time}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Spots</span>
                <span className="font-semibold text-foreground">{spotsLeft} left of {o.spotsTotal}</span>
              </p>
            </div>

            <button
              onClick={() => setJoined((v) => !v)}
              disabled={spotsLeft === 0 && !joined}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold shadow-soft transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                joined
                  ? "bg-forest text-forest-foreground hover:bg-forest/90"
                  : "bg-terracotta text-terracotta-foreground hover:-translate-y-0.5 hover:shadow-lift"
              }`}
            >
              {joined ? (<><Check className="h-4 w-4" /> You're in</>) : "Join this adventure"}
            </button>
            {joined && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                See you out there. We'll send the meet-up details by email.
              </p>
            )}
          </div>
        </aside>
      </main>

      {related.length > 0 && (
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">More {o.category.toLowerCase()} outings</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/outings/$id"
                  params={{ id: r.id }}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={r.image} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="font-serif text-lg font-semibold text-foreground">{r.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.destination}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <MobileNav />
    </div>
  );
}
