import { dayjs } from "./dates.js"

/**
 * @param {{ dueAt?: string | null, recurrence: { rule: string, intervalDays?: number, weekday?: number } }} task
 * @returns {string | null}
 */
export function computeNextDue(task) {
    const r = task.recurrence
    if (!r || r.rule === "none") return null
    const base = task.dueAt ? dayjs(task.dueAt) : dayjs()
    if (r.rule === "daily") return base.add(1, "day").toISOString()
    if (r.rule === "weekly") return base.add(1, "week").toISOString()
    if (r.rule === "custom" && typeof r.intervalDays === "number") {
        return base.add(r.intervalDays, "day").toISOString()
    }
    return null
}
