import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { recoveryLabel, substanceLabel } from "@/lib/constants";
import { listProfiles } from "@/lib/server/community";
import type { Profile } from "@/lib/types";

export const Route = createFileRoute("/people/")({ component: PeoplePage });

function PeoplePage() {
  const [people, setPeople] = useState<Profile[] | null>(null);

  useEffect(() => {
    void listProfiles().then(setPeople);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="brand-kicker text-xs text-primary">Profiles</p>
          <h1 className="mt-2 text-4xl tracking-wide uppercase">I made it</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Simple profiles. Recovery milestones and the message they want to leave behind. No
            polished influencer energy.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/people/me">Your profile</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {people === null
          ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)
          : people.map((p) => (
              <Link
                key={p.userId}
                to="/people/$id"
                params={{ id: p.userId }}
                className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]"
              >
                <p className="font-display text-2xl tracking-wide">{p.displayName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {recoveryLabel(p.timeInRecovery)}
                  {p.substances.length ? ` · ${p.substances.map(substanceLabel).join(", ")}` : ""}
                </p>
                <p className="mt-3 text-sm leading-relaxed">{p.message}</p>
                <p className="mt-4 text-xs text-muted-foreground">{p.storyCount} stories</p>
              </Link>
            ))}
      </div>
    </div>
  );
}
