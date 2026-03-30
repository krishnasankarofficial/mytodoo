<template>
    <div class="flex flex-col sm:flex-row gap-2 w-full">
        <label class="sr-only" for="qa-priority">Priority</label>
        <select
            id="qa-priority"
            v-model="priority"
            class="shrink-0 bg-gray text-light font-Poppins text-sm border border-light/20 rounded-2xl px-3 py-3 outline-none"
        >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
        </select>
        <div class="relative flex-1 min-w-0">
            <input
                id="quick-add"
                v-model="text"
                type="text"
                class="w-full bg-gray text-light font-Poppins p-4 pr-24 outline-none rounded-3xl border border-transparent focus:border-light/30"
                placeholder="Quick add… try “Call Sam tomorrow 3pm”"
                @keydown.enter.prevent="submit"
            />
            <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-red text-dark font-PoppinsBold text-sm px-4 py-2 rounded-xl hover:opacity-90"
                @click="submit"
            >
                Add
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useAppStore } from "../stores/app.js"
import { useUiStore } from "../stores/ui.js"
import { parseQuickAdd } from "../composables/useQuickAdd.js"

const app = useAppStore()
const ui = useUiStore()
const text = ref("")
const priority = ref("medium")

function submit() {
    const raw = text.value.trim()
    if (!raw) {
        ui.notify("Enter a task first.", "error")
        return
    }
    const { title, dueAt } = parseQuickAdd(raw)
    app.addTask({
        title,
        dueAt,
        priority: priority.value,
    })
    text.value = ""
    ui.notify("Task added")
}
</script>
