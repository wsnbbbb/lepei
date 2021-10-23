<template>
  <div class="data-log">
    <div class="detail">
      <el-row :gutter="24">
        <el-col :span="12"><span>类型：</span>{{ action }}</el-col>
        <el-col :span="12"><span>状态：</span>{{ status == 0 ? '失败' : (status == 1 ? '成功' : '') }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12"><span>操作：</span>{{ operate }}</el-col>
        <el-col :span="12"><span>时间：</span>{{ syncTime }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24"><span>序列号：</span>{{ sequence }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="2" class="erroCol"><span>错误信息：</span></el-col>
        <el-col :span="21" class="content">{{ error }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="2" class="erroCol"><span>日志内容：</span></el-col>
        <el-col :span="21" class="content">{{ content }}</el-col>
      </el-row>
    </div>
    <el-button class="back" type="primary" round size="small" @click="back">返回</el-button>
  </div>
</template>

<script>
import { logDetail } from '@/api/dataSync'
import { formatDate } from '@/utils/commonUtils'
export default {
  name: 'DataLog',
  data() {
    return {
      action: '',
      status: '',
      operate: '',
      sequence: '',
      content: '',
      error: '',
      syncTime: ''
    }
  },
  created() {
    this.getLog()
  },
  methods: {
    // 获取日志详情
    getLog() {
      const params = { id: this.$route.params.id }
      logDetail(params).then(res => {
        if (res.code === 10000) {
          this.action = this.actionType(res.data.action)
          this.status = res.data.status
          this.operate = this.operateType(res.data.operate)
          this.sequence = res.data.sequence
          this.content = res.data.content
          this.error = res.data.error
          this.syncTime = formatDate(new Date(res.data.syncTime * 1000), 'yyyy-MM-dd hh:mm:ss')
        }
      })
    },
    // 类型
    actionType(type) {
      const types = type && type.toString()
      switch (types) {
        case 'CG_SCHOOL':
          return '学校基本信息'
        case 'CG_FACULTY':
          return '教职工信息'
        case 'CG_STUDENT':
          return '学生信息'
        case 'CG_PLACE':
          return '教学场所信息'
        case 'CG_CLASSROOM':
          return '教室信息'
        case 'CG_CLASS':
          return '班级信息'
        case 'CG_DEPT':
          return '部门信息'
        case 'CG_SUBJECT':
          return '科目信息'
        case 'CG_USER':
          return '用户信息'
      }
    },
    // 操作类型
    operateType(type) {
      const types = type && type.toString()
      switch (types) {
        case 'ADD':
          return '新增'
        case 'UPDATE':
          return '修改'
        case 'DELETE':
          return '删除'
      }
    },
    back() {
      window.history.go(-1)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'LogList') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
  .data-log{
    width:100%;
    height: calc(100vh - 120px);
    position: relative;
    .back{
      position: absolute;
      bottom:10px;
      left:-38px;
      width:100px;
    }
    .detail{
      padding:20px;
      font-size: 14px;
      .el-row{
        margin-bottom: 30px;
        span{
          font-weight: bold;
        }
        .erroCol{
          width:90px;
          padding-right: 0 !important;
        }
        .content{
          white-space: normal;
          word-break: break-all;
          overflow: hidden;
        }
      }
    }
  }
</style>
