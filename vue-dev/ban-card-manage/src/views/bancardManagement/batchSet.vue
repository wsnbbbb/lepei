<template>
  <div class="time-set">
    <div class="title">
      <span>开关机设置</span>
      <el-tooltip class="hint" effect="dark" content="班牌开关机时间设置，仅班牌在线状态下生效" placement="bottom-start">
        <i class="el-icon-info" />
      </el-tooltip>
    </div>
    <div class="config-main">
      <el-row v-for="item in configData" :key="item.week" class="time-row">
        <el-checkbox v-model="item.checked" class="mr-10" @change="changeSelct(item.week,item.checked)">{{ weeks(item.week) }}</el-checkbox>
        <el-time-picker
          v-model="item.times[0]"
          :disabled="!item.checked"
          class="mr-10"
          is-range
          :editable="false"
          value-format="HH:mm:ss"
          format="HH:mm:ss"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
        <el-time-picker
          v-model="item.times[1]"
          :disabled="!item.checked"
          class="mr-10"
          is-range
          :editable="false"
          value-format="HH:mm:ss"
          format="HH:mm:ss"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
        <el-time-picker
          v-model="item.times[2]"
          :disabled="!item.checked"
          is-range
          :editable="false"
          value-format="HH:mm:ss"
          format="HH:mm:ss"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
      </el-row>
    </div>
    <div class="btns">
      <el-button size="medium" type="primary" @click="save">保存</el-button>
      <el-button size="medium" class="back" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
import { batchSetTime, getTimeSet, singleSetTime } from '@/api/banCardManage'
import { judgeTimeDiffer } from '@/utils/commonUtils'
export default {
  name: 'BatchSet',
  data() {
    return {
      value1: '',
      configData: [
        {
          week: 1,
          checked: false,
          times: ['', '', '']
        }, {
          week: 2,
          checked: false,
          times: ['', '', '']
        }, {
          week: 3,
          checked: false,
          times: ['', '', '']
        }, {
          week: 4,
          checked: false,
          times: ['', '', '']
        }, {
          week: 5,
          checked: false,
          times: ['', '', '']
        }, {
          week: 6,
          checked: false,
          times: ['', '', '']
        }, {
          week: 7,
          checked: false,
          times: ['', '', '']
        }
      ],
      cardId: ''
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      this.getSet(id)
      this.cardId = id
    }
  },
  methods: {
    weeks(val) {
      if (val === 1) {
        return '星期一'
      } else if (val === 2) {
        return '星期二'
      } else if (val === 3) {
        return '星期三'
      } else if (val === 4) {
        return '星期四'
      } else if (val === 5) {
        return '星期五'
      } else if (val === 6) {
        return '星期六'
      } else if (val === 7) {
        return '星期日'
      }
    },
    // 选择星期
    changeSelct(week, checked) {
      // if (!checked) {
      //   this.configData.map(item => {
      //     if (week === item.week) {
      //       item.times = ['', '', '']
      //     }
      //   })
      // }
    },
    // 获取指定班牌配置
    getSet(id) {
      getTimeSet({ id }).then(res => {
        if (res.code === 10000) {
          this.configData.map(item => {
            res.data && res.data.map(v => {
              if (v.week === item.week) {
                item.checked = true
                if (v.timeList.length > 0) {
                  item.times[0] = v.timeList[0] ? [v.timeList[0].startTime, v.timeList[0].endTime] : ''
                  item.times[1] = v.timeList[1] ? [v.timeList[1].startTime, v.timeList[1].endTime] : ''
                  item.times[2] = v.timeList[2] ? [v.timeList[2].startTime, v.timeList[2].endTime] : ''
                }
              }
            })
          })
        }
      })
    },
    // 保存
    save() {
      let flag = true // 验证所选择时间是否为空
      let checkTime = true // 验证是否有重叠时间
      let checkInterval = true // 验证间隔时间大于10分钟
      const dataArr = []
      this.configData.map(item => {
        if (item.checked) {
          if (!item.times[0] && !item.times[1] && !item.times[2]) {
            flag = false
          } else {
            const timeList = []
            const startTimeArr = []
            const endTimeArr = []
            item.times.map(v => {
              if (v) {
                startTimeArr.push(v[0])
                endTimeArr.push(v[1])
                timeList.push({
                  startTime: v[0],
                  endTime: v[1]
                })
              }
            })
            const begin = startTimeArr.sort()
            const end = endTimeArr.sort()
            for (let i = 1; i < begin.length; i++) {
              if (begin[i] < end[i - 1]) {
                checkTime = false
              }
            }
            console.log('111', item.times)
            if (item.times[0] && item.times[1]) {
              if (!judgeTimeDiffer(item.times[0][1], item.times[1][0])) {
                checkInterval = false
              }
            }
            if (item.times[1] && item.times[2]) {
              if (!judgeTimeDiffer(item.times[1][1], item.times[2][0])) {
                checkInterval = false
              }
            }
            if (item.times[0] && item.times[2]) {
              if (!judgeTimeDiffer(item.times[0][1], item.times[2][0])) {
                checkInterval = false
              }
            }
            dataArr.push({
              week: item.week,
              timeList: timeList
            })
          }
        } else {
          item.times = ['', '', '']
        }
      })
      if (!flag) {
        return this.$message.error('所选星期至少配置一个时间段')
      }
      if (!checkTime) {
        return this.$message.error('所选星期时间有重叠,请检查!')
      }
      if (!checkInterval) {
        return this.$message.error('时间段间隔必须大于10分钟!')
      }
      console.log({ dataArr })
      const params = { bootTimes: dataArr }
      if (this.cardId) {
        params.id = this.cardId
        singleSetTime(params).then(res => {
          if (res.code === 10000) {
            this.$message({ message: '班牌设置成功', type: 'success' })
            this.$router.push({ path: '/ban-card-management/banCard-manage' })
          }
        })
      } else {
        batchSetTime(params).then(res => {
          if (res.code === 10000) {
            this.$message({ message: '批量设置成功', type: 'success' })
            this.$router.push({ path: '/ban-card-management/banCard-manage' })
          }
        })
      }
    },
    // 返回
    back() {
      this.$router.push({ path: '/ban-card-management/banCard-manage' })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'BanCardManage') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
.time-set{
  .mr-10{
    margin-right: 20px;
  }
  .title{
    margin:20px 0 20px 20px;
    border-left: 4px solid #20A0FF;
    padding-left: 5px;
    display: flex;
    align-items: center;
    .hint{
      margin-left: 10px;
      color: #409EFF;
    }
  }
  .config-main{
    padding:20px 80px;
    .time-row{
      margin-bottom: 30px;
    }
  }
  .btns{
    text-align: center;
    margin:50px 0;
    .back{
      margin-left: 40px;
    }
  }
}
</style>
