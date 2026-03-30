import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg"],
            manifest: {
                name: "Stride",
                short_name: "Stride",
                description: "Local-first tasks",
                theme_color: "#0D0D0D",
                background_color: "#0D0D0D",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/favicon.svg",
                        sizes: "any",
                        type: "image/svg+xml",
                        purpose: "any maskable",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,svg,woff2,ttf}"],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        target: "es2020",
        cssCodeSplit: true,
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    "vendor-vue": ["vue", "vue-router", "pinia"],
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
})
