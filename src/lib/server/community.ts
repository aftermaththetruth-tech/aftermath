import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapCircle, mapCirclePost, mapProfile, mapSpark, mapTribute } from "./map";
import { newId } from "@/lib/utils";
import type { Circle, CirclePost, Profile, Spark, Tribute } from "@/lib/types";

export const listProfiles = createServerFn({ method: "GET" }).handler(
  async (): Promise<Profile[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select p.*, (
        select count(*)::int from stories s
        where s.user_id = p.user_id and s.is_anonymous = false
      ) as story_count
      from profiles p
      where p.is_anonymous = false
      order by p.updated_at desc
    `;
    return rows.map(mapProfile);
  },
);

export const getProfile = createServerFn({ method: "GET" })
  .validator((userId: unknown) => z.string().min(1).parse(userId))
  .handler(async ({ data: userId }): Promise<Profile | null> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select p.*, (
        select count(*)::int from stories s
        where s.user_id = p.user_id and s.is_anonymous = false
      ) as story_count
      from profiles p
      where p.user_id = ${userId}
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    const profile = mapProfile(row);
    if (profile.isAnonymous) return null;
    return profile;
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Profile | null> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select p.*, (
        select count(*)::int from stories s where s.user_id = p.user_id
      ) as story_count
      from profiles p
      where p.user_id = ${context.userId}
      limit 1
    `;
    return rows[0] ? mapProfile(rows[0]) : null;
  });

const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  isAnonymous: z.boolean(),
  message: z.string().trim().min(8).max(280),
  timeInRecovery: z.string().min(1),
  substances: z.array(z.string()).max(4),
  milestoneNote: z.string().trim().max(280),
});

export const upsertProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ context, data }): Promise<Profile> => {
    const sql = await getSql();
    await sql`
      insert into profiles (
        user_id, display_name, is_anonymous, message, time_in_recovery, substances, milestone_note, updated_at
      ) values (
        ${context.userId},
        ${data.displayName},
        ${data.isAnonymous},
        ${data.message},
        ${data.timeInRecovery},
        ${JSON.stringify(data.substances)},
        ${data.milestoneNote},
        now()
      )
      on conflict (user_id) do update set
        display_name = excluded.display_name,
        is_anonymous = excluded.is_anonymous,
        message = excluded.message,
        time_in_recovery = excluded.time_in_recovery,
        substances = excluded.substances,
        milestone_note = excluded.milestone_note,
        updated_at = now()
    `;
    const rows = await sql<Record<string, unknown>>`
      select p.*, 0::int as story_count from profiles p where p.user_id = ${context.userId}
    `;
    return mapProfile(rows[0]!);
  });

export const getDailySpark = createServerFn({ method: "GET" }).handler(
  async (): Promise<Spark | null> => {
    const sql = await getSql();
    const countRows = await sql<{ n: number }>`select count(*)::int as n from sparks`;
    const n = Number(countRows[0]?.n ?? 0);
    if (!n) return null;
    const doyRows = await sql<{ d: number }>`select extract(doy from current_date)::int as d`;
    const offset = Number(doyRows[0]?.d ?? 1) % n;
    const rows = await sql<Record<string, unknown>>`
      select * from sparks order by created_at, id offset ${offset} limit 1
    `;
    return rows[0] ? mapSpark(rows[0]) : null;
  },
);

export const listSparks = createServerFn({ method: "GET" }).handler(
  async (): Promise<Spark[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from sparks order by created_at desc limit 24
    `;
    return rows.map(mapSpark);
  },
);

const sparkSchema = z.object({
  body: z.string().trim().min(8).max(180),
  isAnonymous: z.boolean(),
  authorName: z.string().trim().min(1).max(60),
});

export const createSpark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => sparkSchema.parse(input))
  .handler(async ({ context, data }): Promise<Spark> => {
    const sql = await getSql();
    const id = newId();
    const name = data.isAnonymous ? "Someone still here" : data.authorName;
    await sql`
      insert into sparks (id, user_id, body, author_name, is_anonymous)
      values (${id}, ${context.userId}, ${data.body}, ${name}, ${data.isAnonymous})
    `;
    const rows = await sql<Record<string, unknown>>`select * from sparks where id = ${id}`;
    return mapSpark(rows[0]!);
  });

export const listTributes = createServerFn({ method: "GET" }).handler(
  async (): Promise<Tribute[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from tributes order by created_at desc
    `;
    return rows.map(mapTribute);
  },
);

const tributeSchema = z.object({
  honoreeName: z.string().trim().min(1).max(80),
  relationship: z.string().trim().max(60),
  body: z.string().trim().min(20).max(2000),
  years: z.string().trim().max(40),
});

