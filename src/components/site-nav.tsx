import { Link } from "@tanstack/react-router";
import { Mountain } from "lucide-react";

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const base = transparent
    ? "absolute top-0 left-0 right-0 z-30 text-cream"
    : "sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border text-foreground";

  const linkProps = {
    activeProps: { className: "text-terracotta" },
    inactiveProps: { className: "hover:text-terracotta transition-colors" },
  };

  return (
    <header className={base}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight">
          <Mountain className="h-6 w-6" strokeWidth={2.25} />
          <span>WildMeet</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/explore" {...linkProps}>Explore</Link>
          <Link to="/create" {...linkProps}>Host an outing</Link>
          <Link to="/profile" {...linkProps}>Profile</Link>
        </nav>
        <Link
          to="/explore"
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta-foreground shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lift"
        >
          Join an adventure
        </Link>
      </div>
    </header>
  );
}

export function MobileNav() {
  const linkProps = {
    activeProps: { className: "text-terracotta" },
    inactiveProps: { className: "text-foreground/70" },
  };
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-background/95 px-2 py-2 shadow-lift backdrop-blur md:hidden">
      <Link to="/explore" {...linkProps} className="rounded-full px-4 py-1.5 text-xs font-semibold">Explore</Link>
      <Link to="/create" {...linkProps} className="rounded-full px-4 py-1.5 text-xs font-semibold">Host</Link>
      <Link to="/profile" {...linkProps} className="rounded-full px-4 py-1.5 text-xs font-semibold">Profile</Link>
    </nav>
  );
}
