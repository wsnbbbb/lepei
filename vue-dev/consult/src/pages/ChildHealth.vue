<template>
  <van-form validate-first @failed="onFailed">
    <van-nav-bar title="幼儿健康登记表"  left-text="返回" @click-left="onClickLeft" left-arrow />
    <van-collapse v-model="activeNames" class="collapse">
      <van-collapse-item name="1" class="collapse-item">
        <template #title>
          <div class="title">
            <span>基础资料</span>
            <span class="english">Basic information</span>
          </div>
        </template>
        <van-form validate-first @failed="onFailed">
          <van-field
            v-model="detail.childName"
            name="childName"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写幼儿姓名' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">幼儿姓名</span>
                <span class="english lable-eg">Child's Name</span>
              </div>
            </template>
          </van-field>

          <van-field
            readonly
            clickable
            name="sex"
            :value="detail.sex == 1 ? '男' : detail.sex == 2 ? '女' : ''"
            placeholder="请选择"
            input-align="right"
            @click="showPicker = true"
            required
            :rules="[{ required: true, message: '请选择性别' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">性别</span>
                <span class="english lable-eg">Gender</span>
              </div>
            </template>
          </van-field>

          <div class="tips-box">
            <p class="tips">
              若遇到紧急情况，您的孩子需要医疗服务，学校将马上联络下列紧急联系人
            </p>
            <p class="tips-eg">
              Should a situation arise where emergency medical attention is
              required for your child, the school will immediately inform the
              person(s) you indicate below
            </p>
          </div>

          <van-field
            v-model="detail.emergencyContact"
            name="emergencyContact"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            class="emergencyContact"
            :rules="[{ required: true, message: '请填写紧急联系人姓名' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">紧急联系人姓名（除父母外）</span>
                <span class="english lable-eg">Emergency contacts</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.emergencyRelation"
            name="emergencyRelation"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写与幼儿关系' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">与幼儿关系</span>
                <span class="english lable-eg">Relationship</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.homeNumber"
            name="homeNumber"
            placeholder="请输入"
            input-align="right"
            maxlength="11"
            required
            :rules="[{ required: true, message: '请填写家庭电话' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">家庭电话</span>
                <span class="english lable-eg">Home Number</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.mobileNumber"
            name="mobileNumber"
            placeholder="请输入"
            input-align="right"
            maxlength="11"
            type="number"
            required
            :rules="[{ required: true, message: '请填写移动电话' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">移动电话</span>
                <span class="english lable-eg">Mobile Number</span>
              </div>
            </template>
          </van-field>

          <van-popup v-model="showPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
        </van-form>
      </van-collapse-item>
      <van-collapse-item name="2" class="collapse-item">
        <template #title>
          <div class="title">
            <span>既往病史（如有既往病史请如实勾选）</span>
            <span class="english">Past medical history</span>
          </div>
        </template>

        <div>
          <van-checkbox-group v-model="diseasesChoose">
            <div v-for="(answer, index) in diseases" :key="answer.id">
              <van-checkbox
                class="v-radio"
                :name="answer.id"
                ref="checkbox2"
                @click="radioclick2(answer.isAllowedRemark, index)"
                >{{ answer.name }}</van-checkbox
              >
              <van-field
                v-model="answer.remark"
                maxlength="100"
                type="textarea"
                :placeholder="answer.additionalPrompt"
                v-if="answer.radioflag"
                class="v-textarea"
              />
            </div>
          </van-checkbox-group>
        </div>
      </van-collapse-item>
      <van-collapse-item
        v-if="questList.length"
        name="3"
        class="collapse-item-last"
      >
        <template #title>
          <div class="title">
            <span>相关信息</span>
            <!-- <span class="english">sblings</span> -->
          </div>
        </template>
        <div class="questionDetail">
          <div v-for="(item, index) in questList" :key="index" class="question">
            <!-- 简答题（10个字） -->
            <div v-if="item.type == 1" class="type-1">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  type="text"
                  maxlength="10"
                  placeholder="最多10个汉字"
                />
              </van-cell-group>
            </div>
            <!-- 简答题（50个字） -->
            <div v-if="item.type == 2" class="type-2">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  maxlength="50"
                  type="textarea"
                  placeholder="最多50个汉字"
                  class="text"
                />
              </van-cell-group>
            </div>
            <!--手机号  -->
            <div v-if="item.type == 3" class="type-3">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  type="number"
                  maxlength="11"
                  placeholder="请输入有效的手机号"
                />
              </van-cell-group>
            </div>
            <!-- 单选 -->
            <div v-if="item.type == 4" class="type-4">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-radio-group
                v-model="item.answer"
                @change="changeradio(index)"
              >
                <!-- <van-cell-group>
                  <van-cell
                    v-for="(answer, index) in item.answerOptions"
                    :key="index"
                    clickable
                  >
                    <template #title>
                      <span>{{ answer.val }}.&emsp;{{ answer.item }}</span>
                    </template>
                    <template #right-icon>
                      <van-radio :name="answer.val" />
                    </template>
                    <div class="prompt">
                      <van-field
                        v-model="answer.prompt"
                        maxlength="100"
                        type="textarea"
                        :placeholder="answer.prompt"
                        class="text"
                      />
                    </div>
                  </van-cell>
                </van-cell-group> -->
                <div
                  v-for="(answer, index1) in item.answerOptions"
                  :key="index1"
                >
                  <van-radio
                    class="v-radio"
                    :name="answer.item"
                    @click="radioclick(answer.isNeedFill, index1, index)"
                    >{{ answer.item }}.&emsp;{{ answer.val }}</van-radio
                  >
                  <van-field
                    v-model="answer.remark"
                    maxlength="100"
                    type="textarea"
                    :placeholder="answer.prompt"
                    v-if="answer.radioflag"
                    class="v-textarea"
                  />
                </div>
              </van-radio-group>
            </div>
            <!-- 多选题 -->
            <div v-if="item.type == 5" class="type-5">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-checkbox-group v-model="item.answer">
                <!-- <van-cell-group>
                  <van-cell
                    v-for="(answer, index) in item.answerOptions"
                    :key="index"
                    clickable
                  >
                    <template #title>
                      <span>{{ answer.val }}.&emsp;{{ answer.item }}</span>
                    </template>

                    <template #right-icon>
                      <van-checkbox :name="answer.val" />
                    </template>
                  </van-cell>
                </van-cell-group> -->
                <div
                  v-for="(answer, index1) in item.answerOptions"
                  :key="index1"
                >
                  <van-checkbox
                    class="v-radio"
                    :name="answer.item"
                    ref="checkbox"
                    @click="radioclick3(answer.isNeedFill, index1, index)"
                    >{{ answer.item }}.&emsp;{{ answer.val }}</van-checkbox>
                  <van-field
                    v-model="answer.remark"
                    maxlength="100"
                    type="textarea"
                    :placeholder="answer.prompt"
                    v-if="answer.radioflag"
                    class="v-textarea"
                  />
                </div>
              </van-checkbox-group>
            </div>
            <!-- 图片上传 -->
            <div v-if="item.type == 6" class="type-6">
              <p class="subject">
                <span>{{ index + 1 }}、</span>
               {{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <div class="uploader">
                <van-uploader
                  v-model="item.answer"
                  :accept="'image/*'"
                  :max-size="2 * 1024 * 1024"
                  result-type="file"
                  :before-read="beforeRead(index)"
                  :max-count="1"
                />
              </div>
            </div>
            <!-- 图片上传 -->
            <div v-if="item.type == 7" class="type-7">
              <p class="subject">
                <span>{{ index + 1 }}、</span>
               {{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <div class="uploader">
                <van-uploader
                  v-model="item.answer"
                  :accept="'image/*'"
                  :max-size="2 * 1024 * 1024"
                  result-type="file"
                  :before-read="beforeRead1(index)"
                  :max-count="3"
                />
              </div>
            </div>

            <!--身份证  -->
            <div v-if="item.type == 8" class="type-8">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  type="number"
                  maxlength="18"
                  placeholder="请输入有效的身份证号"
                />
              </van-cell-group>
            </div>

            <!--日期与时间  -->
            <div v-if="item.type == 9" class="type-9">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-form>
                <van-field
                  readonly
                  clickable
                  name="date"
                  :value="item.answer"
                  placeholder="请选择"
                  @click="onclick3(index)"
                  :rules="[{ required: true, message: '请选择日期' }]"
                />
              </van-form>
              <van-popup v-model="showPicker8" position="bottom">
                <van-datetime-picker
                  v-model="currentDate"
                  @confirm="onConfirm8"
                  @cancel="showPicker8 = false"
                  type="date"
                  title="选择日期与时间"
                  :min-date="minDate1"
                  :max-date="maxDate"
                />
              </van-popup>
            </div>

            <!--时间  -->
            <div v-if="item.type == 10" class="type-10">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-form>
                <van-field
                  readonly
                  clickable
                  name="datetimePicker"
                  :value="item.answer"
                  placeholder="请选择"
                  @click="onclick4(index)"
                  :rules="[{ required: true, message: '请选择日期' }]"
                />
              </van-form>
              <van-popup v-model="showPicker9" position="bottom">
                <van-datetime-picker
                  v-model="item.answer"
                  @confirm="onConfirm9"
                  @cancel="showPicker9 = false"
                  type="time"
                  title="选择时间"
                />
              </van-popup>
            </div>

            <!-- 占位内容 -->
            <div v-if="item.type == 11" class="type-1">
              <p class="subject">
                {{ item.title }}
              </p>
              <!-- <input
                v-model="item.answer"
                maxlength="10"
                class="myInput"
                placeholder=" "
                type="text"
                disabled
              /> -->
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div class="sign">
      <div class="title">
        <span>家长签字</span>
        <span class="english english2">Parent signature</span>
      </div>
      <van-button block @click="showPicker1 = true" type="info" class="sign-btn"
        >手写签字</van-button
      >
    </div>
    <div class='signimg-box' v-if="signimg!==''">
    <van-image
      class="signimg"
      :src="signimg"
      width='300'
      height='300'
    />
    </div>

    <van-dialog
      class="dialog"
      v-model="showPicker1"
      title="请手写签名"
      show-cancel-button
      :before-close="handleReset"
      @confirm="handleGenerate"
      cancel-button-text="清屏"
    >
      <van-icon name="clear" class="icon" @click="dialogcancel" />
      <div>
        <vue-esign
          ref="esign"
          class="canvas"
          :height="300"
          :width="300"
          :isCrop="isCrop"
          :lineWidth="lineWidth"
          :lineColor="lineColor"
          :bgColor.sync="bgColor"
        />

      </div>
    </van-dialog>
    <div style="margin: 16px; padding-bottom: 30px">
      <van-button v-if="applyId==undefined" @click="submitinfo" block type="info"> 提交 </van-button>
      <van-button v-if="applyId!==undefined && detail.parentSecondSign==null" @click="doublesubmit" block type="info"> 二次提交 </van-button>
    </div>
  </van-form>
</template>

<script>
import {
  getFromDetail,
  getQiNiuToken,
  getDiseases,
  healthSubmit,
  getHealthPerson,
  healthSubmitTwo
} from "../api/request";
import { Decrypt, Encrypt } from "../util/secret";
import { upLoaderImg } from "../util/http";
import { getFormatDate, getQueryString, getStr } from "../util/util";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      imgBase: "http://test.qiniu.lepayedu.com/",
      //  imgBase: 'http://qiniu.lepayedu.com/',
      schoolId: "",
      activeNames: [],
      radioflag: false, //单选多选是否选中
      columns: [
        //性别选择
        {
          value: 1,
          text: "男",
        },
        {
          value: 2,
          text: "女",
        },
      ],
      showPicker: false,
      showPicker1: false,
      showPicker8: false,
      showPicker9: false,
      minDate: new Date(2010, 0, 1),
      minDate1: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(2015, 0, 1),
      currentDate1: new Date(1990, 0, 1),
      detail: {
        childName: "",
        sex: "",
        emergencyContact: "",
        emergencyRelation: "",
        homeNumber: "",
        mobileNumber: "",
        parentSign: "",
      },
      diseases: [], //既往病史
      diseasesChoose: [], //既往病史选项
      questList: [], //相关信息
      answerindex: "", //日期选择 相关信息下标
      answerindex1: "", //时间选择 相关信息下标
      signimg:'',
      applyId:''
    };
  },

  methods: {
    //获取问题列表
    async getFromDetail() {
      let params = { type: 4 };
      params.token = sessionStorage.getItem("token");
      params.uid = sessionStorage.getItem("uid");
      // let params=''
      let res = await getFromDetail(JSON.stringify(params));
      console.log(res);
      if (res.success) {
        res.detail &&
          res.detail.map((item) => {
            if (item.type === 5 || item.type === 6 || item.type === 7) {
              item.answer = [];
            } else {
              item.answer = "";
            }
            if (item.type === 4 || item.type === 5) {
              item.answerOptions.map((i) => {
                i.radioflag = false;
                i.remark=''
              });
            }
          });
        this.questList = res.detail;
        console.log(this.questList);
      }
    },

    //回显详情数据
    async getDetail(applyId){
      let params={}
      params.token = sessionStorage.getItem("token");
      params.uid = sessionStorage.getItem("uid");
      params.applyId=applyId
      console.log(params);
      let res = await getHealthPerson(JSON.stringify(params));
      console.log(res);
      if(res.success){
         this.activeNames=['1']
         this.detail.childName=res.detail.childName
         this.detail.sex=res.detail.sex
         this.detail.emergencyContact=res.detail.emergencyContact
         this.detail.emergencyRelation=res.detail.emergencyRelation
         this.detail.homeNumber=res.detail.homeNumber
         this.detail.mobileNumber=res.detail.mobileNumber
         this.diseases=res.detail.diseases
         this.detail.parentSecondSign=res.detail.parentSecondSign
        //  this.questList=res.detail.relateInfo
         res.detail.diseases.map(i=>{
           i.radioflag = false;
          //  console.log(i)
            if(i.isSelected==1){
               this.diseasesChoose.push(i.id)
               if(i.isAllowedRemark==1){
                 i.radioflag=true
               }
            }
         })

         res.detail.relateInfo.map(i=>{
           if(i.type==4){
              console.log(i)
              if(i.answer.length>0){
                i.answer=i.answer[0].item
              }
           }else
           if(i.type==5){
             let a=[]
              i.answer.map(j=>{
                 a.push(j.item)
              })
              i.answer=a
              console.log(i.answer)
           }else

           if(i.type==6||i.type==7){
              let a=[]
              i.answer.map(j=>{
                console.log(j)
                a.push({
                  url:this.imgBase+j,
                  isImage: true,
                })
             })
             i.answer=a
           }
           else{
             i.answer=i.answer[0]
           }
         })

          this.questList=res.detail.relateInfo
          console.log(this.questList)
      }
    },

    //获取既往病史
    async getDiseases() {
      let params = { type: 4 };
      params.token = sessionStorage.getItem("token");
      params.uid = sessionStorage.getItem("uid");
      // let params=''
      let res = await getDiseases(JSON.stringify(params));
      console.log(res);
      if (res.success) {
        res.detail &&
          res.detail.map((item) => {
            item.answer = "";
            item.radioflag = false;
            item.remark = "";
          });
        this.diseases = res.detail;
      }
    },
    //单选
    radioclick(i, index1, index) {
      this.questList[index].answerOptions.map((item) => {
        item.radioflag = false;
      });
      if (i == 1) {
        this.questList[index].answerOptions[index1].radioflag = true;
      }
    },

    //多选
    radioclick3(i, index1, index) {
      let flag=this.$refs.checkbox[index1].checked
      if(!flag){
        if (i == 1) {
          this.questList[index].answerOptions[index1].radioflag = true;
        }
      }else{
        this.questList[index].answerOptions[index1].radioflag = false;
      }
    },

    //病史选择
    radioclick2(i, index) {
      let flag=this.$refs.checkbox2[index].checked
      if(!flag){
        if (i == 1) {
          this.diseases[index].radioflag = true;
        }
      }else{
         this.diseases[index].radioflag = false;
      }
    },

    // 单张上传
    beforeRead(index) {
      return (file) => {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          let msg = "请上传 jpeg/png 格式图片";
          Toast(msg);
          return false;
        } else {
          upLoaderImg(file).then((res) => {
            console.log(res);
            if (res.success) {
              this.questList.map((item, idx) => {
                if (idx === index) {
                  item.answer = [
                    {
                      url: this.imgBase + res.id,
                      isImage: true,
                    },
                  ];
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
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          let msg = "请上传 jpeg/png 格式图片";
          Toast(msg);
          return false;
        } else {
          upLoaderImg(file).then((res) => {
            if (res.success) {
              this.questList.map((item, idx) => {
                if (idx === index) {
                  item.answer.push({
                    url: this.imgBase + res.id,
                    isImage: true,
                  });
                }
              });
            }
          });
        }
      };
    },
    //基础资料性别选择
    onConfirm(item) {
      this.value = item.text;
      this.detail.sex = item.value;
      this.showPicker = false;
    },

    //相关信息 日期选择
    onConfirm8(item) {
      let date = getFormatDate(item);
      // console.log(date);
      this.showPicker8 = false;
      let index = this.answerindex;
      let oldData = this.questList;
      oldData.forEach((el, i) => {
        if (i == index) {
          console.log("222222");
          el.answer = date;
        }
      });
      this.questList = oldData;
      // console.log(this.questList);
    },
    //相关信息 时间选择
    onConfirm9(item) {
      let time = item;
      this.showPicker9 = false;
      let index = this.answerindex1;
      let oldData = this.questList;
      oldData.forEach((el, i) => {
        if (i == index) {
          el.answer = time;
        }
      });
      this.questList = oldData;
      // console.log(this.questList);
    },

    //获取当前相关信息 日期选择
    onclick3(i) {
      console.log(i);
      this.showPicker8 = true;
      this.answerindex = i;
    },
    //获取当前相关信息 时间选择
    onclick4(i) {
      console.log(i);
      this.showPicker9 = true;
      this.answerindex1 = i;
    },

    //提交
    async submitinfo() {
      // debugger
      let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      let flag = true;
      let err = false;
      let relateInfo = [];
      let obj = this.detail;
      let diseases = [];
      if (
        !obj.childName ||
        !obj.emergencyContact ||
        !obj.sex ||
        !obj.emergencyRelation ||
        !obj.homeNumber ||
        !obj.mobileNumber||
        !obj.parentSign
      ) {
        flag = false;
      }

      this.diseases.map((item) => {
        this.diseasesChoose.map((i) => {
          if (item.id == i) {
            diseases.push({ id: i, remark: item.remark });
          }
        });
      });

      this.questList.map((item) => {
        console.log(item);
        let imgs = [];
        if (item.answer === "") {
          if (item.type !== 11 && item.isMust==1) {
            console.log(item);
            flag = false;
          }
        }

        if (Array.isArray(item.answer)) {
          if (item.answer.length == 0 && item.isMust==1) {
            flag = false;
          }
        }

        if (item.type === 3 && item.isMust==1) {
          if (!reg.test(item.answer)) {
            err = true;
          }
        }
        if (item.type == 4) {
          //  console.log(item)
          let param = [];
          item.answerOptions.map((i) => {
            if (i.item == item.answer) {
              param.push({ item: item.answer, remark: i.remark });
            }
          });
          relateInfo.push({
            seq: item.seq,
            answer: param,
          });
        } else if (item.type == 5) {
          //  console.log(item)
          let param = [];
          item.answer.map((i) => {
            item.answerOptions.map((j) => {
              if (i == j.item) {
                param.push({ item: i, remark: j.remark });
              }
            });
          });
          relateInfo.push({
            seq: item.seq,
            answer: param,
          });
        } else if (item.type == 6) {
          let param = [];
          if(item.answer.length > 0){
            param.push(getStr(item.answer[0].url));
          }
          relateInfo.push({
            seq: item.seq,
            // answer: item.answer.length > 0 ? getStr(item.answer[0].url) : [],
            answer: item.answer.length > 0 ? param : [],
          });
        } else if (item.type == 7) {
          item.answer.length > 0 &&
            item.answer.map((v) => {
              imgs.push(getStr(v.url));
            });
          relateInfo.push({
            seq: item.seq,
            // answer: imgs.join(","),
            answer: imgs,
          });
        } else {
          // console.log(item)
          let params = [];
          params.push(item.answer);
          // console.log(params);
          relateInfo.push({
            seq: item.seq,
            answer: params,
          });
        }
      });

      console.log(flag);
      if (!flag) {
        this.$toast("请将内容填写完整!");
        return;
      } else if (err) {
        this.$toast("手机号格式错误");
        return;
      } else {
        let params = this.detail;
        params.diseases = diseases;
        params.relateInfo = relateInfo;
        params.token = sessionStorage.getItem("token");
        params.uid = sessionStorage.getItem("uid");
        console.log(params);
        healthSubmit(JSON.stringify(params)).then((res) => {
          // console.log(res);
          if (res.success) {
            this.$toast("提交成功");
            setTimeout(() => {
              this.$router.push({ path: "/welcome" });
            }, 1000);
          } else {
            this.$toast.fail(res.description);
          }
        });
      }
    },

    //二次提交
    async doublesubmit() {
      // debugger
      let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      let flag = true;
      let err = false;
      let relateInfo = [];
      let obj = this.detail;
      let diseases = [];
      if (
        !obj.childName ||
        !obj.emergencyContact ||
        !obj.sex ||
        !obj.emergencyRelation ||
        !obj.homeNumber ||
        !obj.mobileNumber||
        !obj.parentSign
      ) {
        console.log('必填')
        flag = false;
      }

      this.diseases.map((item) => {
        this.diseasesChoose.map((i) => {
          if (item.id == i) {
            diseases.push({ id: i, remark: item.remark });
          }
        });
      });

      this.questList.map((item) => {
        console.log(item);
        let imgs = [];
        if (item.answer === "") {
          if (item.type !== 11 && item.isMust==1) {
            console.log('必填')
            flag = false;
          }
        }

        if (Array.isArray(item.answer)) {
          if (item.answer.length == 0 && item.isMust==1) {
            if(item.type!==11){
              console.log(item)
              console.log('必填')
              flag = false;
            }
          }
        }

        if (item.type === 3 && item.isMust==1) {
          if (!reg.test(item.answer)) {
            err = true;
          }
        }
        if (item.type == 4) {
          //  console.log(item)
          let param = [];
          item.answerOptions.map((i) => {
            if (i.item == item.answer) {
              param.push({ item: item.answer, remark: i.remark });
            }
          });
          relateInfo.push({
            seq: item.seq,
            answer: param,
          });
        } else if (item.type == 5) {
           console.log(item)
          let param = [];
          item.answer.map((i) => {
            item.answerOptions.map((j) => {
              if (i == j.item) {
                param.push({ item: i, remark: j.remark });
              }
            });
          });
          relateInfo.push({
            seq: item.seq,
            answer: param,
          });
        } else if (item.type == 6) {
          let param = [];
          if(item.answer.length > 0){
            param.push(getStr(item.answer[0].url));
          }
          relateInfo.push({
            seq: item.seq,
            // answer: item.answer.length > 0 ? getStr(item.answer[0].url) : [],
            answer: item.answer.length > 0 ? param : [],
          });
        } else if (item.type == 7) {
          item.answer.length > 0 &&
            item.answer.map((v) => {
              imgs.push(getStr(v.url));
            });
          relateInfo.push({
            seq: item.seq,
            // answer: imgs.join(","),
            answer: imgs,
          });
        } else {
          // console.log(item)
          let params = [];
          if(item.answer!==undefined || item.answer!=='' || item.answer!==[]){
            params.push(item.answer);
          }
          // console.log(params);
          relateInfo.push({
            seq: item.seq,
            answer: params,
          });
        }
      });

      console.log(flag);
      if (!flag) {
        this.$toast("请将内容填写完整!");
        return;
      } else if (err) {
        this.$toast("手机号格式错误");
        return;
      } else {
        let params = this.detail;
        params.diseases = diseases;
        params.relateInfo = relateInfo;
        params.token = sessionStorage.getItem("token");
        params.uid = sessionStorage.getItem("uid");
        params.parentSecondSign=this.detail.parentSign
        params.applyId=this.applyId
        delete params.parentSign
        console.log(params);
        healthSubmitTwo(JSON.stringify(params)).then((res) => {
          console.log(res);
          if (res.success) {
            this.$toast("提交成功");
            setTimeout(() => {
              this.$router.push({ path: "/welcome" });
            }, 1000);
          } else {
            this.$toast.fail(res.description);
          }
        });
      }
    },

    handleReset(action, done) {
      // 清除
      this.$refs.esign.reset();
      done(false);
    },
    dialogcancel() {
      this.$refs.esign.reset();
      this.showPicker1 = false;
    },
    handleGenerate() {
      // 获取base64

      var _this = this;
      _this.$refs.esign
        .generate()
        .then((res) => {
          // 转成文件
          var file = _this.dataURLtofile(res, "签名.jpg");
          console.log(file);
          upLoaderImg(file).then((res) => {
            console.log(res);
            if (res.success) {
              _this.detail.parentSign=res.id
              _this.signimg = _this.imgBase + res.id
            }
            _this.dialogcancel()
          });
        })
        .catch((err) => {
          _this.$toast('请手写签名'); // 画布没有签字时会执行这里 'Not Signned'
        });
    },
    // 将base64转换为File
    dataURLtofile(dataurl, fileName) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },

    //返回
    onClickLeft(){
         this.$router.push({"path":'./welcome'})
     },
  },
  async created() {
    let schoolId = sessionStorage.getItem("shoolId");
    console.log(schoolId);
    this.schoolId = schoolId;

    // 获取七牛token
    let tokenRes = await getQiNiuToken({
      schoolId: schoolId,
    });
    console.log(tokenRes);
    sessionStorage.setItem("qiniutoken", tokenRes.detail.token);

    this.getFromDetail();
    this.getDiseases();

    let applyId = this.$route.query.applyId;
    console.log(applyId)
    this.applyId=applyId
    if(applyId!==undefined){
        this.getDetail(applyId)
    }
  },
  async mounted() {},
};
</script>

<style lang="less" scoped>
.english {
  font-size: 12px;
  margin-top: -8px;
  color: #ccc;
}
.chinese {
  font-size: 13px;
  width: 150px;
}
.lable-eg {
  width: 180px;
}
.title {
  display: flex;
  flex-direction: column;
}
/deep/.van-field__error-message {
  text-align: right !important;
}
.addsbling {
  font-size: 12px;
  height: 30px;
}
/deep/.van-collapse-item__content {
  text-align: right !important;
}
.head {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 10px;
  .head-left {
    border-left: 5px solid #1989fa;
    color: #323233;
  }
  .head-right {
    color: red;
  }
}

.active {
  border-color: red;
}
.show {
  display: none;
}
.titleName {
  width: 100%;
  white-space: normal;
}
.marginLeft {
  margin-left: 1rem;
}
.questionDetail {
  font-size: 0.8rem;
  padding: 0 1rem;
  .van-cell__title {
    text-align: left !important;
  }
  .subject {
    text-align: left !important;
    color: #323233;
  }
  .intro {
    background-color: #fff;
    padding: 8px;
  }
  .listName {
    background-color: #fff;
    margin-top: 0.5rem;
    p {
      font-weight: bold;
      margin: 0;
      padding: 0.5rem;
      &:last-child {
        font-weight: normal;
        font-size: 0.5rem;
        color: #b5b3b3;
      }
    }
  }
  .question {
    p {
      margin: 0.8rem 0;
    }
    .type-1 {
      .myInput {
        width: 100%;
        height: 1.8rem;
        border: none;
        text-indent: 1rem;
      }
    }
    .type-2 {
      .text {
        width: 100%;
        height: 5rem;
        border: none;
      }
    }
  }
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      width: 70%;
      height: 2.5rem;
      background-color: #379bfa;
      margin: 1.5rem auto;
      border-radius: 50px;
      border: none;
      color: #fff;
      font-size: 1rem;
    }
  }
  .uploader {
    text-align: left !important;
  }
}
.input-file {
  display: none;
}
.upload {
  width: 70px;
  height: 70px;
  position: relative;
  img {
    width: 70px;
    height: 70px;
  }
  .up-delete {
    position: absolute;
    width: 20px;
    height: 20px;
    right: -5px;
    top: -5px;
    z-index: 999;
  }
}

/deep/.van-nav-bar__title {
  line-height: 44px !important;
}
.v-radio {
  line-height: 44px !important;
  padding: 10px 0;
  // height: 44px;
}
.v-textarea {
  padding-top: 0px !important;
  border: 1px dashed #ccc;
}
/deep/.van-cell--clickable {
  background-color: rgba(255, 240, 246, 0.5);
}
/deep/.collapse-item-last .van-field {
  background-color: #fff;
}
/deep/.collapse-item .van-collapse-item__content .van-form .van-field {
  background-color: rgba(186, 231, 255, 0) !important;
}
/deep/.collapse-item .van-collapse-item__content {
  background-color: rgba(186, 231, 255, 0.3) !important;
}
.tips {
  font-size: 13px;
  color: #323233;
  text-align: left !important;
}
.tips-eg {
  font-size: 12px;
  text-align: left !important;
}
.tips-box {
  margin: 10px 0;
}
.sign {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  .sign-btn {
    width: 100px;
    background-color: #f20000;
    border: none;
  }
  .english2 {
    margin-top: 0;
  }
}
.canvas {
  width: 100%;
  margin: 0 auto;
  border: 1px dashed #c2c1c1;
}
.icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
}
.dialog {
  // position: relative;
}
.signimg{
   margin:auto;
}
.signimg-box{
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.signimg{
  border: 1px dashed #ccc;
}
/deep/.emergencyContact{
  .van-field__label  {
    width:10.2rem!important;
  }
}
</style>