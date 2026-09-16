import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function SignInPrompt({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
      <h2 className="font-display text-xl font-medium">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Button asChild className="mt-4">
        <Link to="/login">Sign in to continue</Link>
      </Button>
    </div>
  );
}
