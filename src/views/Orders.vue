<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域-->
    <el-card>
      <!-- 第一列 -->
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" @click="queryOrderKey" clearable @clear="getOrdersList">
          <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
        </el-input>
      </el-col>
      <el-table :data="ordersList.goods" border stripe>
        <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number" width="210px"></el-table-column>
          <el-table-column label="订单价格" prop="order_price" width="130px"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status" width="95px">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send" width="140px"></el-table-column>
          <el-table-column label="下单时间" prop="create_time" width="95px">
            <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130px">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="dialogVisible = true"></el-button>
              <el-button type="success" size="mini" icon="el-icon-location" @click="showLogisticsProgressDialog"></el-button>
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
        :total="ordersList.total" background>
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearFormData">
      <!-- from 表单区域 -->
      <el-form :model="updateAddressForm" :rules="updateAddressRules" ref="updateAddressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address">
          <el-cascader :options="cityData" clearable v-model="updateAddressForm.address"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="updateAddressForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="logisticsProgress"
      width="50%">
      <!-- 物流进度时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../assets/citydata.js'
export default {
  name: 'Orders',
  data () {
    return {

      // 查询对象
      queryInfo: {
        // 查询条件
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10

      },
      // 订单列表数据
      ordersList: {
        total: 0,
        pagenum: '1',
        goods: [

        ]
      },
      // 控制会话框是否展示的变量
      dialogVisible: false,
      options: [{
        value: '选项1',
        label: '成都'
      }, {
        value: '选项2',
        label: '贵阳'
      }],
      // 输入的详细地址
      inputAddress: '',
      updateAddressForm: {
        address: [],
        detailAddress: ''
      },
      updateAddressRules: {
        address: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 城市数据
      cityData: cityData,
      // 控制物流信息对话框的展示与隐藏
      logisticsProgress: false,
      // 物流 id
      logisticsId: '1106975712662',
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('/orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('订单列表数据获取失败！')
      }
      this.$message.success('订单列表数据获取成功！')
      // 将服务器返回的数据保存到 data 中
      this.ordersList = res.data
    },
    // pageSize 改变时会触发 每页条数
    handleSizeChange(newSize) {
      // 改变pagesize的时候，会触发handleSizeChange 函数，这个函数可以传递新的pagesize，
      // 这时候我们需要将 新的pagesize 更新到 data 里面的pagesize，以便于我们以这个新的pagesize来重新请求数据
      this.queryInfo.pagesize = newSize
      // 刷新页面
      this.getOrdersList()
    },
    // currentPage 改变时会触发 当前页
    handleCurrentChange(newCurrentVal) {
      // 改变currentPage的时候，会触发 handleCurrentChange 函数，这个函数可以传递新的 currentPage ，
      // 这时候我们需要将 新的 currentPage 更新到 data 里面的 pagenum ，以便于我们以这个新的 pagenum 来重新请求数据
      this.queryInfo.pagenum = newCurrentVal
      // 刷新页面数据
      this.getOrdersList()
    },
    // 查找商品
    queryOrderKey() {
      this.getOrdersList()
    },
    // 会话框将要关闭时触发
    clearFormData() {
      // this.updateAddressForm = {}
      // 清空表单
      this.$refs.updateAddressRef.resetFields()
    },
    // 展示与隐藏物流进度会话框以及查询物流信息
    async showLogisticsProgressDialog() {
      // 发起请求
      const { data: res } = await this.$http.get(`/kuaidi/${this.logisticsId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.$message.success('获取物流进度成功！')
      // 将服务器返回的物流进度数据保存到 data 中
      this.progressInfo = res.data
    }
  }

}
</script>

<style scoped>
.el-table {
  align-content: center;
}
.el-cascader {
  width: 100%;
}
@import '../plugins/timeline/timeline.css';
@import '../plugins/timeline-item/timeline-item(1).css';
</style>
