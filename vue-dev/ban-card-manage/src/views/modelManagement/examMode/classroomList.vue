<template>
  <div class="classroom-list">
    <el-row :gutter="24">
      <el-col :span="5">
        <el-input
          v-model="kw"
          clearable
          auto-complete="off"
          placeholder="教室名称/建筑名称"
        />
      </el-col>
      <el-col :span="5" :offset="1">
        <el-button size="medium" type="primary" @click="search">查询</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      max-height="700"
      class="classroom-table"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="name" label="教室名称" />
      <el-table-column prop="buildName" label="建筑名称" />
      <el-table-column prop="code" label="教室编号" />
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
  </div>
</template>

<script>
import { classroomList } from '@/api/examMode'
export default {
  name: 'ClassroomList',
  data() {
    return {
      page: 1,
      pageSize: 20,
      total: 0,
      kw: '',
      tableData: []
    }
  },
  created() {
    const params = {
      page: 1,
      pageSize: 20
    }
    this.getList(params)
  },
  methods: {
    // 获取列表
    getList(params) {
      classroomList(params).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data.dataList
          this.total = res.data.totalCount
        }
      })
    },
    // 查询
    search() {
      const params = {
        kw: this.kw,
        page: 1,
        pageSize: 20
      }
      this.getList(params)
      this.page = 1
    },
    // 分页
    handleCurrentChange(val) {
      if (val === this.page) return
      this.page = val
      const params = {
        page: this.page,
        pageSize: 20
      }
      this.getList(params)
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
  .classroom-list {
    width:100%;
    height: calc(100vh - 120px);
    position: relative;
    .back{
      position: absolute;
      bottom:10px;
      left:-34px;
      width:80px;
    }
    .add-btn {
      margin-right: 20px;
    }
    .classroom-table {
      margin: 20px 0;
    }
  }
</style>
