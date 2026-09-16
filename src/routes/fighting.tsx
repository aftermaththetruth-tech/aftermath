import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CrisisBar } from "@/components/crisis-bar";
import { SparkForm } from "@/components/spark-form";
import { Button } from "@/components/ui/button";
import { CRISIS_RESOURCES, GROUNDING, MEETING_FINDERS } from "@/lib/constants";
import { getDailySpark, listSparks } from "@/lib/server/community";
import type { Spark } from "@/lib/types";

export const Route = createFileRoute("/fighting")({ component: FightingPage });

function FightingPage() {
  const [spark, setSpark] = useState<Spark | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [technique, setTechnique] = useState(GROUNDING[0]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    void getDailySpark().then(setSpark);
    void listSparks().then(setSparks);
  }, []);

  return (
    <div className="space-y-10">
      <header className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
        <img
          src="/images/fighting-path.jpg"
          alt="A path through fog toward a faint light"
          className="h-52 w-full object-cover sm:h-64"
        />
        <div className="p-6">
          <p className="brand-kicker text-xs text-primary">No pressure to post</p>
          <h1 className="mt-2 text-4xl tracking-wide uppercase">Still fighting</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            If you are not in recovery yet, or you just got here: this page is slower on purpose.
            Short reads. A place to sit. Direct help. You do not have to tell a story today.
          </p>
        </div>
      </header>

      <CrisisBar />

      <section className="grid gap-3 sm:grid-cols-2">
        {CRISIS_RESOURCES.map((r) => (
          <a
            key={r.name}
            href={r.href}
            className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] hover:shadow-[var(--shadow-border-hover)]"
          >
            <p className="font-medium">{r.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
            <p className="mt-3 text-sm text-primary">{r.action}</p>
          </a>
        ))}
      </section>

      {spark && (
        <section className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
          <p className="brand-kicker text-xs text-primary">For you, today</p>
          <p className="mt-3 font-display text-2xl leading-snug">{spark.body}</p>
        </section>
      )}

      <section>
        <h2 className="text-2xl tracking-wide uppercase">If the urge is here</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {GROUNDING.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setTechnique(g);
                setStep(0);
              }}
              className={`h-11 rounded-full px-4 text-sm ${technique.id === g.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <p className="text-sm text-muted-foreground">{technique.summary}</p>
          {technique.id === "box" ? (
            <BoxBreath />
          ) : (
            <>
              <p className="mt-4 text-lg">{technique.steps[step]}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep((s) => Math.min(technique.steps.length - 1, s + 1))}
                  disabled={step === technique.steps.length - 1}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl tracking-wide uppercase">Short reads</h2>
        <ul className="mt-4 space-y-3">
          {sparks.slice(0, 8).map((s) => (
            <li key={s.id} className="rounded-xl bg-card px-5 py-4 text-sm shadow-[var(--shadow-border)]">
              {s.body}
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/stories">If you want a longer story</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl tracking-wide uppercase">Meetings and treatment</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {MEETING_FINDERS.map((m) => (
            <li key={m.name}>
              <a href={m.href} className="text-primary underline-offset-4 hover:underline">
                {m.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SparkForm />
    </div>
  );
}

function BoxBreath() {
  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="grid size-36 place-items-center rounded-full bg-primary/15">
        <div className="size-20 rounded-full bg-primary/80 [animation:breathe_16s_ease-in-out_infinite]" />
      </div>
      <p className="text-sm text-muted-foreground">In 4 · hold 4 · out 4 · hold 4. Four rounds.</p>
    </div>
  );
}
