import { APP_SCHEMA_VERSION, createDefaultAppState, TaskSchema } from "./schema.js"

export const LEGACY_STORAGE_KEY = "tasks"

function newId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/** @param {unknown} raw @param {number} i */
function legacyRowToTask(raw, i) {
    if (!raw || typeof raw !== "object") {
        return null
    }
    const r = /** @type {Record<string, unknown>} */ (raw)
    const now = new Date().toISOString()
    const created = r.created_at ? new Date(String(r.created_at)) : new Date()
    const updated = r.updated_at ? new Date(String(r.updated_at)) : created
    const completed = Boolean(r.status)
    const tid = r.task_id != null ? Number(r.task_id) : i + 1
    const base = {
        id: r.id != null ? String(r.id) : `legacy-${Number.isFinite(tid) ? tid : i}`,
        title: typeof r.task === "string" && r.task.trim() ? r.task.trim() : "Untitled",
        description: "",
        dueAt: null,
        completedAt: completed ? updated.toISOString() : null,
        priority:
            typeof r.priority === "string" &&
            ["none", "low", "medium", "high"].includes(r.priority)
                ? r.priority
                : "none",
        tags: [],
        subtasks: [],
        recurrence: { rule: "none" },
        status: /** @type {'active'|'completed'} */ (completed ? "completed" : "active"),
        deletedAt: null,
        sortOrder: i,
        createdAt: Number.isNaN(created.getTime()) ? now : created.toISOString(),
        updatedAt: Number.isNaN(updated.getTime()) ? now : updated.toISOString(),
    }
    const parsed = TaskSchema.safeParse(base)
    return parsed.success ? parsed.data : null
}

/**
 * Migrate legacy flat tasks array (v0) into app state v2.
 * @param {unknown} legacyJson
 */
export function migrateFromLegacyTasksKey(legacyJson) {
    const state = createDefaultAppState()
    if (!Array.isArray(legacyJson)) return state
    const tasks = []
    legacyJson.forEach((row, i) => {
        const t = legacyRowToTask(row, i)
        if (t) tasks.push(t)
    })
    state.tasks = tasks
    state.schemaVersion = APP_SCHEMA_VERSION
    return state
}

/**
 * Run migrations chain on loaded object.
 * @param {unknown} data
 */
export function migrateLoadedState(data) {
    if (!data || typeof data !== "object") {
        return createDefaultAppState()
    }
    const d = /** @type {Record<string, unknown>} */ (data)
    if (
        d.schemaVersion === APP_SCHEMA_VERSION &&
        Array.isArray(d.tasks) &&
        d.preferences &&
        typeof d.preferences === "object"
    ) {
        return data
    }
    if (Array.isArray(d.tasks) && d.schemaVersion == null) {
        return migrateFromLegacyTasksKey(d.tasks)
    }
    return createDefaultAppState()
}
