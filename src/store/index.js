import { createStore } from "vuex"

export const STORAGE_KEY = "tasks"

function normalizeTask(raw, fallbackIndex) {
    const now = new Date()
    const created = raw.created_at ? new Date(raw.created_at) : now
    const updated = raw.updated_at ? new Date(raw.updated_at) : created
    const tid = Number(raw.task_id)
    return {
        task_id: Number.isFinite(tid) && tid > 0 ? tid : fallbackIndex + 1,
        task: typeof raw.task === "string" ? raw.task : String(raw.task ?? ""),
        status: Boolean(raw.status),
        edit: Boolean(raw.edit),
        created_at: Number.isNaN(created.getTime()) ? now : created,
        updated_at: Number.isNaN(updated.getTime()) ? now : updated,
        ...(raw.id ? { id: raw.id } : {}),
    }
}

function normalizeTasks(data) {
    if (!Array.isArray(data)) return []
    return data
        .filter((t) => t && typeof t === "object")
        .map((t, i) => normalizeTask(t, i))
}

function loadTasksFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        return normalizeTasks(JSON.parse(raw))
    } catch {
        return []
    }
}

const store = createStore({
    strict: import.meta.env.DEV,
    state: {
        tasks: loadTasksFromStorage(),
        loading: true,
        notify: true,
        showHelp: false,
        notification: {
            message: "",
            type: "normal",
        },
    },
    getters: {
        tasksTotalCount: (state) => state.tasks.length,
        tasksCompletedCount: (state) => state.tasks.filter((task) => task.status).length,
        tasksPendingCount: (state) => state.tasks.filter((task) => !task.status).length,
        nextTaskId: (state) => {
            const ids = state.tasks.map((t) => Number(t.task_id)).filter((n) => Number.isFinite(n) && n > 0)
            return (ids.length ? Math.max(...ids) : 0) + 1
        },
    },
    mutations: {
        SET_TASKS(state, tasks) {
            state.tasks = tasks
        },
        ADD_TASK(state, task) {
            state.tasks.unshift(task)
        },
        UPDATE_TASK(state, { index, task }) {
            state.tasks[index] = task
        },
        DELETE_TASK(state, index) {
            state.tasks.splice(index, 1)
        },
        SET_LOADING(state, status) {
            state.loading = status
        },
        SET_SHOWHELP(state, status) {
            state.showHelp = status
        },
        SET_NOTIFICATION(state, { message, type = "normal" }) {
            state.notification = {
                message,
                type,
            }
            state.notify = true
            setTimeout(() => {
                state.notify = false
            }, 2000)
        },
    },
    actions: {
        setShowHelp({ commit }, status) {
            commit("SET_SHOWHELP", status)
        },
        setNotification({ commit }, { message, type }) {
            commit("SET_NOTIFICATION", { message, type })
        },
        setLoading({ commit }, status) {
            commit("SET_LOADING", status)
        },
        loadTasks({ commit }) {
            commit("SET_TASKS", loadTasksFromStorage())
        },
        addTask({ commit }, task) {
            commit("ADD_TASK", task)
        },
        updateTask({ commit }, { index, task }) {
            commit("UPDATE_TASK", { index, task })
        },
        deleteTask({ commit }, { index }) {
            commit("DELETE_TASK", index)
        },
        saveTasksLocal({ state, dispatch }) {
            try {
                const serializable = state.tasks.map((t) => ({
                    ...t,
                    created_at: t.created_at instanceof Date ? t.created_at.toISOString() : t.created_at,
                    updated_at: t.updated_at instanceof Date ? t.updated_at.toISOString() : t.updated_at,
                }))
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
            } catch (e) {
                const message =
                    e && e.name === "QuotaExceededError"
                        ? "Storage is full. Free space or remove other site data, then try again."
                        : "Could not save your tasks."
                dispatch("setNotification", { message, type: "error" })
            }
        },
    },
})

export default store
