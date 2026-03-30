import { casual } from "chrono-node"

/**
 * Parse quick-add text into title + optional due ISO.
 * @param {string} text
 */
export function parseQuickAdd(text) {
    const raw = text.trim()
    if (!raw) return { title: "", dueAt: null }

    const results = casual.parse(raw, new Date(), { forwardDate: true })
    if (results.length === 0) {
        return { title: raw, dueAt: null }
    }
    const first = results[0]
    const dueAt = first.date().toISOString()
    const before = raw.slice(0, first.index).trim()
    const after = raw.slice(first.index + first.text.length).trim()
    let title = [before, after].filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
    if (!title) title = "Task"
    return { title, dueAt }
}
