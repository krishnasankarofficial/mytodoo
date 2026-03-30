<template>
    <section>
        <h2 class="text-xl font-PoppinsBold mb-3 text-left">Today</h2>
        <p class="text-sm text-light/50 mb-4 text-left">
            Overdue and due today · {{ filtered.length }} shown
        </p>
        <TaskList v-if="filtered.length" :tasks="filtered" variant="active" />
        <EmptyState v-else title="You're clear for now" hint="Add a task or check Upcoming." icon="✨" />
    </section>
</template>

<script setup>
import { computed } from "vue"
import { useAppStore } from "../stores/app.js"
import TaskList from "../components/TaskList.vue"
import EmptyState from "../components/EmptyState.vue"
import { useFilteredTasks } from "../composables/useFilteredTasks.js"

const app = useAppStore()
const base = computed(() => app.todayTasks)
const filtered = useFilteredTasks(base)
</script>
