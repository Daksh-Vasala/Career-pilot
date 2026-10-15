import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./user.ts";

export const roadmaps = pgTable("roadmaps", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  targetRole: varchar("target_role", { length: 150 }).notNull(),
  currentSkills: jsonb("current_skills").$type<string[]>().notNull(),
  durationWeeks: integer("duration_weeks").notNull(),

  status: varchar("status", { length: 30 }).notNull().default("ACTIVE"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const roadmapMilestones = pgTable("roadmap_milestones", {
  id: uuid("id").defaultRandom().primaryKey(),

  roadmapId: uuid("roadmap_id")
    .notNull()
    .references(() => roadmaps.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 200 }).notNull(),
  description: text().notNull(),
  order: integer("order").notNull(),

  tasks: jsonb("tasks")
    .$type<{ title: string; description: string }[]>()
    .notNull(),

  isCompleted: boolean("is_completed").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
