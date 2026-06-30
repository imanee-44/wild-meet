import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, Tent, Waves, Mountain as MountainIcon, Sparkles, Users, MapPin } from "lucide-react";
import { SiteNav, MobileNav } from "@/components/site-nav";
import { OutingCard } from "@/components/outing-card";
import { outings } from "@/lib/mock-data";
import heroImg from "@/assets/hero.jpg";
import campingImg from "@/assets/camping.jpg";
import beachImg from "@/assets/beach.jpg";
import mountainImg from "@/assets/mountain.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WildMeet — Chaque samedi, une aventure entre inconnus." },
      { name: "description", content: "Réponds à quelques questions, on te matche avec 5 inconnus, et samedi vous partez ensemble explorer le Maroc. Camping, plage, montagne." },
      { property: "og:title", content: "WildMeet — Chaque samedi, une aventure entre inconnus." },
      { property: "og:description", content: "6 inconnus, une sortie nature, un week-end qu'on n'oublie pas." },
    ],
  }),
  component: Landing,
});

const categories = [
  { name: "Camping", icon: Tent, img: campingImg, blurb: "Nuits lentes sous les cèdres de l'Atlas.", tint: "from-forest/85" },
  { name: "Beach", icon: Waves, img: beachImg, blurb: "Sel, soleil et longues sessions de surf.", tint: "from-terracotta/80" },
  { name: "Mountain", icon: MountainIcon, img: mountainImg, blurb: "Crêtes, levers de soleil, sommets.", tint: "from-forest/85" },
] as const;

const steps = [
  {
    n: "01",
    title: "Réponds au quiz",
    text: "Cinq questions, deux minutes. Dis-nous ton rythme, ton terrain préféré et ce que tu cherches.",
  },
  {
    n: "02",
    title: "On te matche",
    text: "Mercredi soir, tu reçois ton groupe : cinq inconnus choisis pour partager ta vibe.",
  },
  {
    n: "03",
    title: "Samedi, vous partez",
    text: "Rendez-vous au point de départ. Une sortie, un repas partagé, peut-être de nouveaux amis.",
  },
];

const testimonials = [
  {
    quote: "Je suis venue seule, je suis repartie avec un groupe de rando qu'on retrouve tous les mois. Magique.",
    name: "Imane, 28",
    where: "Sortie Ifrane",
  },
  {
    quote: "L'idée de partir avec des inconnus me stressait. Au bout d'une heure on rigolait comme à la fac.",
    name: "Anas, 31",
    where: "Surf à Imsouane",
  },
  {
    quote: "Le meilleur week-end de mon année. Et je n'aurais jamais trouvé ce spot toute seule.",
    name: "Salma, 26",
    where: "Camp Bin El Ouidane",
  },
];

