import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Clock, MapPin, Share2, Sparkles, Users } from "lucide-react";
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
        <h1 className="font-serif text-4xl font-bold">Sortie introuvable</h1>
        <p className="mt-3 text-muted-foreground">Ce départ est peut-être déjà passé. Regarde les prochains.</p>
        <Link to="/explore" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Voir les sorties</Link>
      </div>
    </div>
  ),
  component: OutingDetail,
});

function OutingDetail() {
  const o = Route.useLoaderData() as Outing;
  const [joined, setJoined] = useState(false);
  const spotsLeft = Math.max(0, o.spotsTotal - o.spotsTaken - (joined ? 1 : 0));

  const d = new Date(o.date);
  const dateLong = d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const related = outings.filter((x) => x.category === o.category && x.id !== o.id).slice(0, 3);
  const pct = Math.round(((o.spotsTaken + (joined ? 1 : 0)) / o.spotsTotal) * 100);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Cover — editorial split */}
      <section className="relative">
        <div className="relative h-[68vh] min-h-[520px] w-full overflow-hidden">
          <img src={o.image} alt={o.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/40" />
        </div>

        <div className="mx-auto -mt-56 max-w-6xl px-6 sm:px-8 sm:-mt-64">
          <Link to="/explore" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cream hover:text-sand">
            <ArrowLeft className="h-4 w-4" /> Retour aux sorties
          </Link>

          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-lift sm:p-12">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em]">
              <span className="rounded-full bg-terracotta px-3 py-1 text-terracotta-foreground">{o.category}</span>
              <span className="text-muted-foreground">Sortie N°{o.id.slice(0, 6)}</span>
              <span className="ml-auto hidden items-center gap-1.5 text-terracotta sm:inline-flex">
                <Sparkles className="h-3.5 w-3.5" /> Places limitées
              </span>
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] text-foreground sm:text-6xl">
              {o.title}
            </h1>
            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              <InfoRow icon={MapPin} label="Lieu" value={o.destination} />
              <InfoRow icon={CalendarDays} label="Date" value={dateLong} capitalize />
              <InfoRow icon={Clock} label="Départ" value={time} />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_380px]">
        <div className="space-y-14">
          <section>
            <SectionLabel n="01" label="Le programme" />
            <p className="mt-6 font-serif text-2xl leading-snug text-foreground first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-terracotta first-letter:mr-2 first-letter:float-left first-letter:leading-none">
              {o.description}
            </p>
          </section>

          <section>
            <SectionLabel n="02" label="Dans le sac" />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {o.whatToBring.map((item, i) => (
                <li
                  key={item}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-terracotta hover:shadow-soft"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest/10 font-serif text-sm font-bold text-forest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionLabel n="03" label={`La tribu · ${o.spotsTaken}/${o.spotsTotal}`} />
            <div className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-soft">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-background"
                  style={{ background: o.organizer.avatarColor }}
                >
                  {o.organizer.initials}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Organisé par</p>
                  <p className="font-serif text-xl font-bold text-foreground">{o.organizer.name}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {o.participants.map((p) => (
                  <div key={p.name} className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-4">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: p.color }}
                    >
                      {p.initials}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{p.name}</span>
                  </div>
                ))}
                {spotsLeft > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-terracotta/60 px-4 py-1.5 text-xs font-semibold text-terracotta">
                    <Users className="h-3.5 w-3.5" /> {spotsLeft} place{spotsLeft > 1 ? "s" : ""} libre{spotsLeft > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sticky booking */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <div className="bg-forest p-6 text-forest-foreground">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sand">Ta place</p>
              <p className="mt-2 font-serif text-4xl font-bold">Gratuit</p>
              <p className="mt-1 text-xs text-cream/70">Paie sur place · Repas inclus</p>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-widest text-muted-foreground">Remplissage</span>
                  <span className="font-bold text-foreground">{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-terracotta transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <MiniRow label="Date" value={dateLong.split(" ").slice(0, 3).join(" ")} />
              <MiniRow label="Départ" value={time} />
              <MiniRow label="Places" value={`${spotsLeft} sur ${o.spotsTotal}`} />

              <button
                onClick={() => setJoined((v) => !v)}
                disabled={spotsLeft === 0 && !joined}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold shadow-soft transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  joined
                    ? "bg-forest text-forest-foreground hover:bg-forest/90"
                    : "bg-terracotta text-terracotta-foreground hover:-translate-y-0.5 hover:shadow-lift"
                }`}
              >
                {joined ? (<><Check className="h-4 w-4" /> Tu es dedans</>) : (<>Rejoindre cette sortie <ArrowUpRight className="h-4 w-4" /></>)}
              </button>

              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-terracotta hover:text-terracotta">
                <Share2 className="h-3.5 w-3.5" /> Partager la sortie
              </button>

              {joined && (
                <p className="text-center text-xs text-muted-foreground">
                  On t'envoie le point de rendez-vous par email vendredi.
                </p>
              )}
            </div>
          </div>
        </aside>
      </main>

      {related.length > 0 && (
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                À voir aussi<span className="text-terracotta">.</span>
              </h2>
              <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-terracotta">
                Tout parcourir <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/outings/$id"
                  params={{ id: r.id }}
                  className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={r.image} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">{r.category}</p>
                    <p className="mt-2 font-serif text-lg font-bold text-foreground">{r.title}</p>
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

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-border pb-3">
      <span className="font-serif text-sm font-bold text-terracotta">{n}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, capitalize }: { icon: typeof MapPin; label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className={`mt-0.5 truncate text-sm font-semibold text-foreground ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
