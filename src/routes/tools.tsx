import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Chip } from "@/components/chip";
import { CRISIS_RESOURCES, GROUNDING, MEETING_FINDERS } from "@/lib/constants";
import {
  addMilestone,
  addUrge,
  deleteMilestone,
  exportTimeline,
  getRecoveryStart,
  listMilestones,
  listUrges,
  setRecoveryStart,
} from "@/lib/server/tools";
import type { Milestone, UrgeLog } from "@/lib/types";
import { daysBetween, formatDate } from "@/lib/utils";

export const Route = createFileRoute("/tools")({ component: ToolsPage });

function ToolsPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-64 animate-pulse rounded-xl bg-secondary" />;
  if (!user) {
    return (
      <div className="space-y-6">
        <Header />
        <p className="text-sm text-muted-foreground">
          Milestone tracking, the urge log, and your timeline stay private to your account.
        </p>
        <RedirectToSignIn />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <Header />
      <Tabs defaultValue="days">
        <TabsList className="h-auto w-full flex-wrap">
          <TabsTrigger value="days">Days</TabsTrigger>
          <TabsTrigger value="urges">Urge log</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="days">
          <DaysPanel />
        </TabsContent>
        <TabsContent value="urges">
          <UrgePanel />
        </TabsContent>
        <TabsContent value="resources">
          <ResourcesPanel />
        </TabsContent>
        <TabsContent value="timeline">
          <TimelinePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Header() {
  return (
    <header className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
      <img src="/images/tools-journal.jpg" alt="" className="h-44 w-full object-cover" />
      <div className="p-6">
        <p className="brand-kicker text-xs text-primary">Private</p>
        <h1 className="mt-2 text-4xl tracking-wide uppercase">Tools</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Things that actually help: a day count, an urge log with grounding, a resource list, and a
          timeline you can export.
        </p>
      </div>
    </header>
  );
}

function DaysPanel() {
  const [startedOn, setStartedOn] = useState("");
  const [draft, setDraft] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [label, setLabel] = useState("");
  const [occurredOn, setOccurredOn] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    void getRecoveryStart().then((s) => {
      if (s) {
        setStartedOn(s.startedOn);
        setDraft(s.startedOn);
      }
    });
    void listMilestones().then(setMilestones);
  }, []);

  const days = startedOn ? daysBetween(startedOn) : 0;

  async function saveStart(e: FormEvent) {
    e.preventDefault();
    const res = await setRecoveryStart({ data: draft });
    setStartedOn(res.startedOn);
    toast("Day one saved.");
  }

  async function saveMilestone(e: FormEvent) {
    e.preventDefault();
    const m = await addMilestone({ data: { label, occurredOn, note } });
    setMilestones((prev) => [m, ...prev]);
    setLabel("");
    setOccurredOn("");
    setNote("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-card p-6 text-center shadow-[var(--shadow-border)]">
        <p className="text-sm text-muted-foreground">Days since day one</p>
        <p className="mt-2 font-display text-6xl tabular-nums tracking-wide">{days}</p>
      </div>
      <form onSubmit={saveStart} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start">Day one</Label>
          <Input id="start" type="date" required value={draft} onChange={(e) => setDraft(e.target.value)} />
        </div>
        <Button type="submit">Save</Button>
      </form>
      <form onSubmit={saveMilestone} className="space-y-3 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-xl tracking-wide uppercase">Add a milestone</h2>
        <Input required placeholder="90 days, first apology, first job" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Input type="date" required value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} />
        <Textarea placeholder="Optional note" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {milestones.map((m) => (
          <li key={m.id} className="flex items-start justify-between gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div>
              <p className="font-medium">{m.label}</p>
              <p className="text-xs text-muted-foreground">{formatDate(m.occurredOn)}</p>
              {m.note && <p className="mt-1 text-sm text-muted-foreground">{m.note}</p>}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void deleteMilestone({ data: m.id }).then(() =>
                  setMilestones((prev) => prev.filter((x) => x.id !== m.id)),
                );
              }}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UrgePanel() {
  const [logs, setLogs] = useState<UrgeLog[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState("");
  const [technique, setTechnique] = useState(GROUNDING[0].id);
  const [note, setNote] = useState("");
  const active = GROUNDING.find((g) => g.id === technique) ?? GROUNDING[0];

  useEffect(() => {
    void listUrges().then(setLogs);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const row = await addUrge({ data: { intensity, trigger, technique, note } });
    setLogs((prev) => [row, ...prev]);
    setNote("");
    toast("Logged. You stayed.");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-xl tracking-wide uppercase">Log an urge</h2>
        <div>
          <Label>Intensity {intensity}/10</Label>
          <input
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
          <Progress value={intensity * 10} className="mt-2" />
        </div>
        <Input placeholder="What set it off? (optional)" value={trigger} onChange={(e) => setTrigger(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {GROUNDING.map((g) => (
            <Chip key={g.id} active={technique === g.id} onClick={() => setTechnique(g.id)}>
              {g.label}
            </Chip>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{active.summary}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {active.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        {active.id === "box" && (
          <div className="grid size-28 place-items-center rounded-full bg-primary/15">
            <div className="size-16 rounded-full bg-primary/80 [animation:breathe_16s_ease-in-out_infinite]" />
          </div>
        )}
        <Textarea placeholder="What you did instead" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button type="submit">Log it</Button>
      </form>
      <ul className="space-y-2">
        {logs.map((l) => (
          <li key={l.id} className="rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]">
            <p className="tabular-nums">
              {l.intensity}/10 · {l.technique || "no technique"} · {formatDate(l.createdAt)}
            </p>
            {l.trigger && <p className="mt-1 text-muted-foreground">{l.trigger}</p>}
            {l.note && <p className="mt-1">{l.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResourcesPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {CRISIS_RESOURCES.map((r) => (
        <a key={r.name} href={r.href} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <p className="font-medium">{r.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
        </a>
      ))}
      <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] md:col-span-2">
        <p className="font-medium">Find a meeting</p>
        <ul className="mt-3 space-y-2 text-sm">
          {MEETING_FINDERS.map((m) => (
            <li key={m.name}>
              <a href={m.href} className="text-primary underline-offset-4 hover:underline">
                {m.name}
              </a>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/fighting">Open Still Fighting</Link>
        </Button>
      </div>
    </div>
  );
}

function TimelinePanel() {
  const [data, setData] = useState<Awaited<ReturnType<typeof exportTimeline>> | null>(null);

  useEffect(() => {
    void exportTimeline().then(setData);
  }, []);

  const text = useMemo(() => {
    if (!data) return "";
    const lines = ["Aftermath — personal recovery timeline", ""];
    if (data.startedOn) lines.push(`Day one: ${data.startedOn}`);
    lines.push("", "Milestones:");
    for (const m of data.milestones) {
      lines.push(`- ${m.occurredOn} — ${m.label}${m.note ? `. ${m.note}` : ""}`);
    }
    lines.push("", "Stories:");
    for (const s of data.stories) {
      lines.push(`- ${s.createdAt.slice(0, 10)} — ${s.title}`);
    }
    return lines.join("\n");
  }, [data]);

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aftermath-timeline.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <pre className="overflow-auto rounded-xl bg-card p-5 text-sm whitespace-pre-wrap shadow-[var(--shadow-border)]">
        {text || "Add a day one or a milestone to build this."}
      </pre>
      <div className="flex gap-2">
        <Button type="button" onClick={download} disabled={!text}>
          Download
        </Button>
        <Button type="button" variant="outline" onClick={() => window.print()}>
          Print
        </Button>
      </div>
    </div>
  );
}
