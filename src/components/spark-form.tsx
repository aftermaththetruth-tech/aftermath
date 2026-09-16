import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createSpark } from "@/lib/server/community";
import { SignInPrompt } from "@/components/sign-in-prompt";

export function SparkForm({ onCreated }: { onCreated?: () => void }) {
  const { user, isPending } = useCurrentUserState();
  const [body, setBody] = useState("");
  const [anon, setAnon] = useState(true);
  const [busy, setBusy] = useState(false);

  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-secondary" />;

  if (!user) {
    return (
      <SignInPrompt
        title="Leave a message for someone still fighting"
        body="Sign in to send a short line. You can keep it anonymous."
      />
    );
  }

  const authorName = user.displayName ?? "Someone still here";

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createSpark({
        data: {
          body,
          isAnonymous: anon,
          authorName,
        },
      });
      setBody("");
      toast("Sent. Someone will need that.");
      onCreated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <h2 className="font-display text-xl font-medium">A message for someone still fighting</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        One or two lines. No advice unless you lived it.
      </p>
      <Textarea
        className="mt-4"
        required
        minLength={8}
        maxLength={180}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What do you wish someone had said to you?"
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <Switch checked={anon} onCheckedChange={setAnon} />
          Send anonymously
        </label>
        <Button type="submit" disabled={busy || body.trim().length < 8}>
          {busy ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
