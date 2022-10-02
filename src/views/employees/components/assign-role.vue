<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCannel">
    <!-- 角色多选框 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 放置按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCannel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 传入用户id进行识别
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储所有角色列表
      roleIds: [] // 当前用户的角色
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // 员工角色没有那么多  暂时定20个
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('保存成功')
      this.$emit('update:showRoleDialog', false)
    },
    btnCannel() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
