<template>
  <div class="nav-manage">
    <el-button size="medium" class="add-btn" type="primary" @click="add(1)">添加</el-button>
    <!-- 表格 -->
    <el-table
      class="navManage-table"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="code" label="编号" />
      <el-table-column prop="name" label="导航名称" />
      <el-table-column prop="type" label="类型" :formatter="formatType" />
      <el-table-column prop="seqNo" label="排序" />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="add(2,scope.row.code)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.code)">删除</el-button>
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
  </div>
</template>

<script>
import { navManageList, delNav } from '@/api/navManage'
export default {
  name: 'NavManage',
  data() {
    return {
      dataParam: {
        page: 1,
        pageSize: 20
      },
      total: 0,
      tableData: []
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
      if (row.type === 1) {
        return '内容'
      } else if (row.type === 2) {
        return '链接'
      } else if (row.type === 3) {
        return '原生模块'
      } else {
        return '未知'
      }
    },
    // 获取导航管理列表
    getList(params) {
      navManageList(params).then((res) => {
        if (res.code === 10000) {
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
    add(type, code) {
      if (type === 1) { // 添加
        this.$router.push({ path: '/nav-management/nav-detail' })
      } else if (type === 2) { // 编辑
        sessionStorage.setItem('navManagePage', this.page)
        this.$router.push({ path: '/nav-management/nav-detail/' + code })
      }
    },
    // 删除
    del(code) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delNav({ code: code }).then((res) => {
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
.navManage-table{
  margin:20px 0;
}
</style>
