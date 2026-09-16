import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StoryCard } from "@/components/story-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { recoveryLabel, substanceLabel } from "@/lib/constants";
import { getProfile } from "@/lib/server/community";
import { listStoriesByUser } from "@/lib/server/stories";
import type { Profile, Story } from "@/lib/types";

export const Route = createFileRoute("/people/$id")({ component: ProfilePage });

function ProfilePage() {
  const { id } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    void getProfile({ data: id }).then(setProfile);
    void listStoriesByUser({ data: id }).then(setStories);
  }, [id]);

  if (profile === undefined) return <Skeleton className="h-64 rounded-xl" />;
  if (!profile) {
    return (
      <p className="text-muted-foreground">
        This profile is private or does not exist.{" "}
        <Link to="/people" className="underline">
          Back to people
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
        <p className="brand-kicker text-xs text-primary">I made it</p>
        <h1 className="mt-2 text-4xl tracking-wide">{profile.displayName}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{recoveryLabel(profile.timeInRecovery)}</Badge>
          {profile.substances.map((s) => (
            <Badge key={s} variant="secondary">
              {substanceLabel(s)}
            </Badge>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{profile.message}</p>
        {profile.milestoneNote && (
          <p className="mt-3 text-sm text-muted-foreground">{profile.milestoneNote}</p>
        )}
      </header>
      <section>
        <h2 className="text-2xl tracking-wide uppercase">Stories</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {stories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
          {stories.length === 0 && (
            <p className="text-sm text-muted-foreground">No public stories yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
