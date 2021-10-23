<template>
  <div class="nav-namage-detail">
    <el-form
      ref="navDetail"
      :model="navDetail"
      class="detail-form"
      label-width="120px"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="编号：" prop="code">
            <el-input v-model="navDetail.code" maxlength="30" placeholder="请输入编号" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="导航名称：" prop="name">
            <el-input v-model="navDetail.name" maxlength="30" placeholder="请输入导航名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="类型：" prop="type">
            <el-radio-group v-model="navDetail.type">
              <el-radio :label="3">原生</el-radio>
              <el-radio :label="2">链接</el-radio>
              <el-radio :label="1">内容</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            class="seqNo"
            label="排序："
            prop="seqNo"
          >
            <div class="hasIcon-box">
              <el-input-number
                v-model.number="navDetail.seqNo"
                :min="1"
                :max="100"
                :step="1"
                step-strictly
              />
              <el-tooltip class="item" effect="dark" content="数字越小，位置越靠前" placement="bottom-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="屏蔽限制：" prop="isForbidJump">
            <div class="hasIcon-box">
              <el-select v-model="navDetail.isForbidJump">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
              <el-tooltip class="item" effect="dark" content="“是”：页面内的链接不可跳出；“否”：不限制，可跳出" placement="bottom-start">
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
        <el-col v-if="navDetail.type === 2" :span="10">
          <el-form-item
            label="链接："
            prop="linkUrl"
          >
            <el-input v-model="navDetail.linkUrl" placeholder="请输入链接" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="navDetail.type === 1" :gutter="24">
        <el-col :span="20">
          <el-form-item label="内容：" prop="content">
            <div class="Tinymce_box">
              <tinymce v-model="navDetail.content" :height="300" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button size="medium" type="primary" @click="submitForm('navDetail')">保存</el-button>
      <el-button size="medium" class="back" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getNavDetail, addNav, editNav } from '@/api/navManage'
export default {
  name: 'NavDetail',
  components: { Tinymce },
  data() {
    return {
      navDetail: {
        code: '',
        name: '',
        seqNo: '',
        type: 2,
        isForbidJump: 1,
        linkUrl: '',
        content: ''
      },
      codeKey: '',
      rules: {
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { max: 30, message: '最长30个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入导航名称', trigger: 'blur' },
          { max: 30, message: '最长30个字符', trigger: 'blur' }
        ],
        seqNo: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        isForbidJump: [
          { required: true, message: '请选择屏蔽限制', trigger: 'change' }
        ],
        linkUrl: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写内容', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.codeKey = this.$route.params.code
    if (this.codeKey) {
      this.getDetail({ code: this.codeKey })
    }
  },
  methods: {
    // 获取导航详情
    getDetail(params) {
      getNavDetail(params).then(res => {
        if (res.code === 10000) {
          this.navDetail = res.data
        }
      })
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.navDetail
          const params = {
            code: data.code,
            name: data.name,
            seqNo: data.seqNo,
            type: data.type,
            isForbidJump: data.isForbidJump
          }
          if (data.type === 2) {
            params.linkUrl = data.linkUrl
          } else if (data.type === 1) {
            params.content = data.content
          }
          if (this.codeKey) {
            editNav(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '修改成功', type: 'success' })
                window.history.go(-1)
              }
            })
          } else {
            addNav(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '添加成功', type: 'success' })
                window.history.go(-1)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 保存
    save() {

    },
    // 返回
    back() {
      this.$router.push({ path: '/nav-management/nav-manage' })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.codeKey && to.name === 'NavManage') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
  .nav-namage-detail{
    width:100%;
    margin-top:20px;
    .detail-form{
      /deep/.el-form-item__label{
        font-weight: normal;
      }
      /deep/.el-icon-info{
        font-size: 24px;
        color:#909399;
        margin-left: 20px;
      }
      .hasIcon-box{
        display: flex;
        align-items: center;
      }
    }
    .btns{
      text-align: center;
      margin-top:50px;
      .back{
        margin-left: 40px;
      }
    }
  }
</style>