export const createTribute = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => tributeSchema.parse(input))
  .handler(async ({ context, data }): Promise<Tribute> => {
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into tributes (id, user_id, honoree_name, relationship, body, years)
      values (${id}, ${context.userId}, ${data.honoreeName}, ${data.relationship}, ${data.body}, ${data.years})
    `;
    const rows = await sql<Record<string, unknown>>`select * from tributes where id = ${id}`;
    return mapTribute(rows[0]!);
  });

export const listCircles = createServerFn({ method: "GET" }).handler(
  async (): Promise<Circle[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select c.*,
        (select count(*)::int from circle_members m where m.circle_id = c.id) as member_count,
        (select count(*)::int from circle_posts p where p.circle_id = c.id) as post_count
      from circles c
      order by c.name
    `;
    return rows.map(mapCircle);
  },
);

export const getCircle = createServerFn({ method: "GET" })
  .validator((id: unknown) => z.string().min(1).parse(id))
  .handler(async ({ data: id }): Promise<{ circle: Circle; posts: CirclePost[] } | null> => {
    const sql = await getSql();
    const circles = await sql<Record<string, unknown>>`
      select c.*,
        (select count(*)::int from circle_members m where m.circle_id = c.id) as member_count,
        (select count(*)::int from circle_posts p where p.circle_id = c.id) as post_count
      from circles c
      where c.id = ${id}
      limit 1
    `;
    if (!circles[0]) return null;
    const posts = await sql<Record<string, unknown>>`
      select * from circle_posts where circle_id = ${id} order by created_at desc limit 40
    `;
    return { circle: mapCircle(circles[0]), posts: posts.map(mapCirclePost) };
  });

export const joinCircle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((circleId: unknown) => z.string().min(1).parse(circleId))
  .handler(async ({ context, data: circleId }) => {
    const sql = await getSql();
    await sql`
      insert into circle_members (circle_id, user_id)
      values (${circleId}, ${context.userId})
      on conflict do nothing
    `;
    return { ok: true };
  });

export const isCircleMember = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((circleId: unknown) => z.string().min(1).parse(circleId))
  .handler(async ({ context, data: circleId }) => {
    const sql = await getSql();
    const rows = await sql<{ n: number }>`
      select count(*)::int as n from circle_members
      where circle_id = ${circleId} and user_id = ${context.userId}
    `;
    return { member: Number(rows[0]?.n ?? 0) > 0 };
  });

const circlePostSchema = z.object({
  circleId: z.string().min(1),
  body: z.string().trim().min(2).max(1000),
  authorName: z.string().trim().min(1).max(60),
});

export const createCirclePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => circlePostSchema.parse(input))
  .handler(async ({ context, data }): Promise<CirclePost> => {
    const sql = await getSql();
    const member = await sql<{ n: number }>`
      select count(*)::int as n from circle_members
      where circle_id = ${data.circleId} and user_id = ${context.userId}
    `;
    if (!Number(member[0]?.n)) {
      throw new Error("Join this circle before posting.");
    }
    const id = newId();
    await sql`
      insert into circle_posts (id, circle_id, user_id, author_name, body)
      values (${id}, ${data.circleId}, ${context.userId}, ${data.authorName}, ${data.body})
    `;
    const rows = await sql<Record<string, unknown>>`select * from circle_posts where id = ${id}`;
    return mapCirclePost(rows[0]!);
  });

export const checkIn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({ circleId: z.string().min(1), note: z.string().trim().max(200) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into circle_checkins (id, circle_id, user_id, note)
      values (${id}, ${data.circleId}, ${context.userId}, ${data.note})
    `;
    await sql`
      insert into circle_members (circle_id, user_id)
      values (${data.circleId}, ${context.userId})
      on conflict do nothing
    `;
    return { ok: true };
  });

export const listCheckins = createServerFn({ method: "GET" })
  .validator((circleId: unknown) => z.string().min(1).parse(circleId))
  .handler(async ({ data: circleId }) => {
    const sql = await getSql();
    const rows = await sql<{ n: number }>`
      select count(*)::int as n from circle_checkins
      where circle_id = ${circleId} and created_at > now() - interval '24 hours'
    `;
    return { last24h: Number(rows[0]?.n ?? 0) };
  });

export const reportContent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        targetType: z.string().min(1),
        targetId: z.string().min(1),
        reason: z.string().trim().min(3).max(400),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into reports (id, user_id, target_type, target_id, reason)
      values (${newId()}, ${context.userId}, ${data.targetType}, ${data.targetId}, ${data.reason})
    `;
    return { ok: true };
  });
