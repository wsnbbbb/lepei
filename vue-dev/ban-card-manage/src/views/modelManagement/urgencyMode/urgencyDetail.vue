<template>
  <div class="urgency-detail">
    <el-form
      ref="detailList"
      :model="detailList"
      class="detail-form"
      label-width="150px"
      :rules="rules"
    >
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="标题：" prop="title">
            <el-input
              v-model="detailList.title"
              maxlength="30"
              placeholder="请输入标题"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="类型：" prop="contentType">
            <el-radio-group v-model="detailList.contentType">
              <el-radio :label="1">图片</el-radio>
              <el-radio :label="2">视频</el-radio>
              <el-radio :label="3">内容</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="detailList.contentType === 1" :gutter="24">
        <el-col :span="15">
          <el-form-item label="图片：" prop="images">
            <el-upload
              accept=".png,.jpg,.jpeg"
              class="upload-imgBox"
              action="string"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              multiple
              :limit="limit_num"
              :http-request="uploadFile"
              :show-file-list="false"
              :on-exceed="handleExceed"
            >
              <div class="tips">
                <el-button size="small" type="primary">上传图片</el-button>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="支持jpg/png/jpeg，单个不超过5MB，最多10张"
                  placement="bottom-start"
                >
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
            </el-upload>
            <div>
              <div class="img-box">
                <div
                  v-for="(item,index) in fileList"
                  :key="index"
                  class="itemBox"
                >
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="item"
                    :preview-src-list="fileList"
                  />
                  <div class="btn" @click="handClickDel(index)">x</div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="detailList.contentType === 2" :gutter="24">
        <el-col :span="15">
          <el-form-item label="视频：" prop="video">
            <div class="upload-box">
              <el-upload
                accept=".mp4,.mkv"
                class="upload-videoBox"
                action="action"
                :before-upload="beforeUpload1"
                :on-success="handleSuccess1"
                :show-file-list="false"
                :http-request="uploadFile"
              >
                <el-button size="small" type="primary">上传视频</el-button>
              </el-upload>
              <div class="tips">
                <el-button v-if="videoUrl" size="small" type="primary" plain @click="delVideo">删除视频</el-button>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="支持MP4 / MKV，不超过100MB"
                  placement="bottom-start"
                >
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
            </div>
            <video
              v-if="videoUrl"
              class="video"
              :src="videoUrl"
              controls="controls"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="detailList.contentType === 3" :gutter="24">
        <el-col :span="15">
          <el-form-item label="内容：" prop="content">
            <div class="Tinymce_box">
              <tinymce v-model="detailList.content" :height="300" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="17">
          <el-form-item label="展示教室：" prop="roomCodes">
            <div class="classroom-box">
              <div class="rooms">
                <el-tag
                  v-for="item in tags"
                  :key="item.roomCode"
                  class="tags"
                  closable
                  type="info"
                  @close="removeTag(item)"
                >
                  {{ item.roomName }}
                </el-tag>
              </div>
              <el-button
                size="medium"
                type="primary"
                plain
                @click="addClassroom"
              >添加</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item class="selectDate" label="是否循环：" prop="isLoop">
            <el-select v-model="detailList.isLoop" placeholder="请选择" @change="selectIsLoop">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item class="selectDate" label="展示时间：" prop="times">
            <el-date-picker
              v-if="detailList.isLoop === 0"
              v-model="dateTimes"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getTime"
            />
            <el-time-picker
              v-else
              v-model="times"
              :editable="false"
              is-range
              value-format="HH:mm:ss"
              format="HH:mm:ss"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              @change="getTime1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="优先级：" prop="priority">
            <div class="priority">
              <el-input
                v-model.number="detailList.priority"
                clearable
                auto-complete="off"
                placeholder="请输入1-100的整数"
              />
              <el-tooltip
                class="item"
                effect="dark"
                content="默认展示优先级高的内容，数字越大，优先级越高"
                placement="bottom-start"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button
        size="medium"
        type="primary"
        @click="submitForm('detailList')"
      >保存</el-button>
      <el-button size="medium" class="back" @click="back">返回</el-button>
    </div>
    <el-drawer
      title="添加展示教室"
      :append-to-body="true"
      :before-close="handleClose"
      :visible.sync="addDialog"
    >
      <div class="add-classroom">
        <div>
          <el-input
            v-model="kw"
            clearable
            auto-complete="off"
            placeholder="教室名称/建筑名称"
          />
          <el-button
            size="medium"
            type="primary"
            @click="search"
          >搜索</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :height="550"
          tooltip-effect="dark"
          :data="classroomList"
          highlight-current-row
          style="width: 100%"
          class="rooms-list"
          :row-key="getRowKeys"
          @selection-change="selctTeacher"
        >
          <el-table-column prop="roomName" label="教室名称" />
          <el-table-column prop="buildName" label="建筑名称" />
          <el-table-column prop="className" label="教室班级信息" />
          <el-table-column label="操作" type="selection" width="55" />
        </el-table>
        <div class="drawer-btn">
          <el-button
            size="medium"
            class="cancel"
            @click="handleClose"
          >取 消</el-button>
          <el-button
            size="medium"
            type="primary"
            @click="saveSelct"
          >添加</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { base } from '@/config'
