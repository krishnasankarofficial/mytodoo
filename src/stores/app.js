import { defineStore } from "pinia"
import { useDebounceFn } from "@vueuse/core"
import { APP_SCHEMA_VERSION, parseAppState } from "../storage/schema.js"
import { loadAppState, saveAppStateRaw } from "../storage/clientStorage.js"
import { computeNextDue } from "../utils/recurrence.js"
import { dayjs } from "../utils/dates.js"
import { useUiStore } from "./ui.js"

function newId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function todayKey() {
    return dayjs().format("YYYY-MM-DD")
}

function yesterdayKey() {
    return dayjs().subtract(1, "day").format("YYYY-MM-DD")
}

function bumpStreak(prefs) {
    const t = todayKey()
    if (prefs.lastStreakDate === t) return { ...prefs }
    if (prefs.lastStreakDate === yesterdayKey()) {
        return { ...prefs, streakDays: prefs.streakDays + 1, lastStreakDate: t }
    }
    return { ...prefs, streakDays: 1, lastStreakDate: t }
}

export const useAppStore = defineStore("app", {
        state: () => {
        const loaded = loadAppState()
        return {
            tasks: loaded.tasks,
            preferences: loaded.preferences,
        }
    },
    getters: {
        activeTasks: (s) => s.tasks.filter((t) => t.status === "active"),
        completedTasks: (s) => s.tasks.filter((t) => t.status === "completed"),
        trashedTasks: (s) => s.tasks.filter((t) => t.status === "trashed"),

        todayTasks(state) {
            return state.tasks.filter((t) => {
                if (t.status !== "active") return false
                if (!t.dueAt) return false
                return dayjs(t.dueAt).isSame(dayjs(), "day") || dayjs(t.dueAt).isBefore(dayjs(), "day")
            })
        },
        upcomingTasks(state) {
            return state.tasks
                .filter((t) => t.status === "active" && t.dueAt)
                .filter((t) => dayjs(t.dueAt).isAfter(dayjs().endOf("day")))
                .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
        },
        overdueTasks(state) {
            return state.tasks.filter(
                (t) => t.status === "active" && t.dueAt && dayjs(t.dueAt).isBefore(dayjs(), "day"),
            )
        },

        allTags(state) {
            const set = new Set()
            state.tasks.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)))
            return [...set].sort()
        },

        dailyProgressPercent(state) {
            const start = dayjs().startOf("day")
            const end = dayjs().endOf("day")
            const completedToday = state.tasks.filter((t) => {
                if (!t.completedAt) return false
                const c = dayjs(t.completedAt)
                return c.isAfter(start) && c.isBefore(end.add(1, "ms"))
            }).length
            const dueTodayOpen = state.tasks.filter(
                (t) =>
                    t.status === "active" &&
                    t.dueAt &&
                    dayjs(t.dueAt).isSame(dayjs(), "day"),
            ).length
            const denom = completedToday + dueTodayOpen
            if (denom === 0) return completedToday > 0 ? 100 : 0
            return Math.round((completedToday / denom) * 100)
        },
    },
    actions: {
        _persist() {
            try {
                saveAppStateRaw({
                    schemaVersion: APP_SCHEMA_VERSION,
                    tasks: this.tasks,
                    preferences: this.preferences,
                })
            } catch (e) {
                useUiStore().notify(
                    e && e.name === "QuotaExceededError"
                        ? "Storage is full. Export a backup, then free space."
                        : "Could not save data.",
                    "error",
                )
            }
        },

        initPersist() {
            if (this.schedulePersist) return
            this.schedulePersist = useDebounceFn(() => this._persist(), 400)
        },

        queuePersist() {
            this.initPersist()
            this.schedulePersist()
        },

        setTheme(theme) {
            this.preferences = { ...this.preferences, theme }
            this.queuePersist()
            document.documentElement.classList.toggle("light", theme === "light")
            document.documentElement.classList.toggle("dark", theme !== "light")
        },

        applyThemeFromPrefs() {
            document.documentElement.classList.toggle("light", this.preferences.theme === "light")
            document.documentElement.classList.toggle("dark", this.preferences.theme !== "light")
        },

        updatePreferences(partial) {
            this.preferences = { ...this.preferences, ...partial }
            this.queuePersist()
        },

        addTask(payload) {
            const now = new Date().toISOString()
            const sortOrder = Math.max(0, ...this.tasks.map((t) => t.sortOrder ?? 0)) + 1
            const task = {
                id: newId(),
                title: payload.title?.trim() || "Untitled",
                description: payload.description ?? "",
                dueAt: payload.dueAt ?? null,
                completedAt: null,
                priority: payload.priority ?? "medium",
                tags: Array.isArray(payload.tags) ? payload.tags.map((x) => String(x).toLowerCase()) : [],
                subtasks: payload.subtasks ?? [],
                recurrence: payload.recurrence ?? { rule: "none" },
                status: "active",
                deletedAt: null,
                sortOrder,
                createdAt: now,
                updatedAt: now,
            }
            this.tasks.unshift(task)
            this.queuePersist()
        },

        updateTaskById(id, partial) {
            const i = this.tasks.findIndex((t) => t.id === id)
            if (i === -1) return
            const cur = this.tasks[i]
            const next = {
                ...cur,
                ...partial,
                updatedAt: new Date().toISOString(),
            }
            if (partial.tags) {
                next.tags = partial.tags.map((x) => String(x).toLowerCase())
            }
            this.tasks[i] = next
            this.queuePersist()
        },

        completeTask(id) {
            const t = this.tasks.find((x) => x.id === id)
            if (!t || t.status !== "active") return
            const now = new Date().toISOString()
            this.preferences = bumpStreak(this.preferences)
            const nextDue = computeNextDue(t)
            if (t.recurrence && t.recurrence.rule !== "none" && nextDue) {
                const clone = {
                    ...t,
                    id: newId(),
                    dueAt: nextDue,
                    completedAt: null,
                    status: "active",
                    updatedAt: now,
                    sortOrder: Math.max(0, ...this.tasks.map((x) => x.sortOrder ?? 0)) + 1,
                }
                this.tasks.unshift(clone)
            }
            this.updateTaskById(id, {
                status: "completed",
                completedAt: now,
            })
        },

        uncompleteTask(id) {
            this.updateTaskById(id, {
                status: "active",
                completedAt: null,
            })
        },

        softDelete(id) {
            const now = new Date().toISOString()
            this.updateTaskById(id, {
                status: "trashed",
                deletedAt: now,
            })
        },

        restoreTask(id) {
            this.updateTaskById(id, {
                status: "active",
                deletedAt: null,
            })
        },

        deleteForever(id) {
            this.tasks = this.tasks.filter((t) => t.id !== id)
            this.queuePersist()
        },

        emptyTrash() {
            this.tasks = this.tasks.filter((t) => t.status !== "trashed")
            this.queuePersist()
        },

        clearCompleted() {
            this.tasks = this.tasks.filter((t) => t.status !== "completed")
            this.queuePersist()
        },

        reorderActive(orderIds) {
            const map = new Map(orderIds.map((id, i) => [id, i]))
            this.tasks = this.tasks.map((t) => {
                if (map.has(t.id)) {
                    return { ...t, sortOrder: map.get(t.id), updatedAt: new Date().toISOString() }
                }
                return t
            })
            this.queuePersist()
        },

        replaceState(next) {
            const validated = parseAppState(next)
            if (!validated.success) {
                throw new Error("Invalid state")
            }
            this.tasks = validated.data.tasks
            this.preferences = validated.data.preferences
            this.queuePersist()
        },

        exportJsonString() {
            return JSON.stringify(
                {
                    schemaVersion: APP_SCHEMA_VERSION,
                    exportedAt: new Date().toISOString(),
                    tasks: this.tasks,
                    preferences: this.preferences,
                },
                null,
                2,
            )
        },
    },
})
