<template>
    <Transition name="modal">
        <div
            v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm"
            @click.self="cancel"
        >
            <div
                class="w-[90vw] max-w-md bg-dark border border-light/20 rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
                role="dialog"
                aria-modal="true"
            >
                <h3 class="text-lg font-PoppinsBold text-light">{{ title }}</h3>
                <p class="text-sm text-light/80">{{ message }}</p>
                <div class="flex gap-3 justify-end">
                    <button
                        type="button"
                        class="px-4 py-2 rounded-xl border border-light/30 hover:bg-gray text-sm font-Poppins"
                        @click="cancel"
                    >
                        {{ cancelText }}
                    </button>
                    <button
                        type="button"
                        class="px-4 py-2 rounded-xl bg-red text-dark font-PoppinsBold text-sm hover:opacity-90"
                        @click="confirm"
                    >
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)
const title = ref("")
const message = ref("")
const confirmText = ref("OK")
const cancelText = ref("Cancel")
let resolvePromise = null

function show(options = {}) {
    title.value = options.title || "Confirm"
    message.value = options.message || "Are you sure?"
    confirmText.value = options.confirmText || "OK"
    cancelText.value = options.cancelText || "Cancel"
    isOpen.value = true

    return new Promise((resolve) => {
        resolvePromise = resolve
    })
}

function confirm() {
    isOpen.value = false
    if (resolvePromise) {
        resolvePromise(true)
        resolvePromise = null
    }
}

function cancel() {
    isOpen.value = false
    if (resolvePromise) {
        resolvePromise(false)
        resolvePromise = null
    }
}

defineExpose({ show })
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .rounded-2xl,
.modal-leave-active .rounded-2xl {
    transition: transform 0.2s ease;
}

.modal-enter-from .rounded-2xl {
    transform: scale(0.95);
}

.modal-leave-to .rounded-2xl {
    transform: scale(0.95);
}
</style>
