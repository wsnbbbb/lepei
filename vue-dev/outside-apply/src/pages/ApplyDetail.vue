<template>
  <div class="questionDetail">
    <div class="typeName">
      <p>{{ title }}</p>
      <p v-if="remark !== ''" class="remark">{{ remark }}</p>
    </div>
    <van-field
      v-model="personName"
      maxlength="10"
      label="申请人"
      placeholder="请输入"
    />
    <div v-for="(item, index) in questList" :key="item.id" class="question">
      <p class="title">
        <span>{{ index + 1 }}、</span
        >{{ item.isMust == 1 ? item.title + "（必答）" : item.title
        }}{{ item.type == 5 ? "（多选）" : "" }}
      </p>
      <!-- 简答题（10个字） -->
      <van-field
        v-if="item.type === 1"
        maxlength="10"
        clearable
        v-model="item.answer"
        class="myInput"
        placeholder="最多10个汉字"
      />
      <!-- 简答题（50个字） -->
      <van-field
        v-if="item.type === 2"
        maxlength="50"
        clearable
        v-model="item.answer"
        type="textarea"
        placeholder="最多50个汉字"
        class="text"
      />
      <!--手机号  -->
      <van-field
        v-if="item.type === 3"
        v-model="item.answer"
        type="tel"
        clearable
        maxlength="11"
        placeholder="请输入有效的手机号"
      />
      <!-- 单选 -->
      <van-radio-group v-if="item.type === 4" v-model="item.answer">
        <van-cell-group>
          <van-cell v-for="option in item.options" :key="option.item" clickable>
            <span>{{ option.item }}.&emsp;{{ option.val }}</span>
            <van-radio
              slot="right-icon"
              :name="option.item"
              class="marginLeft"
            />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <!-- 多选题 -->
      <van-checkbox-group v-if="item.type === 5" v-model="item.answer">
        <van-cell-group>
          <van-cell v-for="option in item.options" :key="option.item" clickable>
            <span class="titleName"
              >{{ option.item }}.&emsp;{{ option.val }}</span
            >
            <van-checkbox
              :name="option.item"
              ref="checkboxes"
              slot="right-icon"
              class="marginLeft"
            />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <!-- 图片上传（单张） -->
      <van-uploader
        v-if="item.type === 6"
        v-model="item.answer"
        :accept="'image/*'"
        :max-size="2 * 1024 * 1024"
        result-type="file"
        :before-read="beforeRead(index)"
        :max-count="1"
      />
      <!-- 图片上传（不超过3张） -->
      <van-uploader
        v-if="item.type === 7"
        v-model="item.answer"
        :accept="'image/*'"
        :max-size="2 * 1024 * 1024"
        result-type="file"
        :before-read="beforeRead1(index)"
        :max-count="3"
      />
      <!-- 身份证号 -->
      <van-field
        v-if="item.type === 8"
        clearable
        maxlength="18"
        placeholder="请填写身份证号"
        v-model="item.answer"
      />
      <!-- 日期与时间 -->
      <van-field
        v-if="item.type === 9"
        readonly
        name="item.answer"
        :value="item.answer"
        placeholder="点击选择日期"
        @click="showCalendar(index)"
      >
      <template #right-icon v-if="item.answer">
        <van-icon class="clear-icon" name="clear" @click.stop="clearDate(index)"/>
      </template>
      </van-field>
    </div>
    <van-calendar v-model="show" @confirm="dateConfirm" />
    <div :class="isHide ? 'hide' : 'submit'">
      <van-button round block type="info" @click="clickSubmit">提交</van-button>
    </div>
  </div>
</template>

