<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {
    // 退出登录
    logout               () {
      sessionStorage.removeItem('token')
      // 弹窗提醒退出成功
      this.$message.success('退出登录！')
      // 使用编程导航，跳转到/login页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
