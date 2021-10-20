<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域-->
    <el-card>
      <!-- 123 -->
      <el-row :gutter="20">
        <!-- 第一列 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 第二列 -->
        <el-col :span="4">
          <el-button type="primary"  @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元）" prop="goods_price" width="130px"></el-table-column>
        <el-table-column label="商品质量" prop="goods_weight" width="95px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      // 请求数据需要的参数对象
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      total: 0
    }
  },
  created() {
    // 进入页面就请求商品数据
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get(`/goods`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败！')
      }
      this.$message.success('获取商品列表数据成功！')
      this.goodsList = res.data.goods
      this.total = res.data.total

    },
    // pageSize 改变时会触发 每页条数
    handleSizeChange(newSize) {
      // 改变pagesize的时候，会触发handleSizeChange 函数，这个函数可以传递新的pagesize，
      // 这时候我们需要将 新的pagesize 更新到 data 里面的pagesize，以便于我们以这个新的pagesize来重新请求数据
      this.queryInfo.pagesize = newSize
      // 刷新页面
      this.getGoodsList()
    },
    // currentPage 改变时会触发 当前页
    handleCurrentChange(newCurrentVal) {
      // 改变currentPage的时候，会触发 handleCurrentChange 函数，这个函数可以传递新的 currentPage ，
      // 这时候我们需要将 新的 currentPage 更新到 data 里面的 pagenum ，以便于我们以这个新的 pagenum 来重新请求数据
      this.queryInfo.pagenum = newCurrentVal
      // 刷新页面数据
      this.getGoodsList()
    },
    // 删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info("已取消删除！")
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    // 添加商品
    goAddpage() {
      this.$router.push('/add')
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
</style>
