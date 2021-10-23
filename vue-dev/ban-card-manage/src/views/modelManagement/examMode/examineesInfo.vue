<template>
  <div class="student-info">
    <el-button size="medium" class="add-btn" type="primary" @click="add">添加考生信息</el-button>
    <!-- 表格 -->
    <el-table
      max-height="700"
      class="examStudent-table"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="seatNo" label="座位号" />
      <el-table-column prop="studentName" label="考生" />
      <el-table-column prop="ticketNo" label="准考证号" />
      <el-table-column prop="className" label="班级" />
      <el-table-column prop="roomName" label="考试教室" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page="page"
      :page-size="20"
      :total="total"
      style="float: right"
      @current-change="handleCurrentChange"
    />
    <el-button class="back" type="primary" round size="small" @click="back">返回</el-button>
    <!-- 添加考生 -->
    <el-drawer
      title="添加考生"
      :before-close="handleClose"
      :visible.sync="addDialog"
      direction="rtl"
      custom-class="add-drawer"
      size="28%"
    >
      <el-form
        ref="addExamStudent"
        :model="addExamStudent"
        class="add-form"
        label-width="100px"
      >
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="座位号："
              prop="seatNo"
            >
              <el-input
                v-model="addExamStudent.seatNo"
                clearable
                maxlength="30"
                auto-complete="off"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="考生姓名："
              prop="studentName"
              :rules="[{ required: true, message: '考生姓名不能为空' }]"
            >
              <el-input
                v-model="addExamStudent.studentName"
                clearable
                maxlength="30"
                auto-complete="off"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="准考证号："
              prop="ticketNo"
            >
              <el-input
                v-model="addExamStudent.ticketNo"
                clearable
                maxlength="20"
                auto-complete="off"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="班级："
              prop="className"
            >
              <el-input
                v-model="addExamStudent.className"
                clearable
                maxlength="30"
                auto-complete="off"
                placeholder="请输入班级名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="考试教室："
              prop="roomCode"
              :rules="[{ required: true, message: '请选择考试教室', trigger: 'change' }]"
            >
              <el-select v-model="addExamStudent.roomCode" disabled>
                <el-option
                  v-for="item in classRoomList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="btns">
          <el-button size="medium" class="cancel" @click="handleClose">取 消</el-button>
          <el-button size="medium" type="primary" @click="submitForm('addExamStudent')">保存</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { examineesList, delExaminees, examClassroom, addExaminees } from '@/api/examMode'
export default {
  name: 'ExamineesInfo',
  data() {
    return {
      page: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      examId: '',
      roomCode: '',
      addDialog: false,
      addExamStudent: {
        seatNo: '',
        studentName: '',
        ticketNo: '',
        className: '',
        roomCode: ''
      },
      classRoomList: [] // 所有考试教室
    }
  },
  created() {
    this.examId = this.$route.query.examId
    this.roomCode = this.$route.query.roomCode
    this.addExamStudent.roomCode = this.$route.query.roomCode
    const params = {
      page: 1,
      pageSize: 20,
      examId: this.$route.query.examId,
      roomCode: this.$route.query.roomCode
    }
    this.getList(params)
  },
  methods: {
    // 获取考生列表
    getList(params) {
      examineesList(params).then((res) => {
        if (res.code === 10000) {
          this.total = res.data.totalCount
          this.tableData = res.data.dataList
        }
      })
    },
    // 分页
    handleCurrentChange(val) {
      if (val === this.page) return
      this.page = val
      const params = {
        page: this.page,
        pageSize: 20,
        examId: this.examId,
        roomCode: this.roomCode
      }
      this.getList(params)
    },
    // 添加
    add() {
      examClassroom().then((res) => {
        if (res.code === 10000) {
          this.classRoomList = res.data
          this.addDialog = true
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加-提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.addExamStudent))
          params.examId = this.examId
          console.log({ params })
          addExaminees(params).then((res) => {
            if (res.code === 10000) {
              this.$message({ message: '添加成功', type: 'success' })
              const param = {
                page: 1,
                pageSize: this.pageSize,
                examId: this.examId,
                roomCode: this.roomCode
              }
              this.getList(param)
              this.addDialog = false
              this.resetForm('addExamStudent')
            }
          })
        } else {
          return false
        }
      })
    },
    // 新增-取消
    handleClose() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.resetForm('addExamStudent')
          _this.addDialog = false
        })
        .catch((_) => {})
    },
    // 删除
    del(id) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delExaminees({ id }).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          const params = {
            page: this.page,
            pageSize: 20,
            examId: this.examId,
            roomCode: this.roomCode
          }
          this.getList(params)
        })
      }).catch(() => {

      })
    },
    // 返回
    back() {
      window.history.go(-1)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'SubjectManage') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  /deep/.el-form-item__label {
    font-weight: normal;
  }
}
/deep/.el-select{
  width:100%;
}
.btns {
  text-align: right;
  margin: 50px 65px 0 0;
  .cancel{
    margin-right: 15px;
  }
}
.student-info{
  width:100%;
  height: calc(100vh - 120px);
  position: relative;
  .back{
    position: absolute;
    bottom:10px;
    left:-34px;
    width:80px;
  }
  .examStudent-table{
    margin-bottom:20px;
  }
}
</style>
