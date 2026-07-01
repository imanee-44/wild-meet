import { Link } from "@tanstack/react-router";
import { Compass, Home, PlusCircle, User } from "lucide-react";

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const base = transparent
    ? "absolute top-0 left-0 right-0 z-30 text-cream"
    : "sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border text-foreground";

  const linkProps = {
    activeProps: { className: "text-terracotta" },
    inactiveProps: { className: "hover:text-terracotta transition-colors" },
  };

  return (
    <header className={base}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5 font-serif text-2xl font-bold tracking-tight">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta text-terracotta-foreground shadow-soft transition-transform group-hover:-rotate-6">
            <span className="font-serif text-lg font-black leading-none">W</span>
          </span>
          <span>WildMeet</span>
        </Link>
        <nav className="hidden items-center gap-9 text-sm font-medium md:flex">
          <Link to="/explore" {...linkProps}>Explorer</Link>
          <Link to="/create" {...linkProps}>Organiser</Link>
          <Link to="/profile" {...linkProps}>Profil</Link>
        </nav>
        <Link
          to="/explore"
          className="hidden rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:inline-flex"
        >
          Rejoindre
        </Link>
      </div>
    </header>
  );
}

export function MobileNav() {
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
      <Link to="/profile" {...linkProps} className={item}><User className="h-4 w-4" />Profil</Link>
    </nav>
  );
}
