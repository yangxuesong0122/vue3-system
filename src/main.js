import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import './index.css'
import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_APP_URL

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
