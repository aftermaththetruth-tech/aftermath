import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guidelines")({ component: GuidelinesPage });

function GuidelinesPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <p className="brand-kicker text-xs text-primary">House rules</p>
      <h1 className="text-4xl tracking-wide uppercase">Guidelines</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Aftermath is a peer space. It is not treatment, not a crisis line, and not a place to
        perform recovery. We keep it safe so people can tell the truth.
      </p>
      <ul className="space-y-4 text-sm leading-relaxed">
        <li>
          <strong className="text-foreground">No advice you did not live.</strong> Speak from your
          own story. If you did not walk it, do not prescribe it.
        </li>
        <li>
          <strong className="text-foreground">No graphic how-to.</strong> You can name what happened.
          Do not include methods, sources, or instructions for using.
        </li>
        <li>
          <strong className="text-foreground">No recruiting, selling, or pitching.</strong> No
          programs, supplements, or DMs for hire.
        </li>
        <li>
          <strong className="text-foreground">Anonymity is a right.</strong> Do not try to unmask
          anyone. Do not screenshot private circles.
        </li>
        <li>
          <strong className="text-foreground">Memorial stays quiet.</strong> No debate under a name.
          If a tribute is yours and you need it down, say so.
        </li>
        <li>
          <strong className="text-foreground">Report what does not belong.</strong> Harassment,
          bigotry, and predatory behavior get people removed.
        </li>
      </ul>
      <p className="text-sm text-muted-foreground">
        If you are in immediate danger, call or text 988. Aftermath cannot replace that call.
      </p>
    </article>
  );
}
