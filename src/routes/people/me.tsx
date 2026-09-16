import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Chip } from "@/components/chip";
import { RECOVERY_TIMES, SUBSTANCES } from "@/lib/constants";
import { getMyProfile, upsertProfile } from "@/lib/server/community";

export const Route = createFileRoute("/people/me")({ component: MyProfile });

function MyProfile() {
  const { user, isPending } = useCurrentUserState();
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [milestoneNote, setMilestoneNote] = useState("");
  const [timeInRecovery, setTimeInRecovery] = useState(RECOVERY_TIMES[0].id);
  const [substances, setSubstances] = useState<string[]>([]);
  const [anon, setAnon] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName((d) => d || user.displayName || "");
    void getMyProfile().then((p) => {
      if (p) {
        setDisplayName(p.displayName);
        setMessage(p.message);
        setMilestoneNote(p.milestoneNote);
        setTimeInRecovery(p.timeInRecovery || RECOVERY_TIMES[0].id);
        setSubstances(p.substances);
        setAnon(p.isAnonymous);
      }
      setLoaded(true);
    });
  }, [user]);

  if (isPending || (user && !loaded)) {
    return <div className="h-64 animate-pulse rounded-xl bg-secondary" />;
  }
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await upsertProfile({
        data: {
          displayName,
          isAnonymous: anon,
          message,
          timeInRecovery,
          substances,
          milestoneNote,
        },
      });
      toast(anon ? "Saved privately." : "Profile is live.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="brand-kicker text-xs text-primary">You</p>
        <h1 className="mt-2 text-4xl tracking-wide uppercase">Your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Optional anonymity. If you hide the profile, your public stories can still stand on their
          own.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Name or alias</Label>
        <Input
          id="displayName"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">The message you want to leave</Label>
        <Textarea
          id="message"
          required
          minLength={8}
          maxLength={280}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="milestone">Milestone note</Label>
        <Input
          id="milestone"
          maxLength={280}
          value={milestoneNote}
          onChange={(e) => setMilestoneNote(e.target.value)}
          placeholder="Six years. Still a person, not a project."
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Time in recovery</p>
        <div className="flex flex-wrap gap-2">
          {RECOVERY_TIMES.map((t) => (
            <Chip key={t.id} active={timeInRecovery === t.id} onClick={() => setTimeInRecovery(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">About</p>
        <div className="flex flex-wrap gap-2">
          {SUBSTANCES.map((s) => (
            <Chip
              key={s.id}
              active={substances.includes(s.id)}
              onClick={() =>
                setSubstances((prev) =>
                  prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                )
              }
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <Switch checked={anon} onCheckedChange={setAnon} />
        Hide this profile from the directory
      </label>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
