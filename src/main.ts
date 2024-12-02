import { createApp } from 'vue'
import pinia from './stores'
import { setupStore } from './stores'
import router from './router'
import App from './App.vue'
import { registerApp } from './global'
import VueGtag from 'vue-gtag'
import { initStyle } from './assets/style'

const app = createApp(App)

app.use(router)
app.use(pinia)

// app.use(function(app)) 会自动传入 app对象
app.use(registerApp)
// 谷歌分析
app.use(VueGtag, {
  config: { id: 'G-VDQ4NVKRCR' }
})
//设置样式
initStyle()
// 刷新 重置 vux，避免数据消失
setupStore()

app.mount('#app')
