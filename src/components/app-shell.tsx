import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, CircleDot, Flame, Home, Menu, Mic, Wrench } from "lucide-react";
import { AuthSlot } from "@/components/auth-slot";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_CREATOR, APP_CREATOR_ROLE, APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/stories", label: "Stories", icon: BookOpen },
  { to: "/fighting", label: "Still fighting", icon: Flame },
  { to: "/circles", label: "Circles", icon: CircleDot },
  { to: "/tools", label: "Tools", icon: Wrench },
] as const;

const MORE = [
  { to: "/people", label: "I made it" },
  { to: "/memorial", label: "Memorial" },
  { to: "/guidelines", label: "Guidelines" },
] as const;

function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/images/cover.jpg"
        alt=""
        className="size-8 rounded-sm object-cover"
      />
      <span className="leading-none">
        <span className="font-display block text-[15px] font-medium tracking-[0.18em] uppercase">
          {APP_NAME}
        </span>
        <span className="block text-[10px] tracking-[0.32em] text-primary uppercase">
          {APP_SUBTITLE}
        </span>
      </span>
    </Link>
  );
}

function NavLinks({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return (
    <>
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
      {MORE.map((item) => {
        const active = pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Wordmark />
          <nav className="ml-4 hidden items-center lg:flex">
            <NavLinks pathname={pathname} />
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <AuthSlot />
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  <NavLinks pathname={pathname} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-28 lg:pb-12">
        {children}
      </main>

      <footer className="hidden border-t border-border lg:block">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground">
          <p className="inline-flex items-center gap-2">
            <Mic className="size-3.5 text-primary" />
            If you are in immediate danger, call or text 988. You are not alone.
          </p>
          <div className="flex gap-4">
            <Link to="/guidelines" className="hover:text-foreground">
              Guidelines
            </Link>
            <Link to="/fighting" className="hover:text-foreground">
              Still fighting
            </Link>
            <a href="tel:988" className="hover:text-foreground">
              988
            </a>
            <span>
              {APP_CREATOR_ROLE} {APP_CREATOR}
            </span>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
