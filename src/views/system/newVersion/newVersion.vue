<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="app-container">
    <el-row style="margin-top: 20px;">
      <el-col :span="14" :offset="4">
        <header class="form_header">添加新版本</header>
        <el-form ref="appForm" :model="appForm" :rules="apprules" label-width="110px" class="form app_form">
          <el-form-item label="应用唯一号" prop="appKey">
            <el-input v-model="appForm.appKey" placeholder="请输入应用的唯一号" />
          </el-form-item>
          <el-form-item label="版本名" prop="versionName">
            <el-input v-model="appForm.versionName" placeholder="请输入应用版本名，例如：1.0.24" />
          </el-form-item>
          <el-form-item label="版本号" prop="versionCode">
            <el-input
              v-model="appForm.versionCode"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入应用版本号，例如：24"
            />
          </el-form-item>
          <el-form-item label="是否强制更新" prop="updateStatus">
            <el-switch v-model="appForm.updateStatus" :inactive-value="1" :active-value="2" />
          </el-form-item>
          <el-form-item label="更新内容" prop="modifyContent">
            <el-input v-model="appForm.modifyContent" type="textarea" placeholder="请输入更新日志..." />
          </el-form-item>
          <el-form-item label="APK文件">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="/update/uploadApk"
              :http-request="uploadFile"
              :multiple="false"
              :auto-upload="false"
              :limit="1"
              accept=".apk"
              :on-remove="onRemoveFile"
              :on-change="onChangeFile"
            >
              <el-button slot="trigger" size="small" type="success">选取.apk文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addVersionInfo('appForm')">添加版本</el-button>
            <el-button @click="resetForm('appForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addVersionInfo, uploadApkFile } from '@/api/system/update'

export default {
  name: 'NewVersion',
  data() {
    return {
      fullscreenLoading: false,
      appForm: {
        appKey: '',
        versionName: '',
        versionCode: '',
        modifyContent: '',
        updateStatus: 1
      },
      apprules: {
        appKey: [{
          required: true,
          message: '请输入应用唯一号',
          trigger: 'blur'
        }],
        versionName: [{
          required: true,
          message: '请输入版本名',
          trigger: 'blur'
        }],
        versionCode: [{
          required: true,
          message: '请输入版本号',
          trigger: 'blur'
        }]
      },
      hasSelectedApk: false,
      versionId: 0
    }
  },
  created() {},
  methods: {
    onRemoveFile() {
      this.hasSelectedApk = false
    },
    onChangeFile(file, fileList) {
      this.hasSelectedApk = fileList.length > 0
    },
    addVersionInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.hasSelectedApk) {
            this.fullscreenLoading = true
            setTimeout(() => {
              this.fullscreenLoading = false
            }, 120000)
            addVersionInfo(this.appForm).then(response => {
              console.log(response.data)
              if (response.data.versionId !== 0) {
                this.versionId = response.data.versionId
                this.$refs.upload.submit()
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '请选择上传的apk文件!'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadFile(param) {
      const fileObject = param.file
      const formData = new FormData()
      formData.append('file', fileObject)
      formData.append('versionId', this.versionId)
      uploadApkFile(formData).then(response => {
        console.log(response.flag)
        if (response.flag === true) {
          this.$message({
            type: 'success',
            message: '新版本添加成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.msg
          })
        }
      }).finally(response => {
        this.fullscreenLoading = false
        this.resetForm('appForm')
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>

<style lang="scss">

  .form_header {
    text-align: center;
    font-size: 25px;
    margin-bottom: 20px;
  }

  .app_form {
    border: 1px solid #eaeefb;
    padding: 10px 10px 0;
  }

</style>
