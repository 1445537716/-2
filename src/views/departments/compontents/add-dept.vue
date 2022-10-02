<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCannel">
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" type="textarea" :rows="3" style="width:80%" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCannel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    //   控制添加部门弹层的显示和隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前添加/编辑点击的部门结点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // 获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // formData 有id则是编辑模式
        // 同部门下 部门名称不能相同 要排除自己
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 找到当前点击添加节点的子节点 判断有没有相同的部门节点
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`该部门下已经存在${value}部门！`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      // 获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式 code不要包含自己
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 判断有没有相同的编码
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat ? callback(new Error(`该部门编码${value}在组织架构中已经存在！`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称应为1-50个字符之间', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码应为1-50个字符之间', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍应为1-300字符之间', trigger: 'blur' }
        ]
      },
      peoples: [] // 员工列表
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id) // 调用接口获取部门详情
      // 因为treenode是用props传值进来的 props传值是异步的 可能会获取不到值 索性从外面传参
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 区分是编辑场景还是新增场景
          if (this.formData.id) {
            // formData存在id 则是编辑状态
            await updateDepartments(this.formData)
          } else {
            // 新增状态
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 向服务器添加部门数据
          }
          this.$emit('addDept')
          // update: 是固定写法 （update:属性名，值）
          this.$emit('update:showDialog', false) // 数据用sync修饰符修饰 向父组件发布事件 关闭弹层
          // 关闭dialog的时候 会自动触发el-form的close事件 这里就不需要再写重置表单校验
        }
      })
    },
    btnCannel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false) // 数据用sync修饰符修饰 向父组件发布事件 关闭弹层
      this.$refs.deptForm.resetFields() // 重置表单校验
    }
  }
}
</script>

<style>

</style>
