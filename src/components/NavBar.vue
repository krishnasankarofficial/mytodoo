<template>
    <nav class="flex flex-wrap gap-2 justify-center md:justify-start items-center border-b border-light/10 pb-3 mb-4">
        <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-3 py-1.5 rounded-lg text-sm font-PoppinsBold transition-colors"
            :class="
                route.path === link.to
                    ? 'bg-red/90 text-dark'
                    : 'text-light/80 hover:bg-gray'
            "
        >
            {{ link.label }}
        </RouterLink>
    </nav>
</template>

<script setup>
import { useRoute } from "vue-router"

const route = useRoute()

const links = [
    { to: "/today", label: "Today" },
    { to: "/upcoming", label: "Upcoming" },
    { to: "/all", label: "All" },
    { to: "/completed", label: "Done" },
    { to: "/trash", label: "Trash" },
    { to: "/focus", label: "Focus" },
]
</script>
