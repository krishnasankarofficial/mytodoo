<template>
    <section class="space-y-8 text-left pb-8">
        <div>
            <h2 class="text-xl font-PoppinsBold mb-2">About Stride</h2>
            <p class="text-sm text-light/50 max-w-xl">
                Stride is a focused, private task app for people who want their lists on their device — not in someone
                else's cloud.
            </p>
        </div>

        <div class="rounded-xl border border-light/15 bg-gray/40 p-6 space-y-4">
            <h3 class="font-PoppinsBold text-green text-base">What it does</h3>
            <p class="text-sm text-light/80 leading-relaxed">
                Plan your day, capture tasks with natural language due dates, organize with tags and priorities, break work
                into subtasks, and repeat recurring work without retyping. Use
                <strong class="text-light">Today</strong> for what’s due now,
                <strong class="text-light">Focus</strong> for Pomodoro-style deep work, and
                <strong class="text-light">Streak</strong> to see consistency over time. Everything stays in your browser:
                fast, offline-capable, and yours.
            </p>
        </div>

        <div class="rounded-xl border border-light/15 bg-gray/40 p-6 space-y-4">
            <h3 class="font-PoppinsBold text-green text-base">Privacy &amp; data</h3>
            <ul class="text-sm text-light/80 space-y-2 list-disc list-inside leading-relaxed">
                <li>No account or sign-up. No servers holding your tasks.</li>
                <li>Data lives in <strong class="text-light">local storage</strong> on this device only.</li>
                <li>Clearing site data or another browser profile won’t see your lists — export JSON backups when you care about keeping a copy.</li>
                <li>Optional scheduled downloads can drop backups in your Downloads folder on a timer you control.</li>
            </ul>
        </div>

        <div class="rounded-xl border border-light/15 bg-gray/40 p-6 space-y-4">
            <h3 class="font-PoppinsBold text-green text-base">Learn more</h3>
            <p class="text-sm text-light/80 leading-relaxed">
                For keyboard shortcuts, Quick Add examples, storage details, and every feature in one place, open
                <RouterLink to="/docs" class="text-red font-PoppinsBold hover:underline">Documentation</RouterLink>
                or press <kbd class="px-1.5 py-0.5 rounded bg-dark border border-light/25 font-mono text-[11px]">Alt+8</kbd>.
            </p>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from "vue-router"
</script>
