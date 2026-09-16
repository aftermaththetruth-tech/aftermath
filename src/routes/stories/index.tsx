import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Chip } from "@/components/chip";
import { StoryCard } from "@/components/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RECOVERY_TIMES, SUBSTANCES, THEMES } from "@/lib/constants";
import { listStories } from "@/lib/server/stories";
import type { Story } from "@/lib/types";

export const Route = createFileRoute("/stories/")({ component: StoriesPage });

function StoriesPage() {
  const [stories, setStories] = useState<Story[] | null>(null);
  const [theme, setTheme] = useState("");
  const [tag, setTag] = useState("");
  const [recoveryTime, setRecoveryTime] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    void listStories({ data: {} }).then(setStories);
  }, []);

  const filtered = useMemo(() => {
    if (!stories) return [];
    const query = q.trim().toLowerCase();
    return stories.filter((s) => {
      if (theme && s.theme !== theme) return false;
      if (tag && !s.tags.includes(tag)) return false;
      if (recoveryTime && s.recoveryTime !== recoveryTime) return false;
      if (query) {
        const hay = `${s.title} ${s.body} ${s.authorName}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [stories, theme, tag, recoveryTime, q]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="brand-kicker text-xs text-primary">Library</p>
          <h1 className="mt-2 text-4xl tracking-wide uppercase">Stories</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Filter for what you need right now. Text or spoken. Real people, not a clinic pamphlet.
          </p>
        </div>
        <Button asChild>
          <Link to="/stories/new">
            <Plus />
            Share yours
          </Link>
        </Button>
      </div>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search titles and stories"
        aria-label="Search stories"
      />

      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!theme} onClick={() => setTheme("")}>
            All themes
          </Chip>
          {THEMES.map((t) => (
            <Chip key={t.id} active={theme === t.id} onClick={() => setTheme(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!tag} onClick={() => setTag("")}>
            Any
          </Chip>
          {SUBSTANCES.map((s) => (
            <Chip key={s.id} active={tag === s.id} onClick={() => setTag(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!recoveryTime} onClick={() => setRecoveryTime("")}>
            Any time
          </Chip>
          {RECOVERY_TIMES.map((t) => (
            <Chip key={t.id} active={recoveryTime === t.id} onClick={() => setRecoveryTime(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      {stories === null ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing in this filter yet. Try another tag.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      )}
    </div>
  );
}
