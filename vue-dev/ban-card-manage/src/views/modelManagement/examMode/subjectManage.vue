<template>
  <div>
    <div v-if="this.$route.name === 'SubjectManage'" class="subject-manage">
      <el-button size="medium" class="buttons" type="primary" @click="add(1)">添加</el-button>
      <el-button size="medium" class="buttons" type="primary" @click="batchImport(1)">考试模式导入</el-button>
      <el-button size="medium" class="buttons" type="primary" @click="batchImport(2)">批量导入考生</el-button>
      <el-button size="medium" class="buttons" type="primary" @click="classroomInfo">教室信息查询</el-button>
      <!-- 表格 -->
      <el-table
        max-height="700"
        class="subjects-table"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column min-width="8%" prop="subjectName" label="考试科目" />
        <el-table-column min-width="20%" prop="examTime" label="考试时间" />
        <el-table-column min-width="15%" prop="ticketNo" label="准考证号" />
        <el-table-column min-width="10%" prop="examRoomNo" label="考室号" />
        <el-table-column min-width="15%" prop="roomName" label="考试教室" />
        <el-table-column min-width="15%" prop="supervisors" label="监考老师" />
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="add(2, scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
            <el-button type="text" size="small" @click="examStudent(scope.row.roomCode)">考生信息</el-button>
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
      <el-button class="back" type="primary" round size="small" @click="back">返回</el-button>
      <!-- 新增/编辑 -->
      <el-drawer
        :title="drawerTitle"
        :before-close="handleClose"
        :visible.sync="addDialog"
        direction="rtl"
        custom-class="add-subject-drawer"
        size="35%"
      >
        <el-form
          ref="addSubject"
          :model="addSubject"
          class="add-subject-form"
          label-width="100px"
        >
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item
                label="考试科目："
                prop="subjectCode"
                :rules="[{ required: true, message: '请选择考试科目', trigger: 'change' }]"
              >
                <el-select v-model="addSubject.subjectCode" clearable placeholder="请选择">
                  <el-option
                    v-for="item in subjectList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item
                class="selectDate"
                label="考试时间："
                prop="times"
              >
                <el-date-picker
                  v-model="times"
                  value-format="timestamp"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getTime"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item
                label="准考证号："
                prop="startTicketNo"
              >
                <div class="ticketNo">
                  <el-input
                    v-model="addSubject.startTicketNo"
                    maxlength="20"
                    clearable
                    auto-complete="off"
                    placeholder="请输入"
                  />
                  <span>-</span>
                  <el-input
                    v-model="addSubject.endTicketNo"
                    maxlength="20"
                    clearable
                    auto-complete="off"
                    placeholder="请输入"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item
                label="考室号："
                prop="examRoomNo"
              >
                <el-input
                  v-model="addSubject.examRoomNo"
                  clearable
                  maxlength="30"
                  auto-complete="off"
                  placeholder="请输入内容"
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
                <el-select v-model="addSubject.roomCode" filterable clearable placeholder="请选择">
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
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item
                label="监考老师："
              >
                <div class="teacher-box">
                  <div class="teachers">
                    <el-tag
                      v-for="item in tags"
                      :key="item.userId"
                      class="tags"
                      closable
                      type="info"
                      @close="removeTag(item)"
                    >
                      {{ item.name }}
                    </el-tag>
                  </div>
                  <el-button size="medium" type="primary" plain @click="openInner">添加</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="btns">
            <el-button size="medium" class="cancel" @click="handleClose">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitForm('addSubject')">保存</el-button>
          </div>
        </el-form>
        <el-drawer
          title="添加老师"
          :append-to-body="true"
          :before-close="handleClose1"
          :visible.sync="innerDrawer"
        >
          <div class="add-teacher">
            <div>
              <el-input
                v-model="kw"
                clearable
                auto-complete="off"
                placeholder="请输入内容"
              />
              <el-button size="medium" type="primary" @click="search">搜索</el-button>
            </div>
            <el-table
              ref="multipleTable"
              tooltip-effect="dark"
              :data="teacherData"
              :height="550"
              highlight-current-row
              style="width: 100%"
              class="teacher-list"
              :row-key="getRowKeys"
              @selection-change="selctTeacher"
            >
              <el-table-column prop="name" label="姓名" />
              <el-table-column label="操作" type="selection" width="55" />
            </el-table>
            <div class="btns">
              <el-button size="medium" class="cancel" @click="handleClose1">取 消</el-button>
              <el-button size="medium" type="primary" @click="saveSelct">保存</el-button>
            </div>
          </div>
        </el-drawer>
      </el-drawer>
      <!-- 导入 -->
      <el-dialog
        class="importForm"
        :title="importTitle"
        :visible.sync="importVisible"
        width="60%"
        @close="cancelImport"
      >
        <el-form ref="importForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12" :offset="2">
              <el-form-item label="请选择文件：">
                <el-upload
                  ref="upload"
                  accept=".xlsx"
                  action="action"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-remove="handleRemove"
                  :on-change="changeFile"
                  :file-list="fileList"
                  :auto-upload="false"
                >
                  <el-button slot="trigger" size="small" plain type="primary">选择文件</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="20">
          <el-col :span="15" :offset="5">
            <p>
              <span>仅支持扩展名为.xlsx的文件</span>
              <a class="downLoad" :href="href">下载导入模板</a>
            </p>
          </el-col>
        </el-row>
        <table v-if="importData.error && importData.headerArr.length > 0 && importData.sheetDataArr.length > 0" border="1" cellspacing="0" class="import-erro-table">
          <thead>
            <tr>
              <th v-for="(item,index) in importData.headerArr" :key="index">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in importData.sheetDataArr" :key="index">
              <td v-for="(v,idx) in item" :key="idx" :class="{ 'redColor': item[item.length - 1] !== '' }">{{ v }}</td>
            </tr>
          </tbody>
        </table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelImport">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { formatDate } from '@/utils/commonUtils'
