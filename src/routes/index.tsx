import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Tent, Waves, Mountain as MountainIcon } from "lucide-react";
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
      { title: "WildMeet — Find your wild. Find your people." },
      { name: "description", content: "Discover small-group camping, beach and mountain outings led by real people. Find your adventure tribe on WildMeet." },
      { property: "og:title", content: "WildMeet — Find your wild. Find your people." },
      { property: "og:description", content: "Small-group outdoor adventures: camping, beach, mountain. Join a trip or host your own." },
    ],
  }),
  component: Landing,
});

const categories = [
  { name: "Camping", icon: Tent, emoji: "🏕️", img: campingImg, blurb: "Slow nights under the pines.", tint: "from-forest/85" },
  { name: "Beach", icon: Waves, emoji: "🏖️", img: beachImg, blurb: "Salt, sun, and long swims.", tint: "from-terracotta/80" },
  { name: "Mountain", icon: MountainIcon, emoji: "🏔️", img: mountainImg, blurb: "Ridges, sunrises, summits.", tint: "from-forest/85" },
] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative isolate h-screen min-h-[640px] w-full overflow-hidden text-cream">
        <SiteNav transparent />
        <img
          src={heroImg}
          alt="Hiker on a mountain ridge at sunrise"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />

        <div className="mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 pt-32 sm:px-8 sm:pb-28">
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur">
            <Compass className="h-3.5 w-3.5" /> A social club for the outdoors
          </span>
          <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[1.02] sm:text-7xl md:text-8xl">
            Find your wild. <br />
            <span className="italic text-sand">Find your people.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-cream/85 sm:text-lg">
            WildMeet connects you with small groups heading into the forest,
            onto the sand, and up the ridge. Pick an outing, show up, share the day.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-terracotta-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Join an adventure <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 bg-transparent px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur transition-colors hover:bg-cream/10"
            >
              Host your own
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Pick your terrain
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Three ways to get outside
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground">
            Each tribe has its own pace and rituals. Choose where you'd like to spend your weekend.
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
                <span className="text-3xl" aria-hidden>{c.emoji}</span>
                <h3 className="font-serif text-3xl font-bold">{c.name}</h3>
                <p className="text-sm text-cream/85">{c.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sand">
                  Browse outings <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED OUTINGS */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                Upcoming
              </p>
              <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                This month's adventures
              </h2>
            </div>
            <Link
              to="/explore"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-forest hover:text-terracotta sm:inline-flex"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outings.slice(0, 3).map((o) => (
              <OutingCard key={o.id} outing={o} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="texture-grain relative overflow-hidden rounded-[2rem] bg-forest p-10 text-forest-foreground sm:p-16">
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.5fr_auto] md:items-center">
            <div>
              <h3 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
                Got a trip in mind? Host it.
              </h3>
              <p className="mt-3 max-w-xl text-sand/90">
                Whether it's a four-person sunrise mission or a twelve-person beach weekend,
                share it with the WildMeet community and watch your tribe show up.
              </p>
            </div>
            <Link
              to="/create"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-terracotta-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Host an outing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:px-8">
          <p className="font-serif text-base font-semibold text-foreground">WildMeet</p>
          <p>© {new Date().getFullYear()} WildMeet. Made for people who love mud on their boots.</p>
        </div>
      </footer>

      <MobileNav />
    </div>
  );
}
