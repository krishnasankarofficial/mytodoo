import { createRouter, createWebHistory } from "vue-router"

const TodayView = () => import("../views/TodayView.vue")
const UpcomingView = () => import("../views/UpcomingView.vue")
const CompletedView = () => import("../views/CompletedView.vue")
const TrashView = () => import("../views/TrashView.vue")
const FocusView = () => import("../views/FocusView.vue")
const AllView = () => import("../views/AllView.vue")
const StreakView = () => import("../views/StreakView.vue")

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", redirect: "/today" },
        { path: "/today", name: "today", component: TodayView, meta: { title: "Today" } },
        { path: "/upcoming", name: "upcoming", component: UpcomingView, meta: { title: "Upcoming" } },
        { path: "/completed", name: "completed", component: CompletedView, meta: { title: "Completed" } },
        { path: "/trash", name: "trash", component: TrashView, meta: { title: "Trash" } },
        { path: "/focus", name: "focus", component: FocusView, meta: { title: "Focus" } },
        { path: "/all", name: "all", component: AllView, meta: { title: "All" } },
        { path: "/streak", name: "streak", component: StreakView, meta: { title: "Streak" } },
    ],
    scrollBehavior() {
        return { top: 0 }
    },
})
