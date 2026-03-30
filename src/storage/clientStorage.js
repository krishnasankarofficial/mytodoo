import { parseAppState, createDefaultAppState } from "./schema.js"
import { LEGACY_STORAGE_KEY, migrateFromLegacyTasksKey, migrateLoadedState } from "./migrations.js"
import { newestSnapshot, pushSnapshot } from "./snapshots.js"

export const STORAGE_KEY_APP = "stride_app"

function recoverFromSnapshot() {
    try {
        const s = newestSnapshot()
        if (!s) return null
        const data = JSON.parse(s)
        const validated = parseAppState(data)
        return validated.success ? validated.data : null
    } catch {
        return null
    }
}

export function loadAppState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_APP)
        if (raw) {
            const parsed = JSON.parse(raw)
            const migrated = migrateLoadedState(parsed)
            const validated = parseAppState(migrated)
            if (validated.success) {
                return validated.data
            }
            const snap = recoverFromSnapshot()
            if (snap) return snap
            return createDefaultAppState()
        }
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
        if (legacy) {
            const legacyParsed = JSON.parse(legacy)
            const migrated = migrateFromLegacyTasksKey(legacyParsed)
            const validated = parseAppState(migrated)
            if (validated.success) {
                saveAppStateRaw(validated.data)
                return validated.data
            }
        }
    } catch {
        const snap = recoverFromSnapshot()
        if (snap) return snap
    }
    return createDefaultAppState()
}

/**
 * @param {ReturnType<typeof createDefaultAppState>} state
 */
export function saveAppStateRaw(state) {
    const validated = parseAppState(state)
    if (!validated.success) {
        throw new Error("Invalid app state")
    }
    const json = JSON.stringify(validated.data)
    localStorage.setItem(STORAGE_KEY_APP, json)
    pushSnapshot(json)
}
