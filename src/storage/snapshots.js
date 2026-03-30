import { APP_SCHEMA_VERSION } from "./schema.js"

export const SNAPSHOT_KEY = "stride_snapshots"
export const SNAPSHOT_COUNT = 5

/**
 * @param {string} serializedValidatedState
 */
export function pushSnapshot(serializedValidatedState) {
    try {
        const raw = localStorage.getItem(SNAPSHOT_KEY)
        /** @type {string[]} */
        let ring = []
        if (raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) ring = parsed.filter((x) => typeof x === "string")
        }
        ring.unshift(serializedValidatedState)
        while (ring.length > SNAPSHOT_COUNT) ring.pop()
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(ring))
    } catch {
        /* ignore */
    }
}

/**
 * @returns {string | null}
 */
export function newestSnapshot() {
    try {
        const raw = localStorage.getItem(SNAPSHOT_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") {
            return parsed[0]
        }
    } catch {
        /* ignore */
    }
    return null
}

export function snapshotMeta() {
    return { key: SNAPSHOT_KEY, count: SNAPSHOT_COUNT, schemaVersion: APP_SCHEMA_VERSION }
}
