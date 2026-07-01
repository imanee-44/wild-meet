import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, MapPin, Mountain as MountainIcon, Tent, Users, Waves } from "lucide-react";
import { SiteNav, MobileNav } from "@/components/site-nav";
import type { Category } from "@/lib/mock-data";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Organiser une sortie — WildMeet" },
      { name: "description", content: "Crée ta sortie camping, plage ou montagne et invite la communauté WildMeet à te rejoindre." },
      { property: "og:title", content: "Organiser une sortie — WildMeet" },
      { property: "og:description", content: "Partage ta prochaine aventure avec la communauté WildMeet." },
    ],
  }),
  component: CreateOuting,
});

const categoryMeta: { id: Category; icon: typeof Tent; blurb: string }[] = [
  { id: "Camping", icon: Tent, blurb: "Nuit dehors, feu, ciel étoilé." },
  { id: "Beach", icon: Waves, blurb: "Océan, surf, sable chaud." },
  { id: "Mountain", icon: MountainIcon, blurb: "Sommets, crêtes, silence." },
];

type Step = 1 | 2 | 3;

function CreateOuting() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    title: "",
    category: "Camping" as Category,
    date: "",
    location: "",
    maxParticipants: 6,
    description: "",
    whatToBring: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = useMemo(() => {
    if (step === 1) return !!form.title && !!form.category;
    if (step === 2) return !!form.date && !!form.location && form.maxParticipants >= 2;
    return true;
  }, [step, form]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => ((s + 1) as Step));
      return;
    }
    setSubmitted(true);
    setTimeout(() => navigate({ to: "/explore" }), 1600);
  }

  const dateLabel = form.date
    ? new Date(form.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : "À définir";

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Editorial header */}
      <header className="border-b border-border bg-forest text-cream">
        <div className="texture-grain relative">
          <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 sm:px-8 sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sand">Organiser une sortie</p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-6xl">
              La sortie qui te manque, <span className="italic text-sand">crée-la</span>.
            </h1>
            <p className="max-w-xl text-cream/80">
              Trois étapes, deux minutes. On t'aide à trouver les bonnes personnes.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 pb-32 sm:px-8 sm:py-16">
        {submitted ? (
          <SuccessCard />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Stepper form */}
            <form onSubmit={onSubmit} className="rounded-[2rem] border border-border bg-card p-7 shadow-soft sm:p-10">
              <Stepper step={step} />

              {step === 1 && (
                <div className="mt-8 space-y-8 animate-fade-in">
                  <Field label="Titre de la sortie" hint="Court et évocateur.">
                    <input
                      required
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      placeholder="Lever du soleil sur le Toubkal…"
                      className="input"
                    />
                  </Field>

                  <Field label="Terrain">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {categoryMeta.map((c) => {
                        const Icon = c.icon;
                        const active = form.category === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => set("category", c.id)}
                            className={`group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                              active
                                ? "border-forest bg-forest text-forest-foreground shadow-soft"
                                : "border-border bg-background hover:-translate-y-0.5 hover:border-terracotta"
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                active ? "bg-cream/15 text-cream" : "bg-forest/10 text-forest"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="font-serif text-lg font-bold">{c.id}</p>
                              <p className={`text-xs ${active ? "text-cream/80" : "text-muted-foreground"}`}>{c.blurb}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="mt-8 space-y-8 animate-fade-in">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Date & heure">
                      <input
                        required
                        type="datetime-local"
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                        className="input"
                      />
                    </Field>
                    <Field label="Nombre max" hint="Entre 2 et 20.">
                      <input
                        required
                        type="number"
                        min={2}
                        max={20}
                        value={form.maxParticipants}
                        onChange={(e) => set("maxParticipants", Number(e.target.value))}
                        className="input"
                      />
                    </Field>
                  </div>
                  <Field label="Point de rendez-vous">
                    <input
                      required
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="Imlil, parking du refuge…"
                      className="input"
                    />
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="mt-8 space-y-8 animate-fade-in">
                  <Field label="Description" hint="Rythme, ambiance, ce que tu proposes.">
                    <textarea
                      required
                      rows={6}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="On part à l'aube, mint tea à mi-parcours, retour tranquille en fin d'après-midi…"
                      className="input resize-none"
                    />
                  </Field>
                  <Field label="À apporter" hint="Un item par ligne.">
                    <textarea
                      rows={5}
                      value={form.whatToBring}
                      onChange={(e) => set("whatToBring", e.target.value)}
                      placeholder={"Chaussures de rando\n2L d'eau\nUne couche chaude"}
                      className="input resize-none"
                    />
                  </Field>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => ((s - 1) as Step))}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-terracotta hover:text-terracotta"
                  >
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3 text-sm font-semibold text-terracotta-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step < 3 ? (<>Continuer <ArrowRight className="h-4 w-4" /></>) : (<>Publier la sortie <Check className="h-4 w-4" /></>)}
                </button>
              </div>
            </form>

            {/* Live preview */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Aperçu live</p>
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-forest via-forest to-terracotta">
                  <div className="texture-grain absolute inset-0" />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-forest">
                    {form.category}
                  </span>
                  <div className="absolute inset-x-4 bottom-4 text-cream">
                    <p className="font-serif text-2xl font-bold leading-tight">
                      {form.title || "Ta prochaine aventure"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 p-5 text-sm">
                  <Row icon={MapPin} value={form.location || "Point de départ"} />
                  <Row icon={CalendarDays} value={dateLabel} capitalize />
                  <Row icon={Users} value={`Jusqu'à ${form.maxParticipants} personnes`} />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Cet aperçu est ce que verront les autres membres sur Explorer.
              </p>
            </aside>
          </div>
        )}
      </main>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.85rem 1rem;
          font: inherit;
          color: var(--color-foreground);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--color-terracotta);
          box-shadow: 0 0 0 4px color-mix(in oklch, var(--color-terracotta) 18%, transparent);
        }
      `}</style>

      <MobileNav />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const labels = ["L'essentiel", "Logistique", "Détails"];
  return (
    <ol className="flex items-center gap-3">
      {labels.map((l, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
        const active = step === n;
        return (
          <li key={l} className="flex flex-1 items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                done
                  ? "bg-forest text-forest-foreground"
                  : active
                  ? "bg-terracotta text-terracotta-foreground ring-4 ring-terracotta/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span className={`hidden text-xs font-semibold uppercase tracking-widest sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>
              {l}
            </span>
            {i < labels.length - 1 && <span className={`ml-2 h-px flex-1 ${done ? "bg-forest" : "bg-border"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Row({ icon: Icon, value, capitalize }: { icon: typeof MapPin; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-terracotta" />
      <span className={`truncate text-foreground ${capitalize ? "capitalize" : ""}`}>{value}</span>
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-12 text-center shadow-lift">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-forest-foreground shadow-soft">
        <Check className="h-7 w-7" />
      </div>
      <h2 className="mt-6 font-serif text-4xl font-bold">Ta sortie est en ligne.</h2>
      <p className="mt-3 text-muted-foreground">On t'emmène vers Explorer pour la voir…</p>
    </div>
  );
}
