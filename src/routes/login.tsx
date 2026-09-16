import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_CREATOR, APP_CREATOR_ROLE, APP_NAME, APP_SUBTITLE, APP_TAGLINE } from "@/lib/constants";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Member",
          callbackURL: "/",
        });
        if (res.error) throw new Error(res.error.message || "Could not create account");
      } else {
        const res = await authClient.signIn.email({ email, password, callbackURL: "/" });
        if (res.error) throw new Error(res.error.message || "Could not sign in");
      }
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(211,24,32,0.18),transparent_55%)]" />
      <div className="relative mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
        <div className="hidden justify-center lg:flex">
          <img
            src="/images/cover.jpg"
            alt="Aftermath: The Truth"
            className="w-full max-w-md rounded-xl object-cover shadow-[0_0_80px_rgba(211,24,32,0.18)]"
          />
        </div>
        <div>
          <Link to="/" className="mb-8 flex items-center gap-3">
            <img src="/images/cover.jpg" alt="" className="size-12 rounded-md object-cover lg:hidden" />
            <span>
              <span className="font-display block text-2xl tracking-[0.18em] uppercase">{APP_NAME}</span>
              <span className="brand-kicker text-[11px] text-primary">{APP_SUBTITLE}</span>
            </span>
          </Link>
          <h1 className="font-display text-4xl tracking-wide uppercase">{APP_TAGLINE}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sign in to share a story, keep a private log, or join a circle. You can still read
            everything without an account.
          </p>

          {authEnabled ? (
            <div className="mt-8 space-y-3">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                >
                  Continue with {p.label}
                </Button>
              ))}

              <div className="flex items-center gap-3 py-2 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or email
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={onEmail} className="space-y-3">
                {mode === "up" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name or alias</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should we call you?"
                      autoComplete="nickname"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in with email"}
                </Button>
              </form>
              <button
                type="button"
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setMode(mode === "up" ? "in" : "up");
                  setError(null);
                }}
              >
                {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
              </button>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            Aftermath is a peer space, not treatment. If you are in crisis, call or text{" "}
            <a href="tel:988" className="underline">
              988
            </a>
            .
          </p>
          <p className="mt-3 text-xs tracking-wide text-muted-foreground">
            {APP_CREATOR_ROLE} {APP_CREATOR}
          </p>
        </div>
      </div>
    </main>
  );
}
