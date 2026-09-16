import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapMilestone, mapUrge } from "./map";
import { asIso, newId } from "@/lib/utils";
import type { Milestone, RecoveryStart, UrgeLog } from "@/lib/types";

export const getRecoveryStart = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<RecoveryStart | null> => {
    const sql = await getSql();
    const rows = await sql<{ started_on: unknown }>`
      select started_on from recovery_starts where user_id = ${context.userId}
    `;
    if (!rows[0]) return null;
    return { startedOn: String(rows[0].started_on).slice(0, 10) };
  });

export const setRecoveryStart = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((date: unknown) => z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(date))
  .handler(async ({ context, data: startedOn }): Promise<RecoveryStart> => {
    const sql = await getSql();
    await sql`
      insert into recovery_starts (user_id, started_on, updated_at)
      values (${context.userId}, ${startedOn}::date, now())
      on conflict (user_id) do update set started_on = excluded.started_on, updated_at = now()
    `;
    return { startedOn };
  });

export const listMilestones = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Milestone[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from milestones where user_id = ${context.userId} order by occurred_on desc
    `;
    return rows.map(mapMilestone);
  });

const milestoneSchema = z.object({
  label: z.string().trim().min(2).max(80),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().trim().max(400),
});

export const addMilestone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => milestoneSchema.parse(input))
  .handler(async ({ context, data }): Promise<Milestone> => {
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into milestones (id, user_id, label, occurred_on, note)
      values (${id}, ${context.userId}, ${data.label}, ${data.occurredOn}::date, ${data.note})
    `;
    const rows = await sql<Record<string, unknown>>`select * from milestones where id = ${id}`;
    return mapMilestone(rows[0]!);
  });

export const deleteMilestone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => z.string().min(1).parse(id))
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from milestones where id = ${id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const listUrges = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<UrgeLog[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from urge_logs where user_id = ${context.userId} order by created_at desc limit 40
    `;
    return rows.map(mapUrge);
  });

const urgeSchema = z.object({
  intensity: z.number().int().min(1).max(10),
  trigger: z.string().trim().max(120),
  technique: z.string().trim().max(40),
  note: z.string().trim().max(400),
});

export const addUrge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => urgeSchema.parse(input))
  .handler(async ({ context, data }): Promise<UrgeLog> => {
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into urge_logs (id, user_id, intensity, trigger, technique, note)
      values (${id}, ${context.userId}, ${data.intensity}, ${data.trigger}, ${data.technique}, ${data.note})
    `;
    const rows = await sql<Record<string, unknown>>`select * from urge_logs where id = ${id}`;
    return mapUrge(rows[0]!);
  });

export const exportTimeline = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const start = await sql<{ started_on: unknown }>`
      select started_on from recovery_starts where user_id = ${context.userId}
    `;
    const milestones = await sql<Record<string, unknown>>`
      select * from milestones where user_id = ${context.userId} order by occurred_on
    `;
    const stories = await sql<{ title: string; created_at: unknown }>`
      select title, created_at from stories where user_id = ${context.userId} order by created_at
    `;
    return {
      startedOn: start[0] ? String(start[0].started_on).slice(0, 10) : null,
      milestones: milestones.map(mapMilestone),
      stories: stories.map((s) => ({ title: s.title, createdAt: asIso(s.created_at) })),
    };
  });
