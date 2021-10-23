<template>
  <div class="standard-mode">
    <el-form ref="numberValidateForm" :model="numberValidateForm" label-width="120px" class="timeForm">
      <el-form-item
        label="静默时间："
        prop="time"
        :rules="[{ required: true, message: '时间不能为空'}]"
      >
        <div class="time-box">
          <el-input-number
            v-model.number="numberValidateForm.time"
            :min="1"
            :max="60"
            :step="1"
            step-strictly
          />
          <span class="text">分钟</span>
          <el-tooltip class="item" effect="dark" content="班牌无操作时长，超过静默时间，自动返回首页" placement="bottom-start">
            <i class="el-icon-info" />
          </el-tooltip>
        </div>
        <div v-if="numberValidateForm.time" class="tips">提示：最短时间1分钟，最长时间60分钟</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('numberValidateForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { silenceTime, setSilenceTime } from '@/api/examMode'
export default {
  data() {
    return {
      numberValidateForm: {
        time: 1
      },
      tips: ''
    }
  },
  created() {
    this.getTime()
  },

  methods: {
    // 获取静默时间
    getTime() {
      silenceTime().then(res => {
        if (res.code === 10000) {
          this.numberValidateForm.time = res.data.time
        }
      })
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setSilenceTime({ 'time': this.numberValidateForm.time }).then(res => {
            if (res.code === 10000) {
              this.$message({ message: '保存成功', type: 'success' })
              this.getTime()
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .standard-mode{
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
    .el-form-item{
      margin-bottom: 10px;
    }
  }
</style>
