import { Link } from "@tanstack/react-router";
import { Compass, Home, LogOut, PlusCircle, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

function useNextSaturday() {
  const [state, setState] = useState({ days: 0, label: "Samedi" });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date(now);
      const day = now.getDay();
      const daysUntil = (6 - day + 7) % 7 || 7;
      target.setDate(now.getDate() + daysUntil);
      target.setHours(9, 0, 0, 0);
      const diff = target.getTime() - now.getTime();
      const days = Math.max(0, Math.ceil(diff / 86400000));
      const fmt = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "short" }).format(target);
      setState({ days, label: fmt });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return state;
}

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const { user } = useSession();
  const { days, label } = useNextSaturday();

  const wrap = transparent
    ? "absolute top-0 left-0 right-0 z-30"
    : "sticky top-0 z-30";

  const linkProps = {
    activeProps: { className: "text-terracotta [&_span]:opacity-100" },
    inactiveProps: { className: "text-foreground/70 hover:text-terracotta [&_span]:opacity-0 hover:[&_span]:opacity-100" },
  };
  const linkClass = "relative flex flex-col items-center gap-1 text-sm font-medium tracking-tight transition-colors";
  const linkDot = "h-1 w-1 rounded-full bg-terracotta transition-opacity";

  return (
    <header className={wrap}>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-8 sm:pt-12">
        <nav className="relative">
          {/* Top accent chip */}
          <div className="absolute -top-7 left-1/2 z-0 flex -translate-x-1/2 items-center gap-3 rounded-t-xl border border-b-0 border-forest/20 bg-forest px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cream whitespace-nowrap shadow-soft">
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sand opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sand"></span>
              </span>
              {days === 0 ? "Aujourd'hui" : `J−${days}`} avant l'aventure
            </span>
            <span className="opacity-30">|</span>
            <span className="hidden sm:inline">6 inconnus · 1 samedi</span>
          </div>

          {/* Main floating bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/85 px-4 py-3 shadow-lift backdrop-blur-xl sm:px-6">
            {/* Brand */}
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-terracotta-foreground shadow-soft transition-transform group-hover:-rotate-6">
                <span className="font-serif text-lg font-black leading-none">W</span>
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">WildMeet</span>
            </Link>

            {/* Center links */}
            <div className="hidden items-center gap-8 md:flex">
              <Link to="/explore" {...linkProps} className={linkClass}>
                Explorer<span className={linkDot} />
              </Link>
              <Link to="/create" {...linkProps} className={linkClass}>
                Organiser<span className={linkDot} />
              </Link>
              {user && (
                <Link to="/profile" {...linkProps} className={linkClass}>
                  Profil<span className={linkDot} />
                </Link>
              )}
            </div>

            {/* Right: departure info + CTA */}
            <div className="flex shrink-0 items-center gap-4 sm:gap-6">
              <div className="hidden flex-col text-right lg:flex">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Prochain départ</span>
                <span className="text-xs font-semibold capitalize text-foreground">{label}</span>
              </div>
              {user ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-forest-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sortir
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-bold text-terracotta-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
                >
                  Rejoindre
                </Link>
              )}
            </div>
          </div>

          {/* Ambient glow */}
          <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-r from-terracotta/10 via-transparent to-forest/10 opacity-60 blur-2xl" />
        </nav>
      </div>
    </header>
  );
}

export function MobileNav() {
  const { user } = useSession();
  const linkProps = {
    activeProps: { className: "text-terracotta bg-terracotta/10" },
    inactiveProps: { className: "text-foreground/70" },
  };
  const item = "flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors";
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-3xl border border-border bg-background/95 p-2 shadow-lift backdrop-blur md:hidden">
      <Link to="/" {...linkProps} className={item}><Home className="h-4 w-4" />Home</Link>
      <Link to="/explore" {...linkProps} className={item}><Compass className="h-4 w-4" />Explorer</Link>
      <Link to="/create" {...linkProps} className={item}><PlusCircle className="h-4 w-4" />Créer</Link>
      {user ? (
        <Link to="/profile" {...linkProps} className={item}><User className="h-4 w-4" />Profil</Link>
      ) : (
        <Link to="/auth" {...linkProps} className={item}><User className="h-4 w-4" />Login</Link>
      )}
    </nav>
  );
}
