import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/globel.css'
// 导入axios
import axios from 'axios'
// 导入vue-table-with-tree-grid组件
import ZkTable from 'vue-table-with-tree-grid'
// 设置访问基本路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  // console.log(config);
  return config
})
// 在Vue的原型上添加一个属性，让每一个组件都能访问到http来使用axios
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册
Vue.component('ZkTable', ZkTable)

new Vue({
  router,
  render: h => h(App),
  // 安装全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
