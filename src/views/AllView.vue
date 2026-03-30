<template>
    <section>
        <h2 class="text-xl font-PoppinsBold mb-3 text-left">All open tasks</h2>
        <TaskList v-if="filtered.length" :tasks="filtered" variant="active" />
        <EmptyState v-else title="No active tasks" />
    </section>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../stores/app.js"
import TaskList from "../components/TaskList.vue"
import EmptyState from "../components/EmptyState.vue"
import { useFilteredTasks } from "../composables/useFilteredTasks.js"

const app = useAppStore()
const base = computed(() => [...app.activeTasks].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)))
const filtered = useFilteredTasks(base)
</script>