import Tinymce from '@/components/Tinymce'
import {
  classRoomList,
  modeDetail,
  modeAdd,
  updateDetail,
  fileUpload
} from '@/api/urgencyMode'
export default {
  name: 'UrgencyDetail',
  components: { Tinymce },
  data() {
    const isNumber = (rule, value, callback) => {
      const patter = new RegExp('^([1-9]|[1-9]\\d|100)$')
      if (!patter.test(value)) {
        return callback(new Error('请输入1-100的正整数'))
      } else {
        callback()
      }
    }
    return {
      limit_num: 10, // 默认10张照片
      fileList: [],
      videoUrl: '',
      videoHash: '',
      imgHash: [],
      detailList: {
        title: '',
        contentType: 3,
        images: '',
        video: '',
        content: '',
        isLoop: 1,
        priority: '',
        roomCodes: '',
        times: '',
        dateTimes: ''
      },
      times: '',
      dateTimes: '',
      showStartTime: '',
      showEndTime: '',
      showStartDate: '',
      showEndDate: '',
      classroomList: [],
      tags: [],
      addDialog: false,
      selctedRow: [],
      kw: '',
      modeId: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 30, message: '最长30个字符', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '请输入优先级', trigger: 'blur' },
          { type: 'number', message: '优先级必须为数字值' },
          { validator: isNumber }
        ]
      },
      imgBase: ''
    }
  },
  computed: {},
  created() {
    this.imgBase = base + '/file/show?hash='
    this.modeId = this.$route.params.id
    if (this.modeId) {
      this.getDetail(this.$route.params.id)
    }
  },
  methods: {
    // 获取所有教室及班级
    getClassroom(params) {
      classRoomList(params).then((res) => {
        if (res.code === 10000) {
          this.classroomList = res.data
        }
      })
    },
    // 获取详情
    getDetail(id) {
      const params = { id }
      modeDetail(params).then((res) => {
        if (res.code === 10000) {
          this.detailList.title = res.data.title
          this.detailList.contentType = res.data.contentType
          this.detailList.isLoop = res.data.isLoop
          this.detailList.priority = res.data.priority
          res.data.rooms.map((item) => {
            this.tags.push({
              roomCode: item.code,
              roomName: item.name
            })
          })
          if (res.data.isLoop === 1) {
            this.showStartTime = res.data.showStartTime
            this.showEndTime = res.data.showEndTime
            this.times = [res.data.showStartTime, res.data.showEndTime]
          } else {
            this.showStartDate = res.data.showStartTime
            this.showEndDate = res.data.showEndTime
            this.dateTimes = [res.data.showStartTime, res.data.showEndTime]
          }
          if (res.data.contentType === 1) {
            const imgArr = []
            const hashArr = res.data.images.split(',')
            hashArr.map(item => {
              imgArr.push(this.imgBase + item)
            })
            this.fileList = imgArr
            this.imgHash = hashArr
            this.limit_num = 10 - imgArr.length
          } else if (res.data.contentType === 2) {
            this.videoUrl = this.imgBase + res.data.video
            this.videoHash = res.data.video
          } else {
            this.detailList.content = res.data.content
          }
        }
      })
    },
    // 文件个数限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，累计选择了 ${files.length + this.fileList.length} 个文件`
      )
    },
    // 上传前
    beforeUpload(file) {
      const limitSize = 5
      const isLt5M = file.size / 1024 / 1024 < limitSize
      const isImage = file.type.indexOf('image') !== -1
      let flag = true
      this.fileList &&
        this.fileList.map((item) => {
          if (item.name === file.name) {
            flag = false
          }
        })
      if (!flag) {
        this.$message.error('该文件已上传')
      }
      if (!isLt5M) {
        this.$message.error(`上传文件大小不能超过 ${limitSize}MB!`)
      }
      if (!isImage) {
        this.$message.error('上传图片只能是 jpg或jpeg或png 格式!')
      }
      return isLt5M && isImage && flag
    },
    // 上传成功
    handleSuccess(_res, _file, fileList) {
      const newArr = []
      const newHash = []
      if (_res.code === 10000) {
        newArr.push(this.imgBase + _res.data.hash)
        newHash.push(_res.data.hash)
      }
      const allArr = [...this.fileList, ...newArr]
      const allHash = [...this.imgHash, ...newHash]
      this.fileList = allArr
      this.imgHash = allHash
    },
    // 删除图片
    handClickDel(index) {
      this.fileList.splice(index, 1)
      this.imgHash.splice(index, 1)
      this.$message.success('删除成功')
      // 删除操作后需要更新数量限制
      this.limit_num = this.limit_num += 1
    },
    // 上传失败
    handleError(err, _file, fileList) {
      if (err.code !== 200) {
        this.$message({
          message: err.message || '上传失败',
          type: 'warning'
        })
      }
    },
    // 上传文件
    uploadFile(option) {
      const form = new FormData()
      form.append('file', option.file)
      return fileUpload(form)
    },
    delVideo() {
      this.videoUrl = ''
      this.videoHash = ''
      this.$message.success('删除成功')
    },
    // 视频上传-上传前
    beforeUpload1(file) {
      const limitSize = 100
      const isLt300M = file.size / 1024 / 1024 < limitSize
      const isVideo = file.type.indexOf('video') !== -1
      let flag = true
      if (this.videoUrl) {
        flag = false
      }
      if (!flag) {
        this.$message.error('限制上传1个视频文件')
      }
      if (!isLt300M) {
        this.$message.error(`上传文件大小不能超过 100 MB!`)
      }
      if (!isVideo) {
        this.$message.error('上传文件只能是 MP4或MKV 格式!')
      }
      return isLt300M && isVideo && flag
    },
    // 视频上传-上传成功
    handleSuccess1(_res, _file, fileList) {
      console.log(_res)
      if (_res.code === 10000) {
        this.videoUrl = this.imgBase + _res.data.hash
        this.videoHash = _res.data.hash
      }
    },
    // 选择是否循环
    selectIsLoop(val) {
      if (val === 0) {
        this.showStartDate = ''
        this.showEndDate = ''
        this.dateTimes = ''
      } else {
        this.showStartTime = ''
        this.showEndTime = ''
        this.times = ''
      }
    },
    // 日期时间选择
    getTime(val) {
      if (val) {
        this.showStartDate = val[0]
        this.showEndDate = val[1]
        this.dateTimes = val
      } else {
        this.showStartDate = ''
        this.showEndDate = ''
      }
    },
    // 时间选择
    getTime1(val) {
      if (val) {
        this.showStartTime = val[0]
        this.showEndTime = val[1]
        this.times = val
      } else {
        this.showStartTime = ''
        this.showEndTime = ''
      }
    },
    // 添加教室
    addClassroom() {
      this.addDialog = true
    },
    // 添加教室 - 取消
    handleClose() {
      const _this = this
      this.$confirm('确认关闭？')
        .then((_) => {
          _this.kw = ''
          _this.selctedRow = []
          _this.classroomList = []
          // _this.$refs.multipleTable.clearSelection()
          _this.addDialog = false
        })
        .catch((_) => {})
    },
    // 教室添加-查询
    search() {
      const params = { kw: this.kw }
      this.getClassroom(params)
    },
    // table的key值
    getRowKeys(row) {
      return row.roomCode
    },
    // 教室选择
    selctTeacher(val) {
      this.selctedRow = val
    },
    // 教室选择确定
    saveSelct() {
      if (this.tags.length > 0 && this.selctedRow) {
        const arr = [...this.tags, ...this.selctedRow]
        const newArr = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].roomCode === arr[j].roomCode) {
              ++i
            }
          }
          newArr.push({
            roomCode: arr[i].roomCode,
            roomName: arr[i].roomName
          })
        }
        console.log({ newArr })
        this.tags = newArr
      } else {
        this.selctedRow.map(item => {
          this.tags.push({
            roomCode: item.roomCode,
            roomName: item.roomName
          })
        })
      }
      this.addDialog = false
      this.selctedRow = []
      this.classroomList = []
      this.kw = ''
      this.$refs.multipleTable.clearSelection()
    },
    // 标签移除
    removeTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.detailList
          const params = {
            title: data.title,
            contentType: data.contentType,
            isLoop: data.isLoop,
            priority: data.priority
          }
          if (data.isLoop === 0) {
            if (!this.showStartDate && !this.showEndDate) {
              return this.$message.error('请选择展示时间')
            } else {
              params.showStartTime = this.showStartDate
              params.showEndTime = this.showEndDate
            }
          } else {
            if (!this.showStartTime && !this.showEndTime) {
              return this.$message.error('请选择展示时间')
            } else {
              params.showStartTime = this.showStartTime
              params.showEndTime = this.showEndTime
            }
          }
          if (!this.tags) {
            return this.$message.error('请选择展示教室')
          } else {
            const roomCodes = []
            this.tags.map((item) => {
              roomCodes.push(item.roomCode)
            })
            params.roomCodes = roomCodes.toString()
          }
          if (data.contentType === 1) {
            if (this.fileList.length === 0) {
              return this.$message.error('请上传图片')
            } else {
              params.images = this.imgHash.toString()
            }
          } else if (data.contentType === 2) {
            if (this.videoUrl === '') {
              return this.$message.error('请上传视频文件')
            } else {
              params.video = this.videoHash
            }
          } else {
            if (!data.content) {
              return this.$message.error('内容不能为空')
            } else {
              params.content = data.content
            }
          }
          console.log({ params })
          if (this.modeId) {
            params.id = this.modeId
            updateDetail(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '修改成功', type: 'success' })
                window.history.go(-1)
              }
            })
          } else {
            modeAdd(params).then((res) => {
              if (res.code === 10000) {
                this.$message({ message: '添加成功', type: 'success' })
                window.history.go(-1)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 返回
    back() {
      window.history.go(-1)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'UrgencyModeHome') {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
.urgency-detail {
  .detail-form {
    /deep/.el-form-item__label {
      font-weight: normal;
    }
    /deep/.el-icon-info {
      font-size: 24px;
      color: #909399;
      margin-left: 20px;
    }
    .hasIcon-box {
      display: flex;
      align-items: center;
    }
    .selectDate {
      /deep/.el-range-editor.el-input__inner {
        width: 100%;
      }
    }
    /deep/.el-select {
      width: 100%;
    }
    .priority {
      display: flex;
      align-items: center;
    }
    .el-icon-info {
      font-size: 24px;
      color: #909399;
      margin-left: 20px;
    }
    .tips {
      display: flex;
      align-items: center;
    }
    .classroom-box {
      display: flex;
      align-items: center;
      .rooms {
        width: 78%;
        min-height: 100px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        margin-right: 15px;
        .tags {
          margin: 0 5px;
        }
      }
    }
    .img-box{
      display: flex;
      margin-top: 10px;
      .itemBox{
        position: relative;
        .btn{
          width: 25px;
          height: 25px;
          // background: #fff;
          text-align: center;
          line-height: 25px;
          font-size: 18px;
          color: #f00;
          cursor: pointer;
          position: absolute;
          right:0;
          top:0;
        }
        /deep/.el-image{
          margin:5px;
          img{
            object-fit: cover;
          }
        }
      }
    }
    .upload-box{
      display: flex;
      .tips{
        margin-left: 20px;
      }
    }
    .video{
      width:500px;
      height:300px;
      margin-top: 20px;
    }
  }
  .btns {
    text-align: center;
    margin: 30px 0;
    .back {
      margin-left: 40px;
    }
  }
}
.add-classroom {
  padding: 0 15px;
  .rooms-list {
    margin-top: 15px;
  }
  /deep/.el-input {
    width: 60%;
    margin-right: 15px;
  }
}
.drawer-btn {
  text-align: right;
  margin: 30px 65px 0 0;
  .cancel {
    margin-right: 15px;
  }
}
</style>
