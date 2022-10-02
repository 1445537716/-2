<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 提示信息 用公用提示信息组件 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <div slot="after">
          <el-button type="warning" size="small" @click="$router.push('/import')">导入</el-button>
          <el-button type="danger" size="small" @click="exportData">导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增</el-button>
        </div>
      </page-tools>
      <!-- 表格 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像">
            <template slot-scope="{row}">
              <img
                v-imagerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" :formatter="formatEmployment" label="聘用形式" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template slot-scope="obj">
              <!-- 格式化时间 -->
              {{ obj.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template slot-scope="obj">
              <el-switch :value="obj.row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="obj">
              <el-button type="text" size="small" @click="$router.push(`/detail/${obj.row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(obj.row.id)">角色</el-button>
              <el-button type="text" size="small" :disabled="!checkPermission('point-user-delete')" @click="delEmployee(obj.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center">
          <el-pagination
            layout="prev,pager,next"
            :page-size="page.size"
            :total="page.total"
            :current-page="page.page"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>
    <!-- sync修饰符 监听子组件发出事件的语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 点击头像 出现二维码弹层 -->
    <el-dialog :visible.sync="showCodelog" title="头像二维码">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配角色弹层 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 导入枚举数据
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'

export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      list: [], // 存放请求回来的数据
      page: {
        page: 1, // 页码
        size: 10, // 每页数据数量
        total: 0 // 总数
      },
      loading: false,
      showDialog: false, // 控制弹层
      showCodelog: false, // 控制二维码弹层
      showRoleDialog: false, // 控制角色分配弹层
      userId: '' // 用户id
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    pageChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确认删除该员工信息吗？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    exportData() { // 导出员工列表  xlsx依赖体积较大 使用懒加载的形式
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data, // 二位数组的形式
          filename: '员工列表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader, // 复杂表头内容
          merges // 复杂表头合并部分
        })
      })
    },
    formatJson(headers, rows) { // 将对象数组转换成二维数组
      return rows.map(item => {
        // item是一个对象 {username：‘xxx’ , ...}
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    showQrCode(url) {
      if (url) { // 只有当头像地址存在的时候才显示弹层  转化成二维码
        this.showCodelog = true
        // 页面的渲染是异步的  此时的ref绑定的dom对象不一定渲染好了
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => { // 确保此时有ref绑定的dom对象
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将图片地址转化为二维码
        })
      } else {
        this.$message.error('图片还未上传')
      }
    },
    async editRole(id) {
      this.userId = id // prop传值是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 直接将id传递出去
      // 显示弹层
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
