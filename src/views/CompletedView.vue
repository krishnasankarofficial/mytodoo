<template>
    <section>
        <h2 class="text-xl font-PoppinsBold mb-3 text-left">Completed</h2>
        <div class="flex flex-wrap gap-2 mb-4">
            <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg border border-red/40 text-red hover:bg-red/10 disabled:opacity-40 flex items-center gap-1.5"
                :disabled="!app.completedTasks.length"
                @click="clearDone"
            >
                <Eraser :size="14" />
                Clear all completed
            </button>
        </div>
        <TaskList v-if="filtered.length" :tasks="filtered" variant="completed" />
        <EmptyState v-else title="No completed tasks yet" />
    </section>
</template>

<script setup>
import { computed } from "vue"
import { Eraser } from "lucide-vue-next"
import { useAppStore } from "../stores/app.js"
import TaskList from "../components/TaskList.vue"
import EmptyState from "../components/EmptyState.vue"
import { useFilteredTasks } from "../composables/useFilteredTasks.js"
import { useConfirm } from "../composables/useConfirm.js"

const app = useAppStore()
const base = computed(() => app.completedTasks)
const filtered = useFilteredTasks(base)
const { confirm } = useConfirm()

async function clearDone() {
    const confirmed = await confirm({
        title: "Clear completed tasks",
        message: "Remove all completed tasks permanently? This cannot be undone.",
        confirmText: "Clear",
        cancelText: "Cancel",
    })
    if (confirmed) {
        app.clearCompleted()
    }
}
</script>
