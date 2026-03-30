<template>
    <section>
        <h2 class="text-xl font-PoppinsBold mb-3 text-left">Trash</h2>
        <div class="flex flex-wrap gap-2 mb-4">
            <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg border border-red/40 text-red hover:bg-red/10 disabled:opacity-40"
                :disabled="!app.trashedTasks.length"
                @click="empty"
            >
                Empty trash
            </button>
        </div>
        <TaskList v-if="filtered.length" :tasks="filtered" variant="trash" />
        <EmptyState v-else title="Trash is empty" />
    </section>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../stores/app.js"
import TaskList from "../components/TaskList.vue"
import EmptyState from "../components/EmptyState.vue"
import { useFilteredTasks } from "../composables/useFilteredTasks.js"

const app = useAppStore()
const base = computed(() => app.trashedTasks)
const filtered = useFilteredTasks(base)

function empty() {
    if (!window.confirm("Permanently delete all trashed tasks?")) return
    app.emptyTrash()
}
</script>
