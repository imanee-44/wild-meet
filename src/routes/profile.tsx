import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, Settings2, Sparkles } from "lucide-react";
import { SiteNav, MobileNav } from "@/components/site-nav";
import { OutingCard } from "@/components/outing-card";
import { currentUser, outings } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `${currentUser.name} — profil WildMeet` },
      { name: "description", content: `Profil WildMeet de ${currentUser.name}, passions et prochaines sorties.` },
      { property: "og:title", content: `${currentUser.name} sur WildMeet` },
      { property: "og:description", content: currentUser.bio },
    ],
  }),
  component: Profile,
});

type Tab = "hosted" | "joined";

function Profile() {
  const organized = outings.filter((o) => currentUser.organized.includes(o.id));
  const joined = outings.filter((o) => currentUser.joined.includes(o.id));
  const [tab, setTab] = useState<Tab>("hosted");

  const list = tab === "hosted" ? organized : joined;
  const upcoming = [...organized, ...joined].sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Banner */}
      <div className="relative h-64 w-full overflow-hidden bg-forest sm:h-80">
        <div className="texture-grain absolute inset-0 bg-gradient-to-br from-forest via-[oklch(0.42_0.04_45)] to-terracotta" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,165,116,0.25),_transparent_60%)]" />
      </div>

      <main className="mx-auto -mt-28 max-w-6xl px-6 pb-32 sm:px-8 sm:-mt-32">
        {/* Identity card */}
        <section className="rounded-[2rem] border border-border bg-card p-7 shadow-lift sm:p-10">
          <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-terracotta font-serif text-4xl font-bold text-terracotta-foreground shadow-lift ring-4 ring-card sm:h-36 sm:w-36 sm:text-5xl">
                {currentUser.initials}
              </div>
              <span className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-forest-foreground shadow-soft">
                <Sparkles className="h-3 w-3" /> Actif
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-terracotta">Membre depuis 2024</p>
              <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-foreground sm:text-5xl">
                {currentUser.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {currentUser.bio}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {currentUser.tags.map((tag) => (
                  <span
                    key={tag}
                    className="cursor-default rounded-full border border-border bg-sand px-3.5 py-1.5 text-xs font-semibold text-sand-foreground transition-transform hover:-translate-y-0.5 hover:bg-terracotta hover:text-terracotta-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button className="hidden h-fit items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-terracotta hover:text-terracotta sm:inline-flex">
              <Settings2 className="h-3.5 w-3.5" /> Éditer
            </button>
          </div>

          {/* Stats bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4">
            <Stat label="Organisées" value={organized.length} />
            <Stat label="Rejointes" value={joined.length} />
            <Stat label="Villes" value={5} />
            <Stat label="Note" value="4.9" />
          </div>
        </section>

        {/* Next up */}
        {upcoming && (
          <section className="mt-8 grid gap-6 overflow-hidden rounded-[2rem] border border-border bg-forest text-forest-foreground shadow-soft md:grid-cols-[1.4fr_1fr]">
            <div className="p-8 sm:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sand">Prochaine sortie</p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">{upcoming.title}</h2>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/85">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {upcoming.destination}</span>
                <span className="flex items-center gap-2 capitalize">
                  <CalendarDays className="h-4 w-4" />{" "}
                  {new Date(upcoming.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </span>
              </div>
            </div>
            <div className="relative min-h-[200px]">
              <img src={upcoming.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-forest" />
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="mt-14 flex items-center justify-between">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            {([
              ["hosted", `Organisées · ${organized.length}`],
              ["joined", `Rejointes · ${joined.length}`],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  tab === id
                    ? "bg-forest text-forest-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:block">
            {list.length} {list.length === 1 ? "aventure" : "aventures"}
          </p>
        </div>

        <section className="mt-8">
          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
              <p className="font-serif text-2xl text-foreground">
                {tab === "hosted" ? "Aucune sortie organisée." : "Aucune sortie rejointe."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {tab === "hosted" ? "Lance la première, la communauté suivra." : "Trouve celle qui te tente sur Explorer."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((o) => (
                <OutingCard key={o.id} outing={o} />
              ))}
            </div>
          )}
        </section>
      </main>

      <MobileNav />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-serif text-3xl font-bold text-foreground sm:text-4xl">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  );
}
