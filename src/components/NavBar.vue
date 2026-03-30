<template>
    <nav class="flex flex-wrap gap-2 justify-center md:justify-start items-center border-b border-light/10 pb-3 mb-4">
        <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-3 py-1.5 rounded-lg text-sm font-PoppinsBold transition-colors flex items-center gap-1.5"
            :class="
                route.path === link.to
                    ? 'bg-red/90 text-dark'
                    : 'text-light/80 hover:bg-gray'
            "
        >
            <component :is="link.icon" :size="16" :stroke-width="2.5" />
            {{ link.label }}
        </RouterLink>
    </nav>
</template>

<script setup>
import { useRoute } from "vue-router"
import { CalendarDays, CalendarClock, ListTodo, CheckCircle2, Trash2, Target } from "lucide-vue-next"

const route = useRoute()

const links = [
    { to: "/today", label: "Today", icon: CalendarDays },
    { to: "/upcoming", label: "Upcoming", icon: CalendarClock },
    { to: "/all", label: "All", icon: ListTodo },
    { to: "/completed", label: "Done", icon: CheckCircle2 },
    { to: "/trash", label: "Trash", icon: Trash2 },
    { to: "/focus", label: "Focus", icon: Target },
]
</script>
