import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { StoryCard } from "@/components/story-card";
import { SparkForm } from "@/components/spark-form";
import { CrisisBar } from "@/components/crisis-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_NAME, APP_SUBTITLE, APP_TAGLINE } from "@/lib/constants";
import { getDailySpark, listProfiles, listSparks } from "@/lib/server/community";
import { listStories } from "@/lib/server/stories";
import type { Profile, Spark, Story } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [stories, setStories] = useState<Story[] | null>(null);
  const [spark, setSpark] = useState<Spark | null>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);

  function load() {
    void listStories({ data: {} }).then(setStories);
    void getDailySpark().then(setSpark);
    void listSparks().then(setSparks);
    void listProfiles().then(setPeople);
  }

  useEffect(() => {
    load();
  }, []);

  const featured = stories?.slice(0, 3) ?? [];

  return (
    <div className="space-y-16">
      <section className="stagger-in grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_1.1fr]">
        <img
          src="/images/cover.jpg"
          alt="Aftermath: The Truth podcast mark — a microphone in red light"
          className="mx-auto w-full max-w-sm rounded-xl object-cover shadow-[0_0_80px_rgba(211,24,32,0.16)]"
        />
        <div>
          <p className="brand-kicker text-xs text-primary">{APP_SUBTITLE}</p>
          <h1 className="mt-3 font-display text-5xl tracking-[0.08em] uppercase sm:text-6xl">
            {APP_NAME}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">{APP_TAGLINE}</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            A judgment-free room for people in recovery to tell the mess, the near-misses, the
            turning points, and the life that came after. Proof that people make it out — and that
            their hard-won wisdom can reach the next person.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/stories">
                Open the stories
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/fighting">I am still fighting</Link>
            </Button>
          </div>
        </div>
      </section>

      <CrisisBar compact />

      <section>
        <p className="brand-kicker text-xs text-primary">Daily spark</p>
        <div className="mt-4 rounded-xl bg-card p-6 shadow-[var(--shadow-border)] sm:p-8">
          {spark ? (
            <>
              <blockquote className="font-display text-2xl leading-snug font-medium tracking-wide sm:text-3xl">
                {spark.body}
              </blockquote>
              <p className="mt-4 text-sm text-muted-foreground">— {spark.authorName}</p>
            </>
          ) : (
            <Skeleton className="h-24" />
          )}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="brand-kicker text-xs text-primary">Hope feed</p>
            <h2 className="mt-2 text-3xl tracking-wide uppercase">Stories that hit</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/stories">All stories</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stories === null
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-56 rounded-xl" />)
            : featured.map((s) => <StoryCard key={s.id} story={s} featured />)}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          to="/people"
          className="group overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]"
        >
          <img src="/images/story-window.jpg" alt="" className="h-36 w-full object-cover" />
          <div className="p-5">
            <h3 className="text-xl tracking-wide uppercase">I made it</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {people.length} people leaving a message, not a brand.
            </p>
          </div>
        </Link>
        <Link
          to="/memorial"
          className="group overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]"
        >
          <img src="/images/memorial-candle.jpg" alt="" className="h-36 w-full object-cover" />
          <div className="p-5">
            <h3 className="text-xl tracking-wide uppercase">Memorial</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We carry the ones we lost. A quiet place for their names.
            </p>
          </div>
        </Link>
        <Link
          to="/circles"
          className="group overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]"
        >
          <img src="/images/circles-chairs.jpg" alt="" className="h-36 w-full object-cover" />
          <div className="p-5">
            <h3 className="text-xl tracking-wide uppercase">Circles</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Small tables. Check in. No speeches required.
            </p>
          </div>
        </Link>
      </section>

      <section>
        <p className="brand-kicker text-xs text-primary">One-liners</p>
        <h2 className="mt-2 text-3xl tracking-wide uppercase">From the room</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {sparks.slice(0, 6).map((s) => (
            <li key={s.id} className="rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)]">
              <p className="text-sm leading-relaxed">{s.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">{s.authorName}</p>
            </li>
          ))}
        </ul>
      </section>

      <SparkForm onCreated={load} />
    </div>
  );
}
