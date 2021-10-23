<template>
  <div class="urgency-mode">
    <el-button size="medium" class="add-btn" type="primary" @click="add(1)">添加</el-button>
    <el-button size="medium" type="primary" @click="modeConfig">配置</el-button>
    <!-- 表格 -->
    <el-table
      class="urgencyMode-table"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="contentType" label="类型" :formatter="formatType" width="120" />
      <el-table-column prop="showTime" label="展示时间" />
      <el-table-column prop="roomNames" label="展示教室" />
      <el-table-column prop="priority" label="优先级" width="120" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="add(2,scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="dataParam.page"
      :page-size="20"
      :total="total"
      style="float: right"
      @current-change="handleCurrentChange"
    />
    <!-- 配置 -->
    <el-drawer
      title="配置"
      :before-close="handleClose"
      :visible.sync="configDialog"
      direction="rtl"
      size="25%"
    >
      <el-form
        class="config-form"
        label-width="100px"
      >
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="返回按钮:"
              prop="isReturn"
            >
              <div class="time-box">
                <el-select v-model="isReturn" placeholder="请选择">
                  <el-option label="开启" :value="1" />
                  <el-option label="关闭" :value="0" />
                </el-select>
                <el-tooltip class="item" effect="dark" content="在当前模式界面，提供“返回”" placement="bottom-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="btns">
          <el-button size="medium" class="cancel" @click="handleClose">取 消</el-button>
          <el-button size="medium" type="primary" @click="saveConfig">保存</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { urgencyList, delUrgency, urgencyModeConfig, setDetail } from '@/api/urgencyMode'
export default {
  name: 'UrgencyModeHome',
  data() {
    return {
      dataParam: {
        page: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],
      configDialog: false,
      isReturn: 0

    }
  },
  created() {
    if (!this.$route.meta.keepAlive) {
      this.getList(this.dataParam)
    }
  },
  activated() {
    this.getList(this.dataParam)
  },
  methods: {
    // 类型
    formatType(row, column) {
      if (row.contentType === 1) {
        return '图片'
      } else if (row.contentType === 2) {
        return '视频'
      } else if (row.contentType === 3) {
        return '内容'
      } else {
        return '未知'
      }
    },
    // 获取紧急模式列表
    getList(params) {
      urgencyList(params).then((res) => {
        if (res.code === 10000) {
          res.data.dataList && res.data.dataList.map(item => {
            item.showTime = item.showStartTime + ' ~ ' + item.showEndTime
          })
          this.total = res.data.totalCount
          this.tableData = res.data.dataList
        }
      })
    },
    // 分页
    handleCurrentChange(val) {
      if (val === this.page) return
      this.dataParam.page = val
      this.getList(this.dataParam)
    },
    // 添加/编辑
    add(type, id) {
      if (type === 1) { // 添加
        this.$router.push({ path: '/model-management/urgency-mode/urgency-mode-detail' })
      } else if (type === 2) { // 编辑
        this.$router.push({ path: '/model-management/urgency-mode/urgency-mode-detail/' + id })
      }
    },
    // 配置
    modeConfig() {
      setDetail().then(res => {
        if (res.code === 10000) {
          this.isReturn = res.data.isReturn
          this.configDialog = true
        }
      })
    },
    // 配置-保存
    saveConfig() {
      const params = { isReturn: this.isReturn }
      urgencyModeConfig(params).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '配置保存成功', type: 'success' })
          this.configDialog = false
          this.isReturn = 0
        }
      })
    },
    // 配置 - 取消
    handleClose() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.isReturn = 0
          _this.configDialog = false
        })
        .catch((_) => {})
    },
    // 删除
    del(id) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delUrgency({ id }).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.dataParam)
        })
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
.urgency-mode{
 .add-btn {
    margin-right: 20px;
  }
  .urgencyMode-table{
  margin:20px 0;
  }
  .el-form-item {
    /deep/.el-form-item__label {
      font-weight: normal;
    }
  }
  .btns {
    text-align: right;
    margin: 50px 65px 0 0;
    .cancel{
      margin-right: 15px;
    }
  }
  .time-box{
    display: flex;
    align-items: center;
    .el-icon-info{
      font-size: 24px;
      color:#909399;
      margin-left: 20px;
    }
  }

}

</style>
