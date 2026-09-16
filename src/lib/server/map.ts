import { asIso, parseJsonArray } from "@/lib/utils";
import type { Circle, CirclePost, Milestone, Profile, Spark, Story, Tribute, UrgeLog } from "@/lib/types";

type Row = Record<string, unknown>;

function str(row: Row, key: string, fallback = "") {
  const v = row[key];
  return v == null ? fallback : String(v);
}

function num(row: Row, key: string) {
  const v = row[key];
  return typeof v === "number" ? v : Number(v ?? 0);
}

function bool(row: Row, key: string) {
  const v = row[key];
  return v === true || v === "t" || v === "true";
}

export function mapStory(row: Row): Story {
  const medium = str(row, "medium", "text") === "voice" ? "voice" : "text";
  return {
    id: str(row, "id"),
    userId: str(row, "user_id"),
    authorName: str(row, "author_name"),
    isAnonymous: bool(row, "is_anonymous"),
    title: str(row, "title"),
    body: str(row, "body"),
    medium,
    tags: parseJsonArray(str(row, "tags", "[]")),
    recoveryTime: str(row, "recovery_time"),
    theme: str(row, "theme"),
    sparkVotes: num(row, "spark_votes"),
    createdAt: asIso(row.created_at),
  };
}

export function mapProfile(row: Row): Profile {
  return {
    userId: str(row, "user_id"),
    displayName: str(row, "display_name"),
    isAnonymous: bool(row, "is_anonymous"),
    message: str(row, "message"),
    timeInRecovery: str(row, "time_in_recovery"),
    substances: parseJsonArray(str(row, "substances", "[]")),
    milestoneNote: str(row, "milestone_note"),
    createdAt: asIso(row.created_at),
    storyCount: num(row, "story_count"),
  };
}

export function mapSpark(row: Row): Spark {
  return {
    id: str(row, "id"),
    body: str(row, "body"),
    authorName: str(row, "author_name"),
    isAnonymous: bool(row, "is_anonymous"),
    createdAt: asIso(row.created_at),
  };
}

export function mapTribute(row: Row): Tribute {
  return {
    id: str(row, "id"),
    userId: str(row, "user_id"),
    honoreeName: str(row, "honoree_name"),
    relationship: str(row, "relationship"),
    body: str(row, "body"),
    years: str(row, "years"),
    createdAt: asIso(row.created_at),
  };
}

export function mapCircle(row: Row): Circle {
  return {
    id: str(row, "id"),
    name: str(row, "name"),
    stage: str(row, "stage"),
    focus: str(row, "focus"),
    description: str(row, "description"),
    memberCount: num(row, "member_count"),
    postCount: num(row, "post_count"),
  };
}

export function mapCirclePost(row: Row): CirclePost {
  return {
    id: str(row, "id"),
    circleId: str(row, "circle_id"),
    userId: str(row, "user_id"),
    authorName: str(row, "author_name"),
    body: str(row, "body"),
    createdAt: asIso(row.created_at),
  };
}

export function mapMilestone(row: Row): Milestone {
  return {
    id: str(row, "id"),
    label: str(row, "label"),
    occurredOn: String(row.occurred_on ?? "").slice(0, 10),
    note: str(row, "note"),
  };
}

export function mapUrge(row: Row): UrgeLog {
  return {
    id: str(row, "id"),
    intensity: num(row, "intensity"),
    trigger: str(row, "trigger"),
    technique: str(row, "technique"),
    note: str(row, "note"),
    createdAt: asIso(row.created_at),
  };
}
