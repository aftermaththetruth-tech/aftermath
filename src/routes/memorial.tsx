import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createTribute, listTributes } from "@/lib/server/community";
import type { Tribute } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/memorial")({ component: MemorialPage });

function MemorialPage() {
  const { user } = useCurrentUserState();
  const [tributes, setTributes] = useState<Tribute[] | null>(null);
  const [honoreeName, setHonoreeName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [years, setYears] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    void listTributes().then(setTributes);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await createTribute({ data: { honoreeName, relationship, years, body } });
      setHonoreeName("");
      setRelationship("");
      setYears("");
      setBody("");
      toast("It's here. We carry them.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
        <img
          src="/images/memorial-candle.jpg"
          alt="A single candle in a dark room"
          className="h-56 w-full object-cover sm:h-72"
        />
        <div className="p-6">
          <p className="brand-kicker text-xs text-primary">Quiet room</p>
          <h1 className="mt-2 text-4xl tracking-wide uppercase">Memorial</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            For the people who did not get another day. Names, notes, the ordinary things that made
            them themselves. This space stays quiet on purpose.
          </p>
        </div>
      </header>

      <ul className="space-y-4">
        {tributes?.map((t) => (
          <li key={t.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="font-display text-2xl tracking-wide">{t.honoreeName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {[t.relationship, t.years, formatDate(t.createdAt)].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{t.body}</p>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-xl tracking-wide uppercase">Leave a note</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="honoree">Name</Label>
              <Input
                id="honoree"
                required
                value={honoreeName}
                onChange={(e) => setHonoreeName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rel">Relationship</Label>
              <Input
                id="rel"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Brother, friend from the rooms"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="years">Years</Label>
            <Input
              id="years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="1991–2019"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              required
              minLength={20}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Leave this here"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="underline">
            Sign in
          </Link>{" "}
          to leave a tribute.
        </p>
      )}
    </div>
  );
}
