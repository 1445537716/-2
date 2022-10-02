<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.messager }}</el-col>
        <el-col>
          <!-- 下拉菜单element -->
          <el-dropdown @command="operateDepts">
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 隐藏部分 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 新增部门
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除部门
        this.$confirm('是否删除该部门').then(() => {
          return delDepartments(this.treeNode.id) // 返回成功数据 执行下一个then 这里不会出现错误操作，已经被拦截
        }).then(() => {
          this.$emit('delDepts') // 删除成功的话 会进入到这一层 通知父组件更新视图  重新拉取数据
          this.$message('删除成功')
        })
      }
    }
  }
}
</script>

<style>
</style>
