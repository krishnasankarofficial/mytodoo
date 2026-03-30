<template>
    <div v-if="err" class="p-6 rounded-xl border border-red/50 bg-gray text-red text-sm text-left max-w-lg mx-auto">
        <p class="font-PoppinsBold mb-2">Something went wrong</p>
        <p class="text-light/80 mb-4">{{ err }}</p>
        <button type="button" class="px-4 py-2 rounded-lg bg-red text-dark font-PoppinsBold" @click="reload">
            Reload page
        </button>
    </div>
    <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from "vue"

const err = ref(null)

onErrorCaptured((e) => {
    err.value = e && e.message ? e.message : String(e)
    return false
})

function reload() {
    window.location.reload()
}
</script>
