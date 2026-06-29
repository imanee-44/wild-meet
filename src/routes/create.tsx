import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { SiteNav, MobileNav } from "@/components/site-nav";
import type { Category } from "@/lib/mock-data";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Host an outing — WildMeet" },
      { name: "description", content: "Plan a camping, beach or mountain outing and invite the WildMeet community to join you." },
      { property: "og:title", content: "Host an outing — WildMeet" },
      { property: "og:description", content: "Share your next adventure with the WildMeet community." },
    ],
  }),
  component: CreateOuting,
});

const categories: Category[] = ["Beach", "Mountain", "Camping"];

function CreateOuting() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Camping" as Category,
    date: "",
    location: "",
    maxParticipants: 6,
    description: "",
    whatToBring: "",
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate({ to: "/explore" }), 1600);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">Host an outing</p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Plan it. Invite your tribe.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Tell us where you're heading and we'll help the right people find you.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 pb-32 sm:px-8 sm:py-16">
        {submitted ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-forest-foreground">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="mt-6 font-serif text-3xl font-bold">Your outing is live</h2>
            <p className="mt-3 text-muted-foreground">Taking you to Explore so you can see it…</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-8 rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Sunrise summit push, slow lake weekend…"
                className="input"
              />
            </Field>

            <Field label="Category">
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, category: c })}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      form.category === c
                        ? "border-forest bg-forest text-forest-foreground"
                        : "border-border bg-background hover:border-terracotta"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Date & time">
                <input
                  required
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Max participants">
                <input
                  required
                  type="number"
                  min={2}
                  max={50}
                  value={form.maxParticipants}
                  onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
                  className="input"
                />
              </Field>
            </div>

            <Field label="Location">
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Pine Valley, North Trailhead…"
                className="input"
              />
            </Field>

            <Field label="Description">
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Pace, plan, vibe. What kind of day is this?"
                className="input resize-none"
              />
            </Field>

            <Field label="What to bring" hint="One item per line">
              <textarea
                rows={4}
                value={form.whatToBring}
                onChange={(e) => setForm({ ...form, whatToBring: e.target.value })}
                placeholder={"Hiking shoes\n2L water\nLayer for evening"}
                className="input resize-none"
              />
            </Field>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-terracotta-foreground shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lift sm:w-auto"
            >
              Publish outing
            </button>
          </form>
        )}
      </main>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.875rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.75rem 1rem;
          font: inherit;
          color: var(--color-foreground);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--color-ring);
          box-shadow: 0 0 0 4px color-mix(in oklch, var(--color-ring) 18%, transparent);
        }
      `}</style>

      <MobileNav />
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
