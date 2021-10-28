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
// 导入 vue-quill-editor 组件
import VueQuillEditor from 'vue-quill-editor'
// 导入 nprogress 组件
import NProgress from 'nprogress'
// 导入 nprogress 对应的 js
import 'nprogress/nprogress.css'

// 导入富文本组件的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 设置访问基本路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 在 request 拦截器中，展示进度条 NProgress。start().

axios.interceptors.request.use(config => {
  // 开启进度条
  NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  // console.log(config);
  return config
})
// 在 response 拦截器中，隐藏 NProgress 进度条 NProgress。done()
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})
// 在Vue的原型上添加一个属性，让每一个组件都能访问到http来使用axios
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册
Vue.component('ZkTable', ZkTable)
// 全局注册富文本组件
Vue.use(VueQuillEditor)
// 注册一个数据过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  // 因为月份返回的是从0-11 所以需要手动加1
  // padStart 当不足两位数时，已0来填充
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hours = (dt.getHours() + '').padStart(2, '0')
  const minutes = (dt.getMinutes() + '').padStart(2, '0')
  const seconds = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

new Vue({
  router,
  render: h => h(App),
  // 安装全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
