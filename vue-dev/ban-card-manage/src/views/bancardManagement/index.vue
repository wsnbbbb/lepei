<template>
  <div class="ban-card">
    <div>
      <el-form ref="filters" :inline="true" :model="filters" class="serchForm">
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item prop="kw">
              <el-input
                v-model="filters.kw"
                clearable
                placeholder="MAC/IP"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="roomCode">
              <el-select v-model="filters.roomCode" filterable clearable placeholder="教室">
                <el-option
                  v-for="item in classRoomList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="status">
              <el-select v-model="filters.status" clearable placeholder="状态">
                <el-option label="在线" value="1" />
                <el-option label="离线" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
            <el-button type="primary" size="medium" plain @click="resetForm('filters')">重置</el-button>
            <span class="toggle" @click="toggle">{{ flag ? "收起" : "展开" }}<i :class="flag ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" /></span>
          </el-col>
        </el-row>
        <el-row :style="{ display: isShow ? 'block' : 'none' }">
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" size="medium" @click="add(1)">添加</el-button>&emsp;
              <el-button type="primary" size="medium" @click="setPssword">班牌管理密码</el-button>&emsp;
              <el-button type="primary" size="medium" @click="timeSet(1)">批量设置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table
      :max-height="isShow ? '630' : '680'"
      class="navManage-table"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="devSn" label="MAC" />
      <el-table-column prop="ip" label="IP" />
      <el-table-column prop="appVersion" label="软件版本" />
      <el-table-column prop="roomName" label="教室" />
      <el-table-column prop="className" label="班级" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span :style="{color:scope.row.status == 0 ? '#f00' : (scope.row.status == 1 ? '#67C23A' : '#606266')}">{{ scope.row.status == 0 ? '离线' : (scope.row.status == 1 ? '在线' : '未知') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="add(2,scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="timeSet(2,scope.row.id)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="filters.page"
      :page-size="20"
      :total="total"
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
        ref="addForm"
        :model="addForm"
        class="add-form"
        label-width="100px"
      >
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="MAC："
              prop="devSn"
              :rules="[{ required: true, message: '设备号不能为空' }]"
            >
              <el-input
                v-model="addForm.devSn"
                clearable
                auto-complete="off"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="教室："
              prop="roomCode"
              :rules="[{ required: true, message: '请选择教室', trigger: 'change' }]"
            >
              <el-select v-model="addForm.roomCode" filterable clearable placeholder="请选择">
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
          <el-button size="medium" type="primary" @click="submitForm('addForm')">保存</el-button>
        </div>
      </el-form>
    </el-drawer>
    <!-- 班牌管理密码 -->
    <el-drawer
      title="班牌管理密码"
      :before-close="handleClose1"
      :visible.sync="passwordDialog"
      direction="rtl"
      custom-class="banPassword-drawer"
      size="25%"
    >
      <el-form
        ref="banPassword"
        :model="banPassword"
        class="password-form"
        label-width="100px"
      >
        <el-row :gutter="24">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="管理密码："
              prop="password"
              :rules="[{ required: true, message: '密码不能为空' },
                       { type: 'number', message: '密码必须为数字'},
                       { pattern: /^\d{8}$/, message: '密码必须为8位数字',trigger: 'blur'}]"
            >
              <el-input
                v-model.number="banPassword.password"
                clearable
                show-word-limit
                maxlength="8"
                minlength="8"
                auto-complete="off"
                placeholder="8位，纯数字"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="btns">
          <el-button size="medium" class="cancel" @click="handleClose1">取 消</el-button>
          <el-button size="medium" type="primary" @click="savePassword('banPassword')">保存</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { banCardList, allClassRoom, delBancard, bancardDetail, banCardAdd, banCardEdit, getPassword, setPassword } from '@/api/banCardManage'
export default {
  name: 'BanCardManage',
  data() {
    return {
      total: 0,
      filters: {
        page: 1,
        pageSize: 20,
        kw: '',
        roomCode: '',
        status: ''
      },
      classRoomList: [],
      tableData: [],
      isShow: false,
      flag: false,
      drawerTitle: '添加',
      addDialog: false,
      passwordDialog: false,
      addForm: { devSn: '', roomCode: '' },
      banPassword: { password: '' }
    }
  },
  created() {
    if (!this.$route.meta.keepAlive) {
      this.getClassRoom()
      this.getList(this.filters)
    }
  },
  activated() {
    this.getClassRoom()
    this.getList(this.filters)
  },
  methods: {
    // 展开/收起
    toggle() {
      this.flag = !this.flag
      if (this.flag) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    // 获取班牌管理列表
    getList(params) {
      banCardList(params).then((res) => {
        if (res.code === 10000) {
          this.total = res.data.totalCount
          this.tableData = res.data.dataList
        }
      })
    },
    // 获取所有教室
    getClassRoom(params) {
      allClassRoom(params).then((res) => {
        if (res.code === 10000) {
          this.classRoomList = res.data
        }
      })
    },
    // 查询
    search() {
      this.getList(this.filters)
      this.filters.page = 1
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 分页
    handleCurrentChange(val) {
      if (val === this.page) return
      this.filters.page = val
      this.getList(this.filters)
    },
    // 删除
    del(id) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delBancard({ id }).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.filters)
        })
      }).catch(() => {

      })
    },
    // 添加/编辑
    add(type, id) {
      if (type === 1) {
        this.drawerTitle = '添加'
      } else if (type === 2) {
        this.drawerTitle = '编辑'
        bancardDetail({ id }).then((res) => {
          if (res.code === 10000) {
            this.addForm.devSn = res.data.devSn
            this.addForm.roomCode = res.data.roomCode
            this.devId = id
          }
        })
      }
      this.addDialog = true
    },
    // 新增/编辑-提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const params = this.addForm
        if (valid) {
          if (this.devId) {
            params.id = this.devId
            banCardEdit(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '编辑成功', type: 'success' })
                this.getList(this.filters)
                this.addDialog = false
                this.resetForm('addForm')
              }
            })
          } else {
            banCardAdd(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '添加成功', type: 'success' })
                const param = this.filters
                param.page = 1
                this.getList(param)
                this.addDialog = false
                this.resetForm('addForm')
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
          _this.resetForm('addForm')
          _this.addDialog = false
        })
        .catch((_) => {})
    },
    // 密码管理 - 取消
    handleClose1() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.resetForm('banPassword')
          _this.passwordDialog = false
        })
        .catch((_) => {})
    },
    // 密码管理&详情
    setPssword() {
      getPassword().then(res => {
        if (res.code === 10000) {
          this.banPassword.password = Number(res.data.password) || ''
        }
      })
      this.passwordDialog = true
    },
    // 密码管理-保存
    savePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = { password: this.banPassword.password }
          setPassword(params).then(res => {
            if (res.code === 10000) {
              this.$message({ message: '密码保存成功', type: 'success' })
              this.passwordDialog = false
              this.resetForm('banPassword')
            }
          })
        } else {
          return false
        }
      })
    },
    // 批量设置/设置
    timeSet(type, id) {
      if (type === 1) { // 批量设置
        this.$router.push({ path: '/ban-card-management/batch-set' })
      } else if (type === 2) { // 单个设置
        this.$router.push({ path: '/ban-card-management/batch-set/' + id })
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false
    next()
  }
}
</script>

<style lang="scss" scoped>
.ban-card{
  margin-top: 15px;
  ::v-deep .el-select{
      width:100%;
  }
  .el-form-item {
    ::v-deep .el-form-item__label {
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
  .serchForm{
    ::v-deep .el-form-item{
      width:100%;
    }
    ::v-deep .el-form-item__content{
      width:100%;
    }
    .toggle{
      cursor: pointer;
      color: #1890ff;
      margin-left: 15px;
    }
  }
}
.pagination{
  margin-top:20px;
  float: right;
}
</style>
