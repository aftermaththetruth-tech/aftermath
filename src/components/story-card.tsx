import { Link } from "@tanstack/react-router";
import { AudioLines } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { recoveryLabel, substanceLabel, themeLabel } from "@/lib/constants";
import type { Story } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

export function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  return (
    <Link
      to="/stories/$id"
      params={{ id: story.id }}
      className="group block rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {story.medium === "voice" && (
          <span className="inline-flex items-center gap-1 text-primary">
            <AudioLines className="size-3.5" />
            Spoken
          </span>
        )}
        <Badge variant="secondary">{themeLabel(story.theme)}</Badge>
        {story.tags.slice(0, 2).map((tag) => (
          <span key={tag}>{substanceLabel(tag)}</span>
        ))}
        <span className="ml-auto tabular-nums">{formatRelative(story.createdAt)}</span>
      </div>
      <h3
        className={`mt-3 font-display font-medium tracking-tight group-hover:text-primary ${featured ? "text-2xl" : "text-xl"}`}
      >
        {story.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {story.body}
      </p>
      <p className="mt-4 text-sm">
        {story.authorName}
        <span className="text-muted-foreground">
          {" "}
          · {recoveryLabel(story.recoveryTime)}
        </span>
        <span className="ml-3 tabular-nums text-muted-foreground">
          {story.sparkVotes} this hit
        </span>
      </p>
    </Link>
  );
}
