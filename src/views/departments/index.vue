<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools :tree-node="company" :is-root="true" @addDept="addDepts" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少结点就循环多少次 -->
          <!-- 作用域插槽 slot-scope=“obj” 接收传递给插槽的数据 obj.data是每个结点的数据对象 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @addDept="addDepts" @delDepts="getDepartments" @editDept="editDept" />
        </el-tree>
      </el-card>
    </div>
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDept="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './compontents/tree-tools.vue'
import addDept from './compontents/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name', // 表示 从这个属性显示内容
        children: 'children' // 表示从这个属性去找子节点
      },
      showDialog: false, // 控制添加部门弹层
      node: null, // 存放当前点击的部门
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, messager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将请求回来的数据转化成树形结构
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
    },
    editDept(node) {
      this.showDialog = true // 显示弹层
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id) // 调用子组件的方法 传入当前点击部门的id 调用接口
    }
  }

}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
