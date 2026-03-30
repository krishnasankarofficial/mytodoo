import { defineStore } from "pinia"

export const useUiStore = defineStore("ui", {
    state: () => ({
        loading: false,
        showHelp: false,
        toastOpen: false,
        notification: { message: "", type: "normal" },
        focusTaskId: null,
        importPreview: null,
        searchQuery: "",
        tagFilter: "",
    }),
    actions: {
        setLoading(v) {
            this.loading = v
        },
        setShowHelp(v) {
            this.showHelp = v
        },
        notify(message, type = "normal") {
            this.notification = { message, type }
            this.toastOpen = true
            setTimeout(() => {
                this.toastOpen = false
            }, 2600)
        },
        setFocusTaskId(id) {
            this.focusTaskId = id
        },
        setImportPreview(data) {
            this.importPreview = data
        },
        setSearchQuery(q) {
            this.searchQuery = q
        },
        setTagFilter(tag) {
            this.tagFilter = tag
        },
    },
})
