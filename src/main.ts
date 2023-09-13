import './assets/main.css'
import CoreuiVue from '@coreui/vue';
import "@coreui/coreui/scss/coreui.scss";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(CoreuiVue)

app.mount('#app')