import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapStory } from "./map";
import { newId } from "@/lib/utils";
import type { Story } from "@/lib/types";

const filtersSchema = z.object({
  theme: z.string().optional(),
  tag: z.string().optional(),
  recoveryTime: z.string().optional(),
  q: z.string().optional(),
});

export const listStories = createServerFn({ method: "GET" })
  .validator((input: unknown) => filtersSchema.parse(input ?? {}))
  .handler(async ({ data }): Promise<Story[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from stories
      order by spark_votes desc, created_at desc
    `;
    return rows
      .map(mapStory)
      .filter((s) => {
        if (data.theme && s.theme !== data.theme) return false;
        if (data.tag && !s.tags.includes(data.tag)) return false;
        if (data.recoveryTime && s.recoveryTime !== data.recoveryTime) return false;
        if (data.q) {
          const q = data.q.toLowerCase();
          const hay = `${s.title} ${s.body} ${s.authorName}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
  });

export const getStory = createServerFn({ method: "GET" })
  .validator((id: unknown) => z.string().min(1).parse(id))
  .handler(async ({ data: id }): Promise<Story | null> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from stories where id = ${id} limit 1
    `;
    return rows[0] ? mapStory(rows[0]) : null;
  });

export const listStoriesByUser = createServerFn({ method: "GET" })
  .validator((userId: unknown) => z.string().min(1).parse(userId))
  .handler(async ({ data: userId }): Promise<Story[]> => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from stories
      where user_id = ${userId} and is_anonymous = false
      order by created_at desc
    `;
    return rows.map(mapStory);
  });

const createSchema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(40).max(8000),
  theme: z.string().min(1),
  tags: z.array(z.string()).max(4),
  recoveryTime: z.string().min(1),
  isAnonymous: z.boolean(),
  medium: z.enum(["text", "voice"]),
  authorName: z.string().trim().min(1).max(60),
});

export const createStory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => createSchema.parse(input))
  .handler(async ({ context, data }): Promise<Story> => {
    const sql = await getSql();
    const id = newId();
    const name = data.isAnonymous ? "Someone who made it" : data.authorName;
    await sql`
      insert into stories (
        id, user_id, author_name, is_anonymous, title, body, medium, tags, recovery_time, theme
      ) values (
        ${id},
        ${context.userId},
        ${name},
        ${data.isAnonymous},
        ${data.title},
        ${data.body},
        ${data.medium},
        ${JSON.stringify(data.tags)},
        ${data.recoveryTime},
        ${data.theme}
      )
    `;
    const rows = await sql<Record<string, unknown>>`select * from stories where id = ${id}`;
    return mapStory(rows[0]!);
  });

export const voteStory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((storyId: unknown) => z.string().min(1).parse(storyId))
  .handler(async ({ context, data: storyId }): Promise<{ votes: number; voted: boolean }> => {
    const sql = await getSql();
    const existing = await sql<{ story_id: string }>`
      select story_id from story_votes where story_id = ${storyId} and user_id = ${context.userId}
    `;
    if (existing.length) {
      await sql`delete from story_votes where story_id = ${storyId} and user_id = ${context.userId}`;
      await sql`update stories set spark_votes = greatest(spark_votes - 1, 0) where id = ${storyId}`;
    } else {
      await sql`insert into story_votes (story_id, user_id) values (${storyId}, ${context.userId})`;
      await sql`update stories set spark_votes = spark_votes + 1 where id = ${storyId}`;
    }
    const rows = await sql<{ spark_votes: number }>`select spark_votes from stories where id = ${storyId}`;
    return { votes: Number(rows[0]?.spark_votes ?? 0), voted: existing.length === 0 };
  });

export const deleteStory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => z.string().min(1).parse(id))
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from stories where id = ${id} and user_id = ${context.userId}`;
    return { ok: true };
  });
