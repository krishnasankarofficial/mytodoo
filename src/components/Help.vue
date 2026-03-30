<template>
    <div
        v-show="showHelp"
        role="dialog"
        aria-labelledby="help-title"
        class="w-80 lg:w-[min(32rem,90vw)] max-h-[85vh] flex flex-col items-stretch bg-dark border border-light/80 shadow-xl p-0 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
    >
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray">
            <h2 id="help-title" class="font-PoppinsBold text-lg">Help &amp; shortcuts</h2>
            <button
                type="button"
                class="min-w-[2rem] min-h-[2rem] rounded-full bg-red text-dark font-PoppinsBold text-sm hover:opacity-90"
                aria-label="Close help"
                @click="setShowHelp(false)"
            >
                ×
            </button>
        </div>
        <div class="flex flex-col gap-3 w-full overflow-y-auto p-4 text-sm text-left">
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Storage</h3>
                <p class="text-light/90">Tasks live in this browser only. They are not synced to a server. Clearing site data or using a private window will remove them.</p>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Keyboard</h3>
                <ul class="list-disc list-inside space-y-1 text-light/90">
                    <li><kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">Alt</kbd> + <kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">H</kbd> — open this panel</li>
                    <li><kbd class="px-1 rounded bg-dark border border-light/30 font-mono text-xs">Escape</kbd> — close this panel</li>
                </ul>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Add a task</h3>
                <p class="text-light/90">Type in the field, then press Enter or tap Add. New tasks appear under Open.</p>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Complete</h3>
                <p class="text-light/90">Use the circle control on an open task to mark it done. It moves to Done.</p>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-red mb-1">Reopen</h3>
                <p class="text-light/90">Use the check control on a completed task to mark it not done. It returns to Open.</p>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-green mb-1">Edit</h3>
                <p class="text-light/90">Choose the edit control, change the text, then Save.</p>
            </section>
            <section class="p-3 bg-gray rounded-xl">
                <h3 class="font-PoppinsBold text-red mb-1">Delete</h3>
                <p class="text-light/90">Use the delete control on a task to remove it permanently.</p>
            </section>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
            showHelp: state => state.showHelp,
        })
    },
    methods:{
        ...mapActions(['setShowHelp'])
    },
}
</script>
