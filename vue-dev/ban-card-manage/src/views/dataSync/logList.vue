<template>
  <div class="data-sync">
    <div>
      <el-form ref="filters" :inline="true" :model="filters" class="serchForm">
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item prop="kw">
              <el-input
                v-model="filters.kw"
                clearable
                placeholder="关键字"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="action">
              <el-select v-model="filters.action" clearable placeholder="类型">
                <el-option label="学校基本信息" value="CG_SCHOOL" />
                <el-option label="教职工信息" value="CG_FACULTY" />
                <el-option label="学生信息" value="CG_STUDENT" />
                <el-option label="教学场所信息" value="CG_PLACE" />
                <el-option label="教室信息" value="CG_CLASSROOM" />
                <el-option label="班级信息" value="CG_CLASS" />
                <el-option label="部门信息" value="CG_DEPT" />
                <el-option label="科目信息" value="CG_SUBJECT" />
                <el-option label="用户信息" value="CG_USER" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="status">
              <el-select v-model="filters.status" clearable placeholder="状态">
                <el-option label="成功" value="1" />
                <el-option label="失败" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="kw">
              <el-date-picker
                v-model="times"
                class="selDate"
                format="yyyy-MM-dd"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getTime"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button size="medium" plain @click="resetForm('filters')">重置</el-button>&emsp;
            <el-button type="primary" size="medium" @click="search">查询</el-button>&emsp;
            <el-button type="primary" size="medium" @click="logSet()">配置</el-button>&emsp;
            <el-button type="primary" size="medium" @click="dataInit">初始化</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table
      max-height="680"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="action" label="类型" :formatter="formatAction" />
      <el-table-column prop="operate" label="操作类型" :formatter="formatOperate" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span :style="{color:scope.row.status == 0 ? '#f00' : (scope.row.status == 1 ? '#67C23A' : '#606266')}">{{ scope.row.status == 0 ? '失败' : (scope.row.status == 1 ? '成功' : '未知') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operateTime" label="日期" :formatter="formatTime" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goLogDetail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="page"
      :page-size="20"
      :total="total"
      @current-change="handleCurrentChange"
    />
    <!-- 配置 -->
    <el-drawer
      :title="drawerTitle"
      :before-close="handleClose"
      :visible.sync="configDialog"
      direction="rtl"
      custom-class="add-drawer"
      size="25%"
    >
      <el-form
        ref="configForm"
        :model="configForm"
        class="add-form"
        label-width="120px"
      >
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="同步频率："
              prop="time"
              :rules="[{ required: true, message: '时间不能为空'}]"
            >
              <div class="time-box">
                <el-input-number
                  v-model.number="configForm.time"
                  :min="0"
                  :max="3600"
                  :step="1"
                  step-strictly
                />
                <span class="text">分钟</span>
                <el-tooltip class="item" effect="dark" content="同步的间隔时间，1-3600分钟" placement="bottom-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="同步状态："
              prop="syncStatus"
            >
              <el-switch
                v-model="configForm.syncStatus"
                :width="50"
                active-color="#13ce66"
                inactive-color="#BFBFBF"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="btns">
          <el-button size="medium" class="cancel" @click="handleClose">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitForm('configForm')">保存</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { logList, getSetDetail, dataInit, logConfig, setSyncStatus } from '@/api/dataSync'
import { formatDate, dateToTimestamp } from '@/utils/commonUtils'
export default {
  name: 'LogList',
  data() {
    return {
      page: 1,
      pageSize: 20,
      total: 0,
      filters: {
        kw: '',
        action: '',
        status: ''
      },
      times: [],
      startTime: '',
      endTime: '',
      tableData: [],
      drawerTitle: '添加',
      configDialog: false,
      configForm: { time: '', syncStatus: 1 }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 类型
    formatAction(row) {
      if (row.action === 'CG_SCHOOL') {
        return '学校基本信息'
      } else if (row.action === 'CG_FACULTY') {
        return '教职工信息'
      } else if (row.action === 'CG_STUDENT') {
        return '学生信息'
      } else if (row.action === 'CG_PLACE') {
        return '教学场所信息'
      } else if (row.action === 'CG_CLASSROOM') {
        return '教室信息'
      } else if (row.action === 'CG_CLASS') {
        return '班级信息'
      } else if (row.action === 'CG_DEPT') {
        return '部门信息'
      } else if (row.action === 'CG_SUBJECT') {
        return '科目信息'
      } else if (row.action === 'CG_USER') {
        return '用户信息'
      }
    },
    // 操作类型
    formatOperate(row) {
      if (row.operate === 'ADD') {
        return '新增'
      } else if (row.operate === 'UPDATE') {
        return '修改'
      } else if (row.operate === 'DELETE') {
        return '删除'
      }
    },
    // 时间转换
    formatTime(row, column) {
      if (row.operateTime) {
        return formatDate(new Date(row.operateTime * 1000), 'yyyy-MM-dd hh:mm:ss')
      } else {
        return '---'
      }
    },
    // 时间选择
    getTime(val) {
      if (val) {
        const start = val[0] + ' 00:00:00'
        const end = val[1] + ' 23:59:59'
        this.startTime = dateToTimestamp(start)
        this.endTime = dateToTimestamp(end)
      } else {
        this.startTime = ''
        this.endTime = ''
      }
    },
    // 获取日志列表
    getList(params) {
      logList(params).then((res) => {
        if (res.code === 10000) {
          this.total = res.data.totalCount
          this.tableData = res.data.dataList
        }
      })
    },
    // 查询
    search() {
      const params = {
        kw: this.filters.kw || '',
        action: this.filters.action || '',
        status: this.filters.status || '',
        startTime: this.startTime,
        endTime: this.endTime,
        page: 1,
        pageSize: 20
      }
      console.log({ params })
      this.getList(params)
      this.page = 1
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.times = []
      this.startTime = ''
      this.endTime = ''
    },
    // 分页
    handleCurrentChange(val) {
      if (val === this.page) return
      this.page = val
      const params = {
        kw: this.filters.kw || '',
        action: this.filters.action || '',
        status: this.filters.status || '',
        startTime: this.startTime,
        endTime: this.endTime,
        page: val,
        pageSize: 20
      }
      this.getList(params)
    },
    // 初始化
    dataInit() {
      this.$confirm('初始化，首先会清空所有基础数据，人员信息、卡号、教室信息等信息，并全量请求中心服务器数据，请确认！', '提示', {
        type: 'warning'
      }).then(() => {
        dataInit().then((res) => {
          if (res.code === 10000) {
            this.$message({ message: '已通知后台进行初始化，请稍后查看', type: 'success' })
          }
        })
      }).catch(() => {

      })
    },
    // 日志
    goLogDetail(id) {
      this.$router.push({ path: '/data-sync-manage/data-log/' + id })
    },
    // 配置
    logSet() {
      getSetDetail().then((res) => {
        if (res.code === 10000) {
          this.configForm.time = res.data.time
          this.configForm.syncStatus = res.data.syncStatus
        }
      })
      this.configDialog = true
    },
    // 配置保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = { time: this.configForm.time }
          logConfig(params).then((res) => {
            if (res.code === 10000) {
              this.$message({ message: '保存成功', type: 'success' })
              const param = {
                page: this.page,
                pageSize: this.pageSize
              }
              this.getList(param)
              this.configDialog = false
              this.resetForm('configForm')
            }
          })
        } else {
          return false
        }
      })
    },
    // 配置 - 取消
    handleClose() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.resetForm('configForm')
          _this.configDialog = false
        })
        .catch((_) => {})
    },
    // 同步状态
    changeStatus() {
      const params = { syncStatus: this.configForm.syncStatus }
      setSyncStatus(params).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '保存成功', type: 'success' })
          const param = {
            page: this.page,
            pageSize: this.pageSize
          }
          this.getList(param)
          this.configDialog = false
          this.resetForm('configForm')
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false
    next()
  }
}
</script>

<style lang="scss" scoped>
.data-sync{
  margin-top: 15px;
  ::v-deep .el-select{
      width:100%;
  }
  .el-form-item {
    ::v-deep .el-form-item__label {
      font-weight: normal;
    }
  }
  .time-box{
    display: flex;
    align-items: center;
    .text{
      padding-left: 10px;
    }
    .el-icon-info{
      font-size: 24px;
      color:#909399;
      margin-left: 20px;
    }
  }
  .btns {
    text-align: right;
    margin: 50px 65px 0 0;
    .cancel{
      margin-right: 15px;
    }
  }
  .serchForm{
    ::v-deep .el-form-item{
      width:100%;
    }
    ::v-deep .el-form-item__content{
      width:100%;
    }
    .selDate{
      ::v-deep .el-date-editor--daterange.el-input__inner{
        width:100%;
      }
    }
  }
}
.pagination{
  margin-top:20px;
  float: right;
}
</style>
