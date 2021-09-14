<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索与添加区域 -->
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>

      </el-row>
      <!-- 表格 -->
      <ZkTable
      class="treeTable"
      :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
      :show-row-hover="false">
      <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </ZkTable>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <!-- 添加分类组件 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- <el-input v-model="addCateForm.cat_name"></el-input> -->
          <!-- options：指定数据源 -->
          <!-- props：用于指定配置对象 -->
          <!-- <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            v-model="selectedKeys"
            @change="parentCateChanged"
            :props="cascaderProps">
          </el-cascader> -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
            }"
            @change="parentCateChanged">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      queryInfo: {
      //  查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      //  总数据条数
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 标识将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用的模板名称
        template: 'isok'
      }, {
        label: '排序',
        // 标识将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用的模板名称
        template: 'order'
      }, {
        label: '操作',
        // 标识将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用的模板名称
        template: 'opt'
      }],
      // 控制对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类的等级，默认添加的等级为1级
        cat_level: 0
      },
      // 校验规则
      addCateFormRules: {
        cat_name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级分类的id数组
      selectedKeys: []
      // 指定级联选择器的对象
      // cascaderProps: {
      //   value: 'cat_id',
      //   label: 'cat_name',
      //   children: 'children'
      // }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('/categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      this.$message.success('获取商品分类成功！')
    },
    // 监听pagesize的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // 重新请求列表
      this.getCateList()
    },
    // 监听pagenum的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // 重新请求列表
      this.getCateList()
    },
    // 显示对话框
    showAddCateDialog() {
      // 先获取父级分类数据
      this.getParentCateList()
      // 再展示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        parmas: {
          type: 1
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化的时候，触发这个函数
    parentCateChanged() {
      // 改变
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0，证明用户选中了父级分类
      // 反之，就说明没有选中父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        // 终止程序
        return
      } else {
        // 如果没有走上面的if，则证明用户没有选中父级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate( async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        // 刷新数据
        this.getCateList()
        // 关闭窗口
        this.addCateDialogVisible = false
      })
    },
    // 当会话框关闭的时候，触发该函数
    addCateDialogClosed() {
      // 重置表单元素
      this.$refs.addCateFormRef.resetFields()
      // 重置数组
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
