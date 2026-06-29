import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, MobileNav } from "@/components/site-nav";
import { OutingCard } from "@/components/outing-card";
import { currentUser, outings } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `${currentUser.name} — WildMeet profile` },
      { name: "description", content: `${currentUser.name}'s WildMeet profile, passions and upcoming outings.` },
      { property: "og:title", content: `${currentUser.name} on WildMeet` },
      { property: "og:description", content: currentUser.bio },
    ],
  }),
  component: Profile,
});

function Profile() {
  const organized = outings.filter((o) => currentUser.organized.includes(o.id));
  const joined = outings.filter((o) => currentUser.joined.includes(o.id));

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-forest sm:h-72">
        <div className="texture-grain absolute inset-0 bg-gradient-to-br from-forest via-forest to-[oklch(0.30_0.05_156)]" />
      </div>

      <main className="mx-auto -mt-20 max-w-5xl px-6 pb-32 sm:px-8 sm:-mt-24">
        <section className="rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-10">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 sm:gap-7">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-terracotta text-3xl font-bold text-terracotta-foreground ring-4 ring-card sm:h-32 sm:w-32 sm:text-4xl">
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {currentUser.name}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
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
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
            <Stat label="Organized" value={organized.length} />
            <Stat label="Joined" value={joined.length} />
            <Stat label="Tribes" value={3} />
          </div>
        </section>

        <Section title="Outings I'm hosting" empty="No trips planned. Time to host one?">
          {organized.map((o) => <OutingCard key={o.id} outing={o} />)}
        </Section>

        <Section title="Outings I've joined" empty="No outings yet. Find one on Explore.">
          {joined.map((o) => <OutingCard key={o.id} outing={o} />)}
        </Section>
      </main>

      <MobileNav />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-serif text-3xl font-bold text-foreground">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      {children.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      )}
    </section>
  );
}
