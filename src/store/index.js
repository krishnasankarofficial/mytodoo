import { createStore } from "vuex"

function loadTasksFromStorage() {
    try {
        return JSON.parse(localStorage.getItem("tasks") || "[]")
    } catch {
        return []
    }
}

const store = createStore({
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
        SET_NOTIFICATION(state, message, type) {
            state.notification = {
                message: message,
                type: type ? type : "normal",
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
        setNotification({ commit }, message, type) {
            commit("SET_NOTIFICATION", message, type)
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
        saveTasksLocal({ state }) {
            localStorage.setItem("tasks", JSON.stringify(state.tasks))
        },
    },
})

export default store
