import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  checkIn,
  createCirclePost,
  getCircle,
  isCircleMember,
  joinCircle,
  listCheckins,
} from "@/lib/server/community";
import type { Circle, CirclePost } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

export const Route = createFileRoute("/circles/$id")({ component: CirclePage });

function CirclePage() {
  const { id } = Route.useParams();
  const { user } = useCurrentUserState();
  const [circle, setCircle] = useState<Circle | null | undefined>(undefined);
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [member, setMember] = useState(false);
  const [here, setHere] = useState(0);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    void getCircle({ data: id }).then((res) => {
      if (!res) {
        setCircle(null);
        return;
      }
      setCircle(res.circle);
      setPosts(res.posts);
    });
    void listCheckins({ data: id }).then((r) => setHere(r.last24h));
    if (user) {
      void isCircleMember({ data: id })
        .then((r) => setMember(r.member))
        .catch(() => setMember(false));
    }
  }, [id, user]);

  useEffect(() => {
    load();
  }, [load]);

  if (circle === undefined) return <Skeleton className="h-64 rounded-xl" />;
  if (!circle) return <p className="text-muted-foreground">That circle is not here.</p>;

  async function onJoin() {
    if (!user) return;
    await joinCircle({ data: id });
    toast("You're in.");
    load();
  }

  async function onCheckin() {
    if (!user) return;
    await checkIn({ data: { circleId: id, note: "here" } });
    toast("Checked in.");
    load();
  }

  async function onPost(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await createCirclePost({
        data: {
          circleId: id,
          body,
          authorName: user.displayName ?? "Someone here",
        },
      });
      setBody("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">
          <Link to="/circles" className="hover:text-foreground">
            Circles
          </Link>
          {" / "}
          {circle.stage} · {circle.focus}
        </p>
        <h1 className="mt-2 text-4xl tracking-wide uppercase">{circle.name}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{circle.description}</p>
        <p className="mt-3 text-sm">
          {circle.memberCount} members · {here} check-ins in the last day
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {user ? (
            <>
              {!member && (
                <Button type="button" onClick={() => void onJoin()}>
                  Join
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => void onCheckin()}>
                I'm here
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/login">Sign in to join</Link>
            </Button>
          )}
        </div>
      </header>

      {user && member && (
        <form onSubmit={onPost} className="space-y-3">
          <Textarea
            required
            minLength={2}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="A short check-in. No speeches."
          />
          <Button type="submit" disabled={busy}>
            {busy ? "Sending…" : "Post"}
          </Button>
        </form>
      )}

      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-sm">{p.body}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {p.authorName} · {formatRelative(p.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
