import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Rejoindre WildMeet" },
      { name: "description", content: "Crée ton compte WildMeet ou connecte-toi pour rejoindre les prochaines sorties au Maroc." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { name: name || email.split("@")[0] }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/explore" });
    } catch (e: any) {
      setErr(e.message ?? "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setErr(null);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) setErr(res.error.message ?? "Google sign-in failed.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-0 lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-forest text-cream lg:block">
          <div className="texture-grain absolute inset-0 bg-gradient-to-br from-forest via-forest to-terracotta" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/80 hover:text-cream">
              <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sand">WildMeet</p>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.05]">
                Six inconnus.<br/>Une <span className="italic text-sand">échappée</span>.
              </h1>
              <p className="mt-6 max-w-sm text-cream/85">
                Crée ton compte pour rejoindre les prochaines sorties au Maroc — Imsouane, Taghazout, l'Atlas.
              </p>
            </div>
            <p className="text-xs text-cream/60">© {new Date().getFullYear()} WildMeet</p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-16 sm:px-10">
          <div className="w-full max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-terracotta">
              {mode === "signup" ? "Nouveau membre" : "Bon retour"}
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight">
              {mode === "signup" ? "Rejoindre WildMeet" : "Se connecter"}
            </h2>

            <button
              onClick={google}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-terracotta hover:text-terracotta"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continuer avec Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <input
                  required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ton prénom" className="input"
                />
              )}
              <input
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@wildmeet.com" className="input"
              />
              <input
                required type="password" minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe (6+ caractères)"
                className="input"
              />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button
                type="submit" disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-terracotta-foreground shadow-soft transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>{mode === "signup" ? "Créer mon compte" : "Se connecter"} <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Déjà membre ?" : "Nouveau ici ?"}{" "}
              <button
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="font-semibold text-forest hover:text-terracotta"
              >
                {mode === "signup" ? "Se connecter" : "Créer un compte"}
              </button>
            </p>
          </div>
        </main>
      </div>

      <style>{`
        .input { width:100%; border-radius:1rem; border:1px solid var(--color-border); background:var(--color-background); padding:.85rem 1rem; font:inherit; color:var(--color-foreground); outline:none; transition:border-color .15s, box-shadow .15s; }
        .input:focus { border-color: var(--color-terracotta); box-shadow: 0 0 0 4px color-mix(in oklch, var(--color-terracotta) 18%, transparent); }
      `}</style>
    </div>
  );
}
