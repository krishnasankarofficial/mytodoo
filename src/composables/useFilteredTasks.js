import { computed, unref } from "vue"
import { storeToRefs } from "pinia"
import { useUiStore } from "../stores/ui.js"

/**
 * @param {import('vue').Ref | import('vue').ComputedRef | (() => unknown[])} baseList
 */
export function useFilteredTasks(baseList) {
    const ui = useUiStore()
    const { searchQuery, tagFilter } = storeToRefs(ui)

    return computed(() => {
        let list = typeof baseList === "function" ? baseList() : unref(baseList)
        if (!Array.isArray(list)) list = []
        const q = searchQuery.value.trim().toLowerCase()
        if (q) {
            list = list.filter((t) => {
                const title = (t.title || "").toLowerCase()
                const desc = (t.description || "").toLowerCase()
                const tags = (t.tags || []).join(" ").toLowerCase()
                return title.includes(q) || desc.includes(q) || tags.includes(q)
            })
        }
        const tag = tagFilter.value.trim().toLowerCase()
        if (tag) {
            list = list.filter((t) => (t.tags || []).includes(tag))
        }
        return [...list]
    })
}
