import { casual } from "chrono-node"

/**
 * Parse quick-add text into title + optional due ISO.
 * Never throws — falls back to plain title on any parser error.
 * @param {string} text
 */
export function parseQuickAdd(text) {
    const raw = String(text ?? "").trim()
    if (!raw) return { title: "", dueAt: null }

    try {
        const results = casual.parse(raw, new Date(), { forwardDate: true })
        if (!results || results.length === 0) {
            return { title: raw, dueAt: null }
        }
        const first = results[0]
        if (!first || typeof first.index !== "number" || typeof first.text !== "string") {
            return { title: raw, dueAt: null }
        }
        const dueAt = first.date().toISOString()
        const before = raw.slice(0, first.index).trim()
        const after = raw.slice(first.index + first.text.length).trim()
        let title = [before, after].filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
        if (!title) title = "Task"
        return { title, dueAt }
    } catch {
        return { title: raw, dueAt: null }
    }
}
