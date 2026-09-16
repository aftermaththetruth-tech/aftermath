import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Chip } from "@/components/chip";
import { RECOVERY_TIMES, SUBSTANCES, THEMES } from "@/lib/constants";
import { createStory } from "@/lib/server/stories";

export const Route = createFileRoute("/stories/new")({ component: NewStory });

function NewStory() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [theme, setTheme] = useState(THEMES[0].id);
  const [tags, setTags] = useState<string[]>([]);
  const [recoveryTime, setRecoveryTime] = useState(RECOVERY_TIMES[1].id);
  const [anon, setAnon] = useState(false);
  const [medium, setMedium] = useState<"text" | "voice">("text");
  const [busy, setBusy] = useState(false);

  if (isPending) return <div className="h-64 animate-pulse rounded-xl bg-secondary" />;
  if (!user) return <RedirectToSignIn />;

  function toggleTag(id: string) {
    setTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : prev.length < 4 ? [...prev, id] : prev));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const story = await createStory({
        data: {
          title,
          body,
          theme,
          tags,
          recoveryTime,
          isAnonymous: anon,
          medium,
          authorName: user.displayName ?? "Someone who made it",
        },
      });
      toast("It's in the library.");
      void navigate({ to: "/stories/$id", params: { id: story.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="brand-kicker text-xs text-primary">Speak</p>
        <h1 className="mt-2 text-4xl tracking-wide uppercase">Share a story</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Honest hope. No influencer polish. You can stay anonymous.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" required minLength={3} maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">The story</Label>
        <Textarea
          id="body"
          required
          minLength={40}
          maxLength={8000}
          className="min-h-48"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What happened. What you learned. What you'd tell someone still in it."
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Theme</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <Chip key={t.id} active={theme === t.id} onClick={() => setTheme(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">About</p>
        <div className="flex flex-wrap gap-2">
          {SUBSTANCES.map((s) => (
            <Chip key={s.id} active={tags.includes(s.id)} onClick={() => toggleTag(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Time in recovery</p>
        <div className="flex flex-wrap gap-2">
          {RECOVERY_TIMES.map((t) => (
            <Chip key={t.id} active={recoveryTime === t.id} onClick={() => setRecoveryTime(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <Switch checked={anon} onCheckedChange={setAnon} />
          Post anonymously
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <Switch
            checked={medium === "voice"}
            onCheckedChange={(v) => setMedium(v ? "voice" : "text")}
          />
          Mark as spoken
        </label>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Publishing…" : "Publish"}
      </Button>
    </form>
  );
}
