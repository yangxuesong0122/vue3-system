import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_APP_URL
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token")
  Nprogress.start()
  return config
})
axios.interceptors.response.use((config) => {
  Nprogress.done()
  return config
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