function useCountdownToSaturday() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date(now);
      const day = now.getDay();
      const daysUntil = (6 - day + 7) % 7 || 7;
      target.setDate(now.getDate() + daysUntil);
      target.setHours(9, 0, 0, 0);
      const diff = Math.max(0, target.getTime() - now.getTime());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Landing() {
  const t = useCountdownToSaturday();
  const featured = outings[0];

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative isolate h-screen min-h-[680px] w-full overflow-hidden text-cream">
        <SiteNav transparent />
        <img
          src={heroImg}
          alt="Randonneurs sur une crête au lever du soleil"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/35 to-black/80" />

        <div className="mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 pt-32 sm:px-8 sm:pb-28">
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Chaque samedi, un nouveau groupe
          </span>
          <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[1.02] sm:text-7xl md:text-[5.5rem]">
            6 inconnus.<br />
            Une aventure. <span className="italic text-sand">Un samedi.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-cream/85 sm:text-lg">
            WildMeet te matche avec cinq personnes près de chez toi pour une sortie nature au Maroc.
            Tu réponds à un mini quiz, on s'occupe du reste.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-terracotta-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Réserver ma place <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 bg-transparent px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur transition-colors hover:bg-cream/10"
            >
              Organiser ma sortie
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.18em] text-cream/70">
            <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> 2 400+ membres</span>
            <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> 12 villes au Maroc</span>
            <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> 4,9 / 5 sur 800 avis</span>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="border-b border-border bg-forest text-cream">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:px-8 md:flex-row">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Prochain départ</p>
            <p className="mt-2 font-serif text-2xl font-bold sm:text-3xl">Samedi matin, partout au Maroc</p>
          </div>
          <div className="flex gap-3 sm:gap-5">
            {[
              { v: t.d, l: "jours" },
              { v: t.h, l: "h" },
              { v: t.m, l: "min" },
              { v: t.s, l: "sec" },
            ].map((u) => (
              <div key={u.l} className="flex w-16 flex-col items-center rounded-2xl bg-cream/10 px-2 py-3 backdrop-blur sm:w-20">
                <span className="font-serif text-3xl font-bold tabular-nums sm:text-4xl">
                  {String(u.v).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-widest text-cream/70">{u.l}</span>
              </div>
            ))}
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-terracotta-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          >
            J'en suis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Comment ça marche
          </p>
          <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Trois étapes, zéro stress.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Pas de scroll infini, pas de chat awkward. On filtre pour toi, tu n'as plus qu'à te pointer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="font-serif text-5xl font-bold text-terracotta/30 transition-colors group-hover:text-terracotta">
                {s.n}
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                Pick your terrain
              </p>
              <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                Trois manières de prendre l'air
              </h2>
            </div>
            <p className="max-w-md text-base text-muted-foreground">
              Chaque tribu a son rythme. Choisis l'ambiance qui te tente ce week-end.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.name}
                to="/explore"
                search={{ category: c.name } as never}
                className="group relative flex aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} via-black/20 to-transparent`} />
                <div className="relative z-10 flex w-full flex-col justify-end gap-2 p-7 text-cream">
                  <c.icon className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                  <h3 className="font-serif text-3xl font-bold">{c.name}</h3>
                  <p className="text-sm text-cream/85">{c.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sand">
                    Browse outings <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED OUTING — magazine style */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Link
            to="/outings/$id"
            params={{ id: featured.id }}
            className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-lift"
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute left-6 top-6 rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forest">
              Sortie de la semaine
            </span>
          </Link>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              {featured.category} · {featured.destination}
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/80">
              {featured.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {featured.participants.slice(0, 4).map((p) => (
                <div
                  key={p.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-background"
                  style={{ background: p.color }}
                  title={p.name}
                >
                  {p.initials}
                </div>
              ))}
              <span className="text-sm text-muted-foreground">
                {featured.spotsTotal - featured.spotsTaken} places restantes sur {featured.spotsTotal}
              </span>
            </div>
            <Link
              to="/outings/$id"
              params={{ id: featured.id }}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-forest-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Voir la sortie <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                Au programme
              </p>
              <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                Les prochains départs
              </h2>
            </div>
            <Link
              to="/explore"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-forest hover:text-terracotta sm:inline-flex"
            >
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outings.slice(0, 3).map((o) => (
              <OutingCard key={o.id} outing={o} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Ils l'ont fait
          </p>
          <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Des inconnus le matin. Une bande le soir.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft"
            >
              <Compass className="h-6 w-6 text-terracotta" />
              <blockquote className="font-serif text-lg leading-snug text-foreground">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-auto text-sm">
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-muted-foreground">{t.where}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8">
        <div className="texture-grain relative overflow-hidden rounded-[2rem] bg-forest p-10 text-forest-foreground sm:p-16">
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.5fr_auto] md:items-center">
            <div>
              <h3 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
                Prêt·e pour samedi ?
              </h3>
              <p className="mt-3 max-w-xl text-sand/90">
                Réserve ta place avant jeudi soir. Tu reçois ton groupe vendredi, et samedi tu pars.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-terracotta-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Trouver ma sortie <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:px-8">
          <p className="font-serif text-base font-semibold text-foreground">WildMeet</p>
          <p>© {new Date().getFullYear()} WildMeet. Fait pour celles et ceux qui aiment la boue sur leurs chaussures.</p>
        </div>
      </footer>

      <MobileNav />
    </div>
  );
}