<script>
import { questDetail, submitApply, getQiNiuToken } from "../api/request";
import { getQueryString, getStr } from "../util/util";
import { upLoaderImg } from "../util/http";
import { Toast } from "vant";
export default {
  data() {
    return {
      baseUrlImg: "http://test.qiniu.lepayedu.com/",
      questList: [], //详情列表
      isHide: true, //隐藏
      title: "",
      remark: "",
      personName: "",
      md5: "",
      imgBase: "http://test.qiniu.lepayedu.com/",
      show: false,
      currentIndex: "",
      userInfo: {},
      itemId: "",
     
    };
  },
  async created() {
    let itemId = getQueryString("id");
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.userInfo = userInfo;
    this.itemId = itemId;
    let params = {
      schoolId: userInfo.id,
      telephone: userInfo.tel,
      itemId: itemId,
    };
    let res = await questDetail(params);
    if (res.success) {
      res.detail.questionList &&
        res.detail.questionList.map((item) => {
          if (item.type === 5 || item.type === 6 || item.type === 7) {
            item.answer = [];
          }
        });
      this.isHide = false;
      this.title = res.detail.title;
      this.remark = res.detail.remark;
      this.questList = res.detail.questionList;
    }
    // 获取七牛token
    let tokenRes = await getQiNiuToken({ schoolId: userInfo.id });
    sessionStorage.setItem("token", tokenRes.detail.token);
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    // 单张上传
    beforeRead(index) {
      return (file) => {
        if (file.type !== "image/jpeg") {
          let msg = "请上传 jpg 格式图片";
          Toast(msg);
          return false;
        } else {
          upLoaderImg(file).then((res) => {
            if (res.success) {
              this.questList.map((item, idx) => {
                if (idx === index) {
                  if(res.id!==''){
                    item.answer = [
                      {
                        url: this.imgBase + res.id,
                        isImage: true,
                      },
                    ];
                  }
                }
              });
            }
          });
        }
      };
    },
    // 多张上传
    beforeRead1(index) {
      return (file) => {
        if (file.type !== "image/jpeg") {
          let msg = "请上传 jpg 格式图片";
          Toast(msg);
          return false;
        } else {
          upLoaderImg(file).then((res) => {
            if (res.success) {
              this.questList.map((item, idx) => {
                if (idx === index) {
                  if(res.id!==''){
                    item.answer.push({
                      url: this.imgBase + res.id,
                      isImage: true,
                    });
                  }
                }
              });
            }
          });
        }
      };
    },
    // 日期选择
    showCalendar(index) {
      this.show = true;
      this.currentIndex = index;
    },
    // 日期选择确定
    dateConfirm(date) {
      this.questList[this.currentIndex].answer = this.formatDate(date);
      this.show = false;
    },
    // 日期清除
    clearDate(index) {
      this.questList[index].answer = ''
    },
    // 提交
    clickSubmit() {
      let reg =
        11 &&
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      let flag = true;
      let err = false; // 手机号格式验证
      let answers = [];
      if (!this.personName) {
        return this.$toast.fail("请填写申请人姓名!");
      }
      this.questList.map((item) => {
        let imgs = [];
        if (item.isMust == 1) {
          if (Array.isArray(item.answer) && item.answer.length == 0) {
            flag = false;
          }
          if (!item.answer) {
            flag = false;
          }
        }
        if (item.type === 3 && item.answer && !reg.test(item.answer)) {
          err = true;
        }
        if (item.type == 6) {
          answers.push({
            qid: item.id,
            answer: item.answer.length > 0 ? getStr(item.answer[0].url) : [],
          });
        } else if (item.type == 7) {
          item.answer.length > 0 &&
            item.answer.map((v) => {
              imgs.push(getStr(v.url));
            });
          answers.push({
            qid: item.id,
            answer: imgs.join(","),
          });
        } else {
          answers.push({
            qid: item.id,
            answer: Array.isArray(item.answer)
              ? item.answer.join(",")
              : item.answer,
          });
        }
      });
      if (!flag) {
        this.$toast.fail("请将必答题填写完整!");
        return;
      }
      if (err) {
        this.$toast.fail("手机号格式错误");
        return;
      }

      answers.map(i=>{
        if(Array.isArray(i.answer)){
          i.answer = i.answer.join(",")||''
        }
      })
      
      let params = {
        schoolId: this.userInfo.id,
        telephone: this.userInfo.tel,
        itemId: this.itemId,
        applyPerson: this.personName,
        answers: answers,
      };

      console.log({ params });
      submitApply(params).then((res) => {
        if (res.success) {
          this.$dialog
            .alert({
              message: "提交成功！", //改变弹出框的内容
              confirmButtonText: "返回",
              confirmButtonColor: "#379BFA",
            })
            .then(() => {
              this.$router.push({ path: "/outside-list" });
            });
        } else {
          this.$toast.fail(res.description);
        }
      });
    },
  },
};
</script>

<style lang="less" scope>
.questionDetail {
  font-size: 0.8rem;
  padding-top: 0.625rem;
  .hide {
    display: none;
  }
  .typeName {
    background-color: #fff;
    padding: 10px 15px;
    margin-bottom: 10px;
    .remark {
      color: #b5b3b3;
      font-size: 0.75rem;
      margin-top: 15px;
    }
  }
  .question {
    .title {
      margin: 0.8rem 0;
      text-indent: 0.8rem;
    }
    .clear-icon{
      color:#C8C9CC;
    }
  }
  .submit {
    padding: 1rem 2rem;
  }
}
.van-uploader__preview {
  margin-left: 0.625rem;
}
.van-image-preview__image {
  position: absolute;
}
.van-uploader__upload {
  background-color: #fff;
  margin-left: 10px;
}
.van-calendar__footer {
  padding-bottom: 0.625rem;
}
</style>
