import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Flag, Heart } from "lucide-react";
import { ListenButton } from "@/components/listen-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { recoveryLabel, substanceLabel, themeLabel } from "@/lib/constants";
import { reportContent } from "@/lib/server/community";
import { deleteStory, getStory, voteStory } from "@/lib/server/stories";
import type { Story } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/stories/$id")({ component: StoryPage });

function StoryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const [story, setStory] = useState<Story | null | undefined>(undefined);
  const [votes, setVotes] = useState(0);

  useEffect(() => {
    void getStory({ data: id }).then((s) => {
      setStory(s);
      setVotes(s?.sparkVotes ?? 0);
    });
  }, [id]);

  if (story === undefined) {
    return <Skeleton className="h-96 rounded-xl" />;
  }
  if (!story) {
    return <p className="text-muted-foreground">This story is gone.</p>;
  }

  const own = user?.id === story.userId;

  async function onVote() {
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    try {
      const res = await voteStory({ data: story.id });
      setVotes(res.votes);
    } catch {
      toast.error("Could not record that");
    }
  }

  async function onReport() {
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    try {
      await reportContent({
        data: { targetType: "story", targetId: story.id, reason: "flagged from story page" },
      });
      toast("Thanks. A moderator will look at this.");
    } catch {
      toast.error("Could not send the report");
    }
  }

  async function onDelete() {
    await deleteStory({ data: story.id });
    toast("Removed.");
    void navigate({ to: "/stories" });
  }

  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-sm text-muted-foreground">
        <Link to="/stories" className="hover:text-foreground">
          Stories
        </Link>
        <span> / {themeLabel(story.theme)}</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{themeLabel(story.theme)}</Badge>
        {story.tags.map((t) => (
          <Badge key={t} variant="secondary">
            {substanceLabel(t)}
          </Badge>
        ))}
        {story.medium === "voice" && <Badge variant="outline">Spoken</Badge>}
      </div>
      <h1 className="mt-4 text-4xl tracking-wide">{story.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {story.isAnonymous ? (
          story.authorName
        ) : (
          <Link to="/people/$id" params={{ id: story.userId }} className="hover:text-foreground">
            {story.authorName}
          </Link>
        )}
        {" · "}
        {recoveryLabel(story.recoveryTime)}
        {" · "}
        {formatDate(story.createdAt)}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <ListenButton text={`${story.title}. ${story.body}`} label="Listen to this" />
        <Button type="button" variant="outline" onClick={() => void onVote()}>
          <Heart className="size-4" />
          This hit · {votes}
        </Button>
        <Button type="button" variant="ghost" onClick={() => void onReport()}>
          <Flag className="size-4" />
          Report
        </Button>
        {own && (
          <Button type="button" variant="ghost" onClick={() => void onDelete()}>
            Delete
          </Button>
        )}
      </div>
      <div className="mt-8 space-y-4 text-base leading-relaxed whitespace-pre-wrap">
        {story.body}
      </div>
    </article>
  );
}
