<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片局域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table  :data="users" border style="width: 100%">
        <!-- 第一列：索引列 -->
        <el-table-column type="index" label="#">
        </el-table-column>
        <!-- 第二列：姓名 -->
        <!--prop：要渲染的数据 label：列名-->
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <!-- 第三列：邮箱 -->
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <!-- 第四列：电话 -->
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <!-- 第五列：角色 -->
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <!-- 第六列：状态 -->
        <el-table-column label="状态">
          <!-- slot-scope这个属性可以获取这一行的所有数据 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 第七列：操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip class="item" effect="dark" content="点击编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="点击删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" circle @click="setRole(scope.row)"></el-button>
            </el-tooltip>

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
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="cleanForm()"
      >
      <!-- 表单区域 -->
      <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false; addUser(addForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialogVisible"
      width="30%"
      @close="cleanEditForm">
      <!-- 需要修改的用户表单 -->
      <el-form status-icon :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改表单的下方 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserDialogVisible = false; editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  created() {
    this.getUserList()
  },
  data() {
    // 验证邮箱的正则
    var checkEmail = (rule, email, cb) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(email)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的正则
    var checkMobile = (rule, mobile, cb) => {
      const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (regMobile.test(mobile)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前页显示的数据条数
        pagesize: 5
      },
      // 用户数据
      users: [],
      // 用户数据总条数
      total: 0,
      // 控制用户添加对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        // 用户名
        username: '',
        // 密码
        password: '',
        // 邮箱
        email: '',
        // 手机
        mobile: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editUserDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {

      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        // 删除信息弹窗是否显示
        showDeleteInfo: false
      },
      // 设置角色的对话框是否展示
      setRoleDialogVisible: false,
      // 需要被分配权限的角色
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  methods: {
    // 获取用户数据列表
    getUserList() {
      this.$http
        .get('/users', { params: this.queryInfo })
        .then((response) => {
          this.users = response.data.data.users
          this.total = response.data.data.total
          this.$message.success('获取用户列表数据成功')
          console.log(response)
        })
        .catch((error) => {
          this.$message.error('获取用户列表数据失败')
          console.log(error)
        })
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // 当pagesize改变时，将newSize赋值给pagesize
      this.queryInfo.pagesize = newSize
      // 重新发起请求获取当前页的数据
      this.getUserList()
      console.log(`每页 ${newSize} 条`)
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPageNum) {
      // 当页码改变的时候，重新给pagenum赋新的值
      this.queryInfo.pagenum = newPageNum
      // 重新请求新页面的数据
      this.getUserList()
      console.log(`当前页: ${newPageNum}`)
    },
    // 监听switch的状态改变
    userStateChanged(userInfo) {
      this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`).then((response) => {
        this.$message.success('更新用户状态成功')
        console.log(response)
      }).catch((error) => {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('更新用户状态失败')
        console.log(error)
      })
    },
    // 将添加的输入保存到数据库中
    addUser() {
      // 添加用户之前的预校验
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        // 预验证通过，可以发起添加用户的请求
        // 调用添加用户的接口
        this.$http.post('/users', this.addForm).then((response) => {
          if (response.data.meta.status === 201) {
            this.$message.success('添加成功！')
          } else if (response.data.meta.status !== 201) {
            this.$message.error(response.data.meta.msg)
          }
          // 重新刷新当前用户数据
          this.getUserList()
        }).catch((error) => {
          this.$message.error('添加失败！')
          console.log(error)
        })
      })
    },
    // 清空表单
    cleanForm() {
      // this.addForm = {
      //   // 用户名
      //   username: '',
      //   // 密码
      //   password: '',
      //   // 邮箱
      //   email: '',
      //   // 手机
      //   mobile: ''
      // }
      this.$refs.addFormRef.resetFields()
    },
    // 显示编辑用户的对话框
    showEditDialog(id) {
      // 显示对话框
      this.editUserDialogVisible = true
      // 发送修改用户信息的请求
      this.$http.get(`/users/${id}`).then((response) => {
        console.log(response)
        this.$message.success(response.data.meta.msg)
        // 将修改的数据保存到数据库中
        this.editForm = response.data.data
      }).catch((error) => {
        this.$message.error('修改失败！')
        console.log(error)
      })
    },
    // async showEditDialog(id) {
    //   // 显示对话框
    //   this.editUserDialogVisible = true
    //   // 发送修改用户信息的请求
    //   const { data: res } = await this.$http.get('/users/' + id)
    //   if (res.status !== 200) {
    //     return this.$message.error('获取用户信息失败！')
    //   }
    //   this.editForm = res.data
    // }
    // 清空表单
    cleanEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑
    editUser() {
      this.$refs.editFormRef.validate((validate) => {
        if (!validate) {
          return
        }
        // 预验证通过，可以发起修改用户数据的请求
        this.$http.put(`/users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }).then((response) => {
          // 刷新数据
          this.getUserList()
          // 弹出消息框
          this.$message.success(response.data.meta.msg)
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    // 根据Id删除用户
    removeUserById(id) {
      // 是否删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/users/` + id).then((response)=> {
          if(response.data.meta.status !== 200){
            return this.$message.error(response.data.meta.msg)
          }
          this.$message.success('删除用户成功！')
          this.getUserList()
        }).catch((error)=> {
          this.$message.error(error.msg)
        })
        //  this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.setRole})
      if (res.meta.status !== 200) {
        this.$message.error('分配角色失败！')
      }
      this.$message.success('分配角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
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
</style>
