<template>
  <div class="exam-mode">
    <el-button size="medium" class="add-btn" type="primary" @click="add(1)">添加</el-button>
    <el-button size="medium" type="primary" @click="modeConfig">配置</el-button>
    <!-- 表格 -->
    <el-table
      class="examMode-table"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="name" label="考试名称" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="add(2, scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="subject(scope.row.id)">考试科目管理</el-button>
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
    <!-- 新增/编辑 -->
    <el-drawer
      :title="drawerTitle"
      :before-close="handleClose"
      :visible.sync="addDialog"
      direction="rtl"
      custom-class="add-drawer"
      size="25%"
    >
      <el-form
        ref="addExamName"
        :model="addExamName"
        class="add-form"
        label-width="100px"
      >
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="考试名称："
              prop="name"
              :rules="[{ required: true, message: '考试名称不能为空' }]"
            >
              <el-input
                v-model="addExamName.name"
                clearable
                maxlength="30"
                auto-complete="off"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="btns">
          <el-button size="medium" class="cancel" @click="handleClose">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitForm('addExamName')">保存</el-button>
        </div>
      </el-form>
    </el-drawer>
    <!-- 配置 -->
    <el-drawer
      title="配置"
      :before-close="handleClose1"
      :visible.sync="examConfigDialog"
      direction="rtl"
      custom-class="examConfig-drawer"
      size="30%"
    >
      <el-form
        ref="examConfig"
        :model="examConfig"
        class="config-form"
        label-width="100px"
      >
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="提前开启："
              prop="advancedTime"
              :rules="[{ required: true, message: '时间不能为空'}]"
            >
              <div class="time-box">
                <el-input-number
                  v-model.number="examConfig.advancedTime"
                  :min="1"
                  :max="30"
                  :step="1"
                  step-strictly
                />
                <span class="text">分钟</span>
                <el-tooltip class="item" effect="dark" content="在考试时间开始前，提前开启考试" placement="bottom-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <div v-if="examConfig.time" class="tips">提示：最短时间1分钟，最长时间30分钟</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="返回按钮:"
              prop="isReturn"
              :rules="[{ required: true, message: '请选择返回按钮是否开启'}]"
            >
              <div class="time-box">
                <el-select v-model="examConfig.isReturn" placeholder="请选择">
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
          <el-button size="medium" class="cancel" @click="handleClose1">取 消</el-button>
          <el-button size="medium" type="primary" @click="saveConfig('examConfig')">保存</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { examList, examDetail, addExam, editExam, examCofig, examCofigDetail, delExam } from '@/api/examMode'
export default {
  name: 'ExamModeHome',
  data() {
    return {
      dataParam: {
        page: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],
      addDialog: false,
      editType: '',
      addExamName: { name: '' },
      drawerTitle: '',
      examId: '',
      examConfigDialog: false,
      examConfig: {
        advancedTime: '',
        isReturn: ''
      }
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
    // 获取列表
    getList(params) {
      examList(params).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data.dataList
          this.total = res.data.totalCount
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    handleCurrentChange(val) {
      if (val === this.page) return
      this.dataParam.page = val
      this.getList(this.dataParam)
    },
    // 添加/编辑
    add(type, id) {
      if (type === 1) {
        this.drawerTitle = '添加'
      } else if (type === 2) {
        this.drawerTitle = '编辑'
        examDetail({ id }).then((res) => {
          if (res.code === 10000) {
            this.addExamName.name = res.data.name
            this.examId = id
          }
        })
      }
      this.editType = type
      this.addDialog = true
    },
    // 新增/编辑-提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const params = { name: this.addExamName.name }
        if (valid) {
          if (this.editType === 1) {
            addExam(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '添加成功', type: 'success' })
                const param = {
                  page: 1,
                  pageSize: 20
                }
                this.getList(param)
                this.addDialog = false
                this.resetForm('addExamName')
              }
            })
          } else if (this.editType === 2) {
            params.id = this.examId
            editExam(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '编辑成功', type: 'success' })
                this.getList(this.dataParam)
                this.addDialog = false
                this.resetForm('addExamName')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 新增/编辑 - 取消
    handleClose() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.resetForm('addExamName')
          _this.addDialog = false
        })
        .catch((_) => {})
    },
    // 配置 - 取消
    handleClose1() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.resetForm('examConfig')
          _this.examConfigDialog = false
        })
        .catch((_) => {})
    },
    // 配置
    modeConfig() {
      examCofigDetail().then(res => {
        if (res.code === 10000) {
          this.examConfig.advancedTime = res.data.advancedTime
          this.examConfig.isReturn = res.data.isReturn
        }
      })
      this.examConfigDialog = true
    },
    // 配置-保存
    saveConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = this.examConfig
          console.log({ params })
          examCofig(params).then(res => {
            if (res.code === 10000) {
              this.$message({ message: '配置保存成功', type: 'success' })
              this.examConfigDialog = false
              this.resetForm('examConfig')
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除
    del(id) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = { id }
        console.log({ id })
        delExam(para).then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList(this.dataParam)
          }
        })
      }).catch(() => {

      })
    },
    // 考试科目管理
    subject(id) {
      this.$router.push({ path: '/model-management/exam-mode/subject-manage/' + id })
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false
    next()
  }
}
</script>

<style lang="scss" scoped>
  .exam-mode {
    .add-btn {
      margin-right: 20px;
    }
    .examMode-table {
      margin: 20px 0;
    }
  }

</style>
<style lang='scss'>
  .el-form-item {
    .el-form-item__label {
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
  .examConfig-drawer{
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
    .tips{
      color:#ccc;
    }
  }
</style>
