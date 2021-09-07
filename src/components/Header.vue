<template>
  <div>
    <img src="../assets/123.jpg" alt="" />
    <span>电商后台管理系统</span>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="less" scoped>

div {
  display: flex;
  align-items: center;
  span {
    margin-left: 15px;
  }
  img {
    width: 60px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>