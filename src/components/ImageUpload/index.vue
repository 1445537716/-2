<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled : fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px" />
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDJRKxJOCk11kERN2SbT4OTGm10i9JDqBF',
  SecretKey: 'oMddMp1wZw2rOedLmwqUrxmKbbKnzuXu'
})
export default {
  data() {
    return {
      fileList: [], // 上传文件的地址
      imgUrl: '', // 接住上传图片的地址
      showDialog: false,
      currentFileUid: null, // 接住当前正在上传图片的uid
      percent: 0, // 上传进度
      showPercent: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 预览事件
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file是要删除文件
    // filelist是删除过后的文件
    handleRemove(file, fileList) {
      // fileList 是删除过后的文件
      // 过滤出与选中删除的图片uid不相等的图片地址形成新的图片地址数组
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    changeFile(file, fileList) { // 修改文件时触发
      // 如果原地址数组中 没有与添加的图片地址相同的 才执行追加
    //   if (!this.fileList.some(item => item.uid === file.uid)) {
    //     this.fileList.push(file)
    //   }
    //   如果当前fileList中没有该文件就进行追加
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 图片大小不能大于5M
      const maxsize = 5 * 1024 * 1024
      if (file.size > maxsize) {
        this.$message.error('图片不能大于5M')
        return false
      }
      // 将通过检查确定上传的uid赋给变量
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload(params) {
      // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    //   console.log(params.file)
      if (params.file) {
        cos.putObject({
          Bucket: 'hx123-1313783216', // 自己的存储桶名称
          Region: 'ap-guangzhou', // 存储桶所在地域
          Key: params.file.name, // 存储名称（文件名）
          StorageClass: 'STANDARD', // 上传的模式  使用默认的即可 标准模式
          Body: params.file, // 上传的对象
          onProgress: (params) => {
            // console.log(params)
            this.percent = params.percent * 100
          }
        }, (err, data) => {
        //   console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 上传成功
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
          }
          setTimeout(() => {
            // 关闭进度条
            this.showPercent = false
            // 置零进度条
            this.percent = 0
          }, 1000)
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
    display: none;
}
</style>
