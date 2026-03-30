<template>
    <form class="flex flex-col sm:flex-row gap-2 w-full" @submit.prevent="submit">
        <Tooltip
            text="Default priority for new tasks (High · Medium · Low · None)"
            position="top"
            inline
        >
            <label class="sr-only" for="qa-priority">Priority</label>
            <select
                id="qa-priority"
                v-model="priority"
                class="shrink-0 bg-gray text-light font-Poppins text-sm border border-light/20 rounded-2xl px-3 sm:px-4 py-3 sm:py-4 outline-none w-full sm:w-auto sm:min-w-[120px]"
            >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
            </select>
        </Tooltip>
        <div class="relative flex-1 min-w-0">
            <Tooltip
                text="Quick add (Alt+N). Type naturally — dates parse automatically. Enter or Add."
                position="top"
                wrap
            >
                <div class="relative w-full min-w-0">
            <input
                id="quick-add"
                ref="inputRef"
                v-model="text"
                type="text"
                name="quick-add-title"
                autocomplete="off"
                class="w-full bg-gray text-light font-Poppins p-3 sm:p-4 pr-[4.5rem] sm:pr-28 outline-none rounded-2xl border border-transparent focus:border-light/30 min-w-0"
                placeholder="Quick add… try 'Call Sam tomorrow 3pm'"
            />
            <button
                type="submit"
                class="absolute right-1.5 sm:right-2 top-1/2 z-20 -translate-y-1/2 bg-red text-dark font-PoppinsBold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:opacity-90 flex items-center gap-1 sm:gap-1.5 shrink-0"
            >
                <Plus :size="16" :stroke-width="2.5" />
                Add
            </button>
                </div>
            </Tooltip>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Plus } from "lucide-vue-next"
import Tooltip from "./Tooltip.vue"
import { useAppStore } from "../stores/app.js"
import { useUiStore } from "../stores/ui.js"
import { parseQuickAdd } from "../composables/useQuickAdd.js"

const app = useAppStore()
const ui = useUiStore()
const router = useRouter()
const text = ref("")
const priority = ref("medium")
const inputRef = ref(null)

function focusInput() {
    setTimeout(() => {
        inputRef.value?.focus()
    }, 100)
}

onMounted(() => {
    focusInput()
    router.afterEach(() => {
        focusInput()
    })
})

function submit() {
    const raw = text.value.trim()
    if (!raw) {
        ui.notify("Enter a task first.", "error")
        return
    }
    try {
        const { title, dueAt } = parseQuickAdd(raw)
        app.addTask({
            title,
            dueAt,
            priority: priority.value,
        })
        text.value = ""
        ui.notify("Task added")
        focusInput()
    } catch (e) {
        const msg = e && typeof e.message === "string" ? e.message : "Could not add task."
        ui.notify(msg, "error")
        if (import.meta.env.DEV) {
            console.error("[QuickAdd]", e)
        }
    }
}
</script>
