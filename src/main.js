import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(LoadingPlugin)
app.mount('#app')
