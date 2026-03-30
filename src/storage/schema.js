import { z } from "zod"

export const APP_SCHEMA_VERSION = 2

export const SubtaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    done: z.boolean(),
})

export const RecurrenceSchema = z.discriminatedUnion("rule", [
    z.object({ rule: z.literal("none") }),
    z.object({ rule: z.literal("daily") }),
    z.object({ rule: z.literal("weekly"), weekday: z.number().min(0).max(6) }),
    z.object({ rule: z.literal("custom"), intervalDays: z.number().min(1) }),
])

export const TaskSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().default(""),
    dueAt: z.union([z.string(), z.null()]).optional(),
    completedAt: z.union([z.string(), z.null()]).optional(),
    priority: z.enum(["none", "low", "medium", "high"]),
    tags: z.array(z.string()).default([]),
    subtasks: z.array(SubtaskSchema).default([]),
    recurrence: RecurrenceSchema.default({ rule: "none" }),
    status: z.enum(["active", "completed", "trashed"]),
    deletedAt: z.union([z.string(), z.null()]).optional(),
    sortOrder: z.number().default(0),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const PreferencesSchema = z.object({
    theme: z.enum(["dark", "light"]).default("dark"),
    pomodoroWorkMin: z.number().min(1).default(25),
    pomodoroBreakMin: z.number().min(1).default(5),
    autoBackupEnabled: z.boolean().default(false),
    autoBackupIntervalMin: z.number().min(5).default(60),
    streakDays: z.number().min(0).default(0),
    lastStreakDate: z.union([z.string(), z.null()]).optional(),
})

export const AppStateSchema = z.object({
    schemaVersion: z.number(),
    tasks: z.array(TaskSchema),
    preferences: PreferencesSchema,
})

export function parseAppState(raw) {
    return AppStateSchema.safeParse(raw)
}

export function createDefaultAppState() {
    const prefs = PreferencesSchema.safeParse({})
    return {
        schemaVersion: APP_SCHEMA_VERSION,
        tasks: [],
        preferences: prefs.success ? prefs.data : { theme: "dark", pomodoroWorkMin: 25, pomodoroBreakMin: 5, autoBackupEnabled: false, autoBackupIntervalMin: 60, streakDays: 0, lastStreakDate: null },
    }
}