import { getSubjectList, examSubjects, examClassroom, allTeachers, addSubjects, subjectDetail, editSubjects, delSubject,
  modeImport, batchImport } from '@/api/examMode'
export default {
  name: 'SubjectManage',
  data() {
    return {
      dataParam: {
        page: 1,
        pageSize: 20,
        examId: ''
      },
      total: 0,
      tableData: [], // 科目管理列表
      addDialog: false,
      editType: '',
      addSubject: { // 添加/编辑表单
        subjectCode: '',
        startTicketNo: '',
        endTicketNo: '',
        examRoomNo: '',
        roomCode: '',
        supervisors: ''
      },
      times: '',
      examStartTime: '',
      examEndTime: '',
      subjectList: [], // 所有考试科目
      classRoomList: [], // 所有考试教室
      drawerTitle: '',
      subjectId: '',
      innerDrawer: false,
      kw: '',
      teacherData: [],
      tags: [],
      selctedRow: [],
      importTitle: '',
      importType: '',
      importVisible: false,
      errShow: false,
      fileList: [],
      importData: {},
      file: '',
      href: ''
    }
  },
  created() {
    if (this.$route.name === 'SubjectManage' && !this.$route.meta.keepAlive) {
      this.dataParam.examId = this.$route.params.id
      this.getList(this.dataParam)
    }
  },
  activated() {
    if (this.$route.name === 'SubjectManage') {
      this.dataParam.examId = this.$route.params.id
      this.getList(this.dataParam)
    }
  },
  methods: {
    // 获取列表
    getList(params) {
      getSubjectList(params).then((res) => {
        if (res.code === 10000) {
          res.data.dataList && res.data.dataList.map(item => {
            item.examTime = formatDate(new Date(item.examStartTime * 1000), 'yyyy-MM-dd hh:mm:ss') + ' ~ ' + formatDate(new Date(item.examEndTime * 1000), 'yyyy-MM-dd hh:mm:ss')
            item.ticketNo = item.startTicketNo + ' ~ ' + item.endTicketNo
          })
          this.tableData = res.data.dataList
          this.total = res.data.totalCount
        }
      })
    },
    // 获取所有考试科目
    getSubjects() {
      examSubjects().then((res) => {
        if (res.code === 10000) {
          this.subjectList = res.data
        }
      })
    },
    // 获取所有教室
    getClassroom() {
      examClassroom().then((res) => {
        if (res.code === 10000) {
          this.classRoomList = res.data
        }
      })
    },
    // 获取所有教师
    getTeachers(params) {
      allTeachers(params).then((res) => {
        if (res.code === 10000) {
          this.teacherData = res.data ? res.data : []
        }
      })
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.times = ''
      this.examStartTime = ''
      this.examEndTime = ''
      this.tags = ''
      this.addSubject.endTicketNo = ''
    },
    // 分页
    handleCurrentChange(val) {
      if (val === this.page) return
      this.dataParam.page = val
      this.getList(this.dataParam)
    },
    // 添加/编辑
    add(type, id) {
      this.getSubjects()
      this.getClassroom()
      if (type === 1) {
        this.drawerTitle = '添加考试科目'
      } else if (type === 2) {
        this.drawerTitle = '编辑考试科目'
        subjectDetail({ id }).then((res) => {
          if (res.code === 10000) {
            this.subjectId = id
            this.addSubject.subjectCode = res.data.subjectCode
            this.addSubject.startTicketNo = res.data.startTicketNo
            this.addSubject.endTicketNo = res.data.endTicketNo
            this.addSubject.examRoomNo = res.data.examRoomNo
            this.addSubject.roomCode = res.data.roomCode
            this.examStartTime = res.data.examStartTime
            this.examEndTime = res.data.examEndTime
            this.times = [res.data.examStartTime * 1000, res.data.examEndTime * 1000]
            this.tags = res.data.supervisors ? res.data.supervisors : []
          }
        })
      }
      this.addDialog = true
    },
    // 时间选择
    getTime(val) {
      console.log({ val })
      if (val) {
        this.examStartTime = val[0] / 1000
        this.examEndTime = val[1] / 1000
        this.times = val
      } else {
        this.examStartTime = ''
        this.examEndTime = ''
      }
    },
    // 添加教师
    openInner() {
      this.innerDrawer = true
    },
    // 添加教师 - 取消
    handleClose1() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.kw = ''
          _this.selctedRow = []
          _this.teacherData = []
          _this.$refs.multipleTable.clearSelection()
          _this.innerDrawer = false
        })
        .catch((_) => {})
    },
    // 删除
    del(id) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delSubject({ id }).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.dataParam)
        })
      }).catch(() => {

      })
    },
    // 教师添加-查询
    search() {
      const params = { kw: this.kw }
      this.getTeachers(params)
    },
    // table的key值
    getRowKeys(row) {
      return row.userId
    },
    // 人员勾选
    selctTeacher(val) {
      this.selctedRow = val
    },
    // 人员选择确定
    saveSelct() {
      if (this.tags.length > 0 && this.selctedRow) {
        const arr = [...this.tags, ...this.selctedRow]
        const newArr = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].userId === arr[j].userId) {
              ++i
            }
          }
          newArr.push(arr[i])
        }
        console.log({ newArr })
        this.tags = newArr
      } else {
        this.tags = this.selctedRow
      }
      this.innerDrawer = false
      this.selctedRow = []
      this.teacherData = []
      this.kw = ''
      this.$refs.multipleTable.clearSelection()
    },
    // 标签移除
    removeTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    // 新增/编辑-提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.addSubject))
          if (!this.examStartTime || !this.examEndTime) {
            return this.$message.error('考试时间不能为空！')
          }
          params.examStartTime = this.examStartTime
          params.examEndTime = this.examEndTime
          const supervisors = []
          this.tags && this.tags.map(item => {
            supervisors.push(item.userId)
          })
          console.log({ supervisors })
          params.supervisors = supervisors.toString()
          if (this.subjectId) {
            console.log(this.subjectId)
            params.id = this.subjectId
            editSubjects(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '编辑成功', type: 'success' })
                this.getList(this.dataParam)
                this.addDialog = false
                this.resetForm('addSubject')
              }
            })
          } else {
            params.examId = this.dataParam.examId
            addSubjects(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '添加成功', type: 'success' })
                this.dataParam.page = 1
                this.getList(this.dataParam)
                this.resetForm('addSubject')
                this.addDialog = false
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
          _this.resetForm('addSubject')
          _this.times = ''
          _this.examStartTime = ''
          _this.examEndTime = ''
          _this.tags = []
          _this.addDialog = false
        })
        .catch((_) => {})
    },
    // 批量导入
    batchImport(type) {
      const uploadUrl = './static/template/'
      if (type === 1) {
        this.importTitle = '考试模式导入'
        this.href = uploadUrl + '考试模式导入模板.xlsx'
      } else {
        this.importTitle = '考生批量导入'
        this.href = uploadUrl + '考生信息导入模板.xlsx'
      }
      this.importType = type
      this.importVisible = true
    },
    // 文件移除
    handleRemove(file, fileList) {
      this.file = ''
      this.fileList = []
    },
    // 文件个数限制
    handleExceed(files, fileList) {
      this.$message.error('只允许上传一个文件！')
    },
    // 改变事件
    changeFile(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      this.file = file.raw
      console.log(this.file)
      const isExcel = file.raw.name.substring(file.raw.name.lastIndexOf('.') + 1)
      if (isExcel !== 'xlsx') {
        this.$message.error('上传文件只能是 .xlsx 格式!')
        this.file = ''
        this.fileList = []
        return
      }
    },
    // 导入保存
    submitUpload() {
      if (!this.file) {
        this.$message.error('请先选择文件，再导入！')
        return
      }
      const form = new FormData()
      form.append('excel', this.file)
      form.append('examId', this.dataParam.examId)
      let requestApi
      if (this.importType === 1) {
        requestApi = modeImport
      } else if (this.importType === 2) {
        requestApi = batchImport
      }
      requestApi(form).then(res => {
        if (res.code === 10000) {
          if (!res.data.error) {
            this.$message({ message: '导入成功', type: 'success' })
            this.importVisible = false
            this.file = ''
            this.fileList = []
            this.getList(this.dataParam)
          } else {
            this.file = ''
            this.fileList = []
            if (res.data.header && res.data.sheetData) {
              const headerArr = []
              const sheetDataArr = []
              for (const index in res.data.header) {
                headerArr.push(res.data.header[index])
              }
              headerArr.push('提示')
              res.data.headerArr = headerArr
              res.data.sheetData.map(item => {
                const sheetDataArrItem = []
                for (const index in item) {
                  sheetDataArrItem.push(item[index])
                }
                if (!item.msg) {
                  item.err = '无'
                }
                sheetDataArr.push(sheetDataArrItem)
              })
              res.data.sheetDataArr = sheetDataArr
              this.importData = res.data
            }
          }
        } else {
          this.file = ''
          this.fileList = []
        }
      })
    },
    // 导入取消
    cancelImport(done) {
      this.file = ''
      this.fileList = []
      this.importData = {}
      this.importVisible = false
    },
    // 教室信息查询
    classroomInfo() {
      this.$router.push({ name: 'ClassroomList' })
    },
    // 考生信息
    examStudent(code) {
      sessionStorage.setItem('studentInfoPage', this.page)
      this.$router.push({ name: 'ExamineesInfo', query: { examId: this.dataParam.examId, roomCode: code }})
    },
    // 返回
    back() {
      window.history.go(-1)
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false
    if (to.name === 'ExamModeHome') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
  .subject-manage {
    width:100%;
    height: calc(100vh - 120px);
    position: relative;
    .back{
      position: absolute;
      bottom:10px;
      left:-34px;
      width:80px;
    }
    .buttons {
      margin-right: 20px;
    }
    .subjects-table {
      margin: 20px 0;
    }
    .el-form-item {
      /deep/.el-form-item__label {
        font-weight: normal;
      }
    }
    .add-subject-form{
      /deep/.el-select{
        width:100%;
      }
      .ticketNo{
        display: flex;
        justify-content: space-between;
        span{
          width:5%;
          text-align: center;
        }
      }
      .selectDate{
        /deep/.el-range-editor.el-input__inner{
          width:100%;
        }
      }
      .teacher-box{
        display: flex;
        align-items: center;
        .teachers{
          width:78%;
          min-height: 100px;
          border:1px solid #DCDFE6;
          border-radius: 4px;
          margin-right: 15px;
          .tags{
            margin:0 5px;
          }
        }
      }
    }
  }
  .btns {
    text-align: right;
    margin: 50px 65px 0 0;
    .cancel{
      margin-right: 15px;
    }
  }
  .add-teacher{
    padding:0 15px;
    .teacher-list{
      margin-top: 15px;
    }
    /deep/.el-input{
      width:60%;
      margin-right: 15px;
    }
  }
  .downLoad{
    color: #1890ff;
    margin-left: 30px;
  }
  .import-erro-table{
    border-collapse:collapse;
		text-align: center;
    width:96%;
    margin:15px auto;
    th{
      color: #4a4a4a;
      background-color: #eee;
      padding:10px;
    }
    th,td{
			padding:4px 6px;
			white-space: nowrap;
    }
    .redColor{
      color: red;
    }
  }

</style>
