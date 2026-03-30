<template>
    <div class="py-12 px-4 text-center border border-dashed border-light/20 rounded-2xl bg-gray/30">
        <div class="text-4xl mb-3 opacity-40">{{ icon }}</div>
        <p class="font-PoppinsBold text-lg text-light/90">{{ title }}</p>
        <p v-if="hint" class="mt-2 text-sm text-light/50 max-w-sm mx-auto">{{ hint }}</p>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, default: "Nothing here" },
    hint: { type: String, default: "" },
    icon: { type: String, default: "📭" },
})
</script>
