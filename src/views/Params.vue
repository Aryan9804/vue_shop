<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器区域 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
              }"
            @change="handleChange"
            clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs 标签页区域 -->
      <el-tabs @tab-click="handleTabClick" v-model="activeName">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="selectedCateKeys.length === 3 ? false:true"
            @click="addParamDialogVisible = true">添加参数</el-button>
          <!-- 动态参数的渲染列表 -->
          <el-table :data="dynamicParameters" border stripe>
            <!-- 添加一个展开列 -->
            <el-table-column type="expand">
              <!-- 使用作用域插槽的形式接收该行的数据 -->
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 添加索引列 -->
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <!-- 添加索引列 -->
            <el-table-column prop="attr_name" label="参数名称" width="500"></el-table-column>
            <!-- 添加操作列 -->
            <el-table-column label="操作" width="500">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button type="primary" size="mini" :disabled="selectedCateKeys.length === 3 ? false:true" @click="addParamDialogVisible = true">添加属性</el-button>
          <!-- 静态属性的渲染列表 -->
          <el-table :data="staticProperties" border stripe>
            <!-- 添加一个展开列 -->
            <el-table-column type="expand">
              <!-- 使用作用域插槽的形式接收该行的数据 -->
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 添加索引列 -->
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <!-- 添加索引列 -->
            <el-table-column prop="attr_name" label="属性名称" width="500"></el-table-column>
            <!-- 添加操作列 -->
            <el-table-column label="操作" width="500">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <!--
      title: 设置对话框的title，可以通过数据绑定来实现动态展示
      visible: 控制会话框的展示和关闭
      width: 控制对话框的宽度
      @close="addDialogClosed": 监听会话框的关闭事件
     -->
    <el-dialog
      :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="addParamDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 表单数据 -->
      <!--
        :model="addForm"：绑定表单数据
        :rules="addFormRules"：给表单校验设置规则
        ref="addFormRef"：给这个元素标记记号
        :label="activeName === 'many' ? '动态参数' : '静态属性'"：给输入框绑定要展示的名字是什么
        prop="attr_name"：保存的是哪个值
        v-model="addForm.attr_name"：输入的内容保存在addForm.attr_name中
       -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '编辑动态参数' : '编辑静态属性'"
      :visible.sync="editParamDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!-- 表单数据 -->
      <!--
        :model="addForm"：绑定表单数据
        :rules="addFormRules"：给表单校验设置规则
        ref="addFormRef"：给这个元素标记记号
        :label="activeName === 'many' ? '动态参数' : '静态属性'"：给输入框绑定要展示的名字是什么
        prop="attr_name"：保存的是哪个值
        v-model="addForm.attr_name"：输入的内容保存在addForm.attr_name中
       -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 商品分类列表数据
      cateList: [],
      cateForm: {
        // 分类名称
        cat_name: '',
        // 分类id
        cat_id: 0
      },
      // 选中的分类id数组
      selectedCateKeys: [],
      // 默认展示那个tab
      activeName: 'many',
      // 动态参数数据
      dynamicParameters: [],
      // 静态属性数据
      staticProperties: [],
      // 控制添加对话空的显示与隐藏
      addParamDialogVisible: false,
      // 用户输入的数据
      input: '',
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 表单校验
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制编辑对话空的显示与隐藏
      editParamDialogVisible: false,
      // 编辑的数据对象
      editForm: {

      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取分类数据
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data
    },
    // 获取动态参数/静态属性数据
    async getData() {
      // 判断选中的是否为三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      // 选择的是三级分类发起数据请求
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.$message.success('数据获取成功！')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      // 拿到数据之后需要判断是动态参数还是静态属性
      // if (res.data[0].attr_sel === 'many') {
      if (this.activeName === 'many') {
        // many代表动态参数
        // 满足条件，保存到dynamicParameters
        this.dynamicParameters = res.data
      } else {
        // 满足条件，保存到staticProperties
        this.staticProperties = res.data
      }
      console.log(this.dynamicParameters)
      console.log(this.staticProperties)
    },
    // 级联选择框中选项变化，会触发这个函数
    handleChange() {
      this.getData()
    },
    // tab 被选中时触发
    handleTabClick() {
      // 获取动态参数/静态属性数据
      this.getData()
    },
    // 控制显示和隐藏对话框
    addParam() {
      // 验证表单是否合法
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        // 关闭会话框
        this.addParamDialogVisible = false
        // 刷新数据
        this.getData()
        this.$message.success('添加成功！')
      })
    },
    // 对话框关闭时触发该函数
    addDialogClosed() {
      // 清空校验规则
      this.$refs.addFormRef.resetFields()
    },
    // 监听编辑的函数
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数数据失败！')
      }
      this.editForm = res.data
      this.editParamDialogVisible = true
    },
    // 关闭会话框
    editDialogClosed() {
      // 重置表单
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮修改参数
    editParam() {
      // 验证输入的内容是否通过校验
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败！')
        }
        // 关闭弹窗
        this.editParamDialogVisible = false
        // 刷新数据
        this.getData()
        // 提示文字
        this.$message.success('编辑成功！')
      })
    },
    // 删除参数
    async deleteParam(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      // 刷新数据
      this.getData()
    },
    // 文本框失去焦点或者按下了enter键都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入了内容，需要做后续的处理
      row.attr_vals.push(row.inputValue.trim())
      // 添加完成之后情况输入框中的内容
      row.inputValue = ''
      // 关闭输入框
      row.inputVisible = false
      // 前端完成添加之后，需要发送请求将数据持久化到数据库中
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败！')
      }
      this.$message.success('添加成功！')
    },
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用，当页面元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 将对attr_vals的操作保存到数据库
    async saveAttrValue(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败！')
      }
      this.$message.success('添加成功！')
    },
    // 删除对应的参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrValue(row)
    }
  },
  computed: {
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-alert {
  margin-bottom: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-left: 10px;
  }
</style>
