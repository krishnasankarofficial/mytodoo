import "./assets/css/base.css"

import { createApp } from "vue"
import App from "./App.vue"
import store from "./store/index.js"

const app = createApp(App)

app.use(store)

app.config.errorHandler = (err, _instance, info) => {
    if (import.meta.env.DEV) {
        console.error("[Vue error]", err, info)
    }
}

app.mount("#app")
