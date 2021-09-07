<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle_button" @click="toggleCollapse">
      <i :width="'24px'" :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
    </div>
    <el-menu
      background-color="#323743"
      text-color="#fff"
      active-text-color="#409bff"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath"
    >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in navList" :key="item.id">
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]" v-show="isShow"></i>
          <!-- 文本 -->
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="childItem.path"
          v-for="childItem in item.children"
          :key="childItem.id"
          @click="saveNavState(childItem.path)"
        >
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{ childItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'NavMenu',
  mounted() {
    // 给$bus绑定hello事件
    this.$bus.$on('getList', (list) => {
      console.log('接收到了数据：', list)
      this.navList = list
    })
    this.activePath = sessionStorage.getItem('activePath')
  },
  // 解除绑定
  beforeDestroy() {
    this.$bus.$off('getList')
    console.log('解除了绑定')
  },
  data() {
    return {
      navList: [],
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-check',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      // 是否折叠
      isCollapse: false,
      // 是否展示图标
      isShow: true,
      // 激活的路径
      activePath: ''
    }
  },
  methods: {
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      // this.isShow = !this.isShow
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
  .toggle_button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .i {
    width: 24px;
  }
}
</style>
