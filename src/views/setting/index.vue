<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 左边结构 -->
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <!-- 新增角色按钮 -->
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <!-- 使用插槽 -->
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" justify="center" align="middle">
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 右边结构 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled style="width:400px" type="textarea" :rows="3" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑角色弹出层 -->
    <el-dialog :visible="showDialog" title="编辑角色" @close="btnCannel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色详情">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="btnCannel">取消</el-button>
        <el-button type="primary" @click="btnOK">确定</el-button>
      </el-row>
    </el-dialog>
    <!-- 分配权限弹出层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCannel">
      <!-- 权限树 -->
      <el-tree
        ref="permTree"
        :data="perData"
        :props="defaultProps"
        :default-expand-all="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
        show-checkbox
      />
      <!-- 底部按钮 -->
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCannel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, addAssign } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [], // 承接请求返会的数据
      page: {
        // 记录页码以及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {
        // 存放公司信息
      },
      showDialog: false, // 控制显示弹层
      roleForm: {
        name: '',
        description: ''
      }, // 存放获取编辑的角色详情
      rules: { name: [{ required: true, trigger: 'blur', message: '角色名称不能为空！' }] },
      showPermDialog: false, // 控制分配权限弹出层
      perData: [], // 权限树形数据
      defaultProps: {
        label: 'name'
      },
      roleId: null, // 存储当前分配权限的角色id
      selectCheck: [] // 存储当前分配权限角色已有的权限
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前页码
      this.page.page = newPage // 将当前页码赋给当前的最新页码
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确定删除吗？') // 等待点击确定才会进入到下方继续执行
        await deleteRole(id) // 删除角色
        this.getRoleList() // 重新渲染页面获取数据
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) { // 编辑角色
      this.roleForm = await getRoleDetail(id) // 获取角色数据
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // roleform 有id就是编辑状态
          await updateRole(this.roleForm)
        } else {
          // 新增状态
          await addRole(this.roleForm)
        }
        this.getRoleList() // 重新拉去数据渲染页面
        this.showDialog = false // 关闭弹层
        this.$message.success('操作成功！')
      } catch (error) {
        // alert('修改失败！')
        console.log(error)
      }
    },
    btnCannel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async assignPerm(id) {
      this.perData = tranListToTreeData(await getPermissionList(), '0') // 获取权限列表并准换成树形结构
      this.roleId = id
      const { permIds } = await getRoleDetail(id) // 获取当前角色已分配的权限
      this.selectCheck = permIds // 回写已选权限
      this.showPermDialog = true
    },
    async btnPermOK() {
      await addAssign({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配权限成功！')
      this.showPermDialog = false
    },
    btnPermCannel() {
      this.selectCheck = [] // 重置
      this.showPermDialog = false
    }
  }
}
</script>

<style>
</style>
