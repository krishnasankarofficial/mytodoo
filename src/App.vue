<script setup>
import { computed } from "vue"
import { useStore } from "vuex"
import Home from "./components/Home.vue"

const store = useStore()

const showToast = computed(
    () => store.state.notify && Boolean(store.state.notification.message),
)
const toastMessage = computed(() => store.state.notification.message)
const toastIsError = computed(() => store.state.notification.type === "error")
</script>

<template>
  <main class="w-full h-full bg-dark text-light font-Poppins flex items-center justify-center overflow-hidden mt-24">
    <Home />
    <div
      v-if="showToast"
      role="status"
      aria-live="polite"
      class="fixed bottom-6 left-1/2 z-[60] max-w-[min(90vw,24rem)] -translate-x-1/2 rounded-xl border-2 px-4 py-3 text-center text-sm font-PoppinsBold shadow-lg md:text-base"
      :class="toastIsError ? 'border-red bg-gray text-red' : 'border-light bg-gray text-light'"
    >
      {{ toastMessage }}
    </div>
  </main>
</template>

<style>
  body{
    overflow: hidden;
  }
</style>
