import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { applications } from "./application.ts";
import { users } from "./user.ts";

export const interviewTypeEnum = pgEnum("interview_type", [
  "TECHNICAL",
  "HR",
  "BEHAVIORAL",
  "MANAGERIAL",
  "GROUP_DISCUSSION",
  "OTHER",
]);

export const interviewStatusEnum = pgEnum("interview_status", [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
]);

export const interviews = pgTable("interviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  interviewType: interviewTypeEnum("interview_type"),
  status: interviewStatusEnum("status").default("SCHEDULED").notNull(),
  interviewerName: varchar("interviewer_name", { length: 150 }),
  meetingLink: varchar("meeting_link", { length: 500 }),
  notes: text("notes"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
