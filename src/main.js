import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入控制全局的样式，html、body、#app
import '@/assets/css/global.css'
// 引入elementui，并注册
import ElementUI from 'element-ui'
// 引入axios文件
import axios from 'axios'

// 给axios做配置
// 1. 配置公共根地址:查询接口文档，复制粘贴线上接口地址，因为后面接口都有v1_0，所以将它也设置入公共地址中
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 2. 将axios配置为Vue成员，名为$http，这个名字是自定义的
Vue.prototype.$http = axios
// ElementUI注册为中间件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
