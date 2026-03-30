<template>
    <section>
        <h2 class="text-xl font-PoppinsBold mb-3 text-left">Upcoming</h2>
        <p class="text-sm text-light/50 mb-4 text-left">Future due dates · {{ filtered.length }} shown</p>
        <TaskList v-if="filtered.length" :tasks="filtered" variant="active" />
        <EmptyState v-else title="No upcoming tasks" hint="Set a due date when editing a task." icon="📅" />
    </section>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../stores/app.js"
import TaskList from "../components/TaskList.vue"
import EmptyState from "../components/EmptyState.vue"
import { useFilteredTasks } from "../composables/useFilteredTasks.js"

const app = useAppStore()
const base = computed(() => app.upcomingTasks)
const filtered = useFilteredTasks(base)
</script>
