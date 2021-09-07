<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <Header/>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
        <NavMenu/>
      <!-- 右侧内容主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavMenu from './NavMenu.vue'
import Header from './Header.vue'
export default {
  name: 'Home',
  components: {
    NavMenu,
    Header
  },
  created() {
    // 获取菜单栏数据
    this.getMenuList()
  },
  data() {
    return {
      menulist: []
    }
  },
  methods: {
    // 退出登录
    logout() {
      sessionStorage.removeItem('token')
      // 弹窗提醒退出成功
      this.$message.success('退出登录！')
      // 使用编程导航，跳转到/login页面
      this.$router.push('/login')
    },
    // 获取菜单数据
    getMenuList() {
      this.$http.get('menus').then((response) => {
        // 将获取的菜单列表数据保存到menulist数组里面
        this.menulist = response.data.data
        console.log('response：', response)
        this.sendMenulist()
      }).catch((error) => {
        console.log(error)
      })
    },
    // 发送数据的方法
    sendMenulist() {
      console.log('触发了send方法')
      this.$bus.$emit('getList', this.menulist)
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
