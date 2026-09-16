import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { listCircles } from "@/lib/server/community";
import type { Circle } from "@/lib/types";

export const Route = createFileRoute("/circles/")({ component: CirclesPage });

function CirclesPage() {
  const [circles, setCircles] = useState<Circle[] | null>(null);

  useEffect(() => {
    void listCircles().then(setCircles);
  }, []);

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
        <img
          src="/images/circles-chairs.jpg"
          alt="A circle of empty chairs in morning light"
          className="h-52 w-full object-cover"
        />
        <div className="p-6">
          <p className="brand-kicker text-xs text-primary">Peer support</p>
          <h1 className="mt-2 text-4xl tracking-wide uppercase">Circles</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Small groups by stage or type. Join, check in, write a line. No live studio required —
            showing up in text counts.
          </p>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {circles === null
          ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)
          : circles.map((c) => (
              <Link
                key={c.id}
                to="/circles/$id"
                params={{ id: c.id }}
                className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
              >
                <p className="text-xs tracking-wide text-primary uppercase">
                  {c.stage} · {c.focus}
                </p>
                <h2 className="mt-2 text-2xl tracking-wide">{c.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {c.memberCount} members · {c.postCount} notes
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
}
