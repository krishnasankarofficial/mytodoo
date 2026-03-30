import { createRouter, createWebHistory } from "vue-router"
import { applyRouteSeo } from "../utils/seo.js"

const TodayView = () => import("../views/TodayView.vue")
const UpcomingView = () => import("../views/UpcomingView.vue")
const CompletedView = () => import("../views/CompletedView.vue")
const TrashView = () => import("../views/TrashView.vue")
const FocusView = () => import("../views/FocusView.vue")
const AllView = () => import("../views/AllView.vue")
const StreakView = () => import("../views/StreakView.vue")
const AboutView = () => import("../views/AboutView.vue")
const DocsView = () => import("../views/DocsView.vue")

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", redirect: "/today" },
        {
            path: "/today",
            name: "today",
            component: TodayView,
            meta: {
                title: "Today",
                description:
                    "See what’s due today in Stride — a private, offline-capable task list that stays on your device. No account required.",
            },
        },
        {
            path: "/upcoming",
            name: "upcoming",
            component: UpcomingView,
            meta: {
                title: "Upcoming",
                description:
                    "Upcoming due dates in Stride: plan ahead with natural-language dates, tags, and priorities. Local-first, private tasks.",
            },
        },
        {
            path: "/completed",
            name: "completed",
            component: CompletedView,
            meta: {
                title: "Completed",
                description:
                    "Review completed tasks in Stride. Your history stays in the browser — export JSON backups anytime.",
            },
        },
        {
            path: "/trash",
            name: "trash",
            component: TrashView,
            meta: {
                title: "Trash",
                description:
                    "Deleted tasks in Stride. Restore items or clear them permanently from local storage on this device.",
            },
        },
        {
            path: "/focus",
            name: "focus",
            component: FocusView,
            meta: {
                title: "Focus",
                description:
                    "Pomodoro-style focus mode in Stride — timed deep work sessions with your local task list.",
            },
        },
        {
            path: "/all",
            name: "all",
            component: AllView,
            meta: {
                title: "All tasks",
                description:
                    "Browse every task in Stride — search, filter by tags, and manage priorities in one private list.",
            },
        },
        {
            path: "/streak",
            name: "streak",
            component: StreakView,
            meta: {
                title: "Streak",
                description:
                    "Track task consistency with Stride’s streak heatmap. Private analytics — no cloud, no account.",
            },
        },
        {
            path: "/about",
            name: "about",
            component: AboutView,
            meta: {
                title: "About",
                description:
                    "About Stride: a focused, private task app. Your lists stay on your device — not in someone else’s cloud.",
            },
        },
        {
            path: "/docs",
            name: "docs",
            component: DocsView,
            meta: {
                title: "Documentation",
                description:
                    "Stride documentation: keyboard shortcuts, import and export, recurring tasks, Pomodoro, streaks, and privacy.",
            },
        },
    ],
    scrollBehavior() {
        return { top: 0 }
    },
})

router.afterEach((to) => {
    applyRouteSeo(to)
})
