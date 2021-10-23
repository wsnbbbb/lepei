<template>
  <div class="questionDetail">
    <div :class="{'show':isHide,'listName':true}">
      <p>{{questName}}</p>
      <p class="endtime">截止时间：{{endTime | changetime}}</p>
    </div>
    <p v-if="intro&&intro!=''" class="intro">{{intro}}</p>
    <div v-for="(item,index) in questList" :key="item.questionId" class="question">
       <!-- 简答题（10个字） -->
      <div v-if="item.questionType==1" class="type-1">
        <p><span>{{index+1}}、</span>{{item.questionCnt}}</p>
        <input
          v-model="item.answer"
          maxlength="10"
          class="myInput"
          placeholder="最多10个汉字"
          type="text"
        />
      </div>
      <!-- 简答题（50个字） -->
      <div v-if="item.questionType==2" class="type-2">
        <p><span>{{index+1}}、</span>{{item.questionCnt}}</p>
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
      <div v-if="item.questionType==3" class="type-3">
        <p><span>{{index+1}}、</span>{{item.questionCnt}}</p>
        <van-cell-group>
          <van-field v-model="item.answer" type="number" maxlength="11" placeholder="请输入有效的手机号" />
        </van-cell-group>
      </div>
      <!-- 单选 -->
      <div v-if="item.questionType==4" class="type-4">
        <p><span>{{index+1}}、</span>{{item.questionCnt}}（单选）</p>
        <van-radio-group v-model="item.answer">
          <van-cell-group>
            <van-cell
              v-for="(answer) in item.answerOptions"
              :key="answer.answerItem"
            >
              <span>{{answer.answerItem}}.&emsp;{{answer.answerContent}}</span>
              <van-radio slot="right-icon" :name="answer.answerItem" class="marginLeft" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <!-- 多选题 -->
      <div v-if="item.questionType==5" class="type-5">
       <p><span>{{index+1}}、</span>{{item.questionCnt}}（多选）</p>
        <van-checkbox-group v-model="item.answer">
          <van-cell-group>
            <van-cell 
            v-for="(answer) in item.answerOptions" 
            :key="answer.answerItem"
            clickable 
            >
              <span class="titleName">{{answer.answerItem}}.&emsp;{{answer.answerContent}}</span>
              <van-checkbox
                :name="answer.answerItem"
                ref="checkboxes"
                slot="right-icon"
                class="marginLeft"
              />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
      <div v-if="item.questionType==6" class="type-6">
        <p>
          <span>{{index+1}}、</span>
          {{item.questionCnt}}
        </p>
        <div class="upload">
            <img class="up-delete" src="../assets/imgs/icon-close.png" alt="" v-show="!!item.answer" @click="clearImg(index)">
            <img :src="!!item.answer ? baseUrlImg + item.answer : defaltImg" @click="clickFile(index)" alt="">
        </div>
      </div>
    </div>
    <div class="submit">
      <button :class="{'show':isHide,}" @click="clickSubmit">提交</button>
    </div>
    <input type="file" class="input-file" id="fileul" @change="choosePic">
  </div>
</template>

<script>
import { formatDate } from "../util/util";
import { questDetail, submit, uploadPic,getQiNiuToken } from "../api/request";
import Axios from "axios";
import { upLoaderImg } from "../util/http";
import { constants } from 'crypto';
import { debuglog } from 'util';
export default {
  data() {

    return {
      baseUrlImg: "http://test.qiniu.lepayedu.com/",
      defaltImg: require('../assets/imgs/icon-add.png'),
      questList: [], //详情列表
      isHide: true, //隐藏
      questName: "",
      intro: "",
      endTime: "",
      md5:'',
      currentIndex: ''
    };
  },
  async created() {
    let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
    this.questName = sessionStorage.getItem("title");  //问卷名称
    this.endTime = sessionStorage.getItem("endTime");  //截止时间
    this.md5 = sessionStorage.getItem("md5");  //md5
    this.intro = sessionStorage.getItem("intro");  //简介
    let params = this.$route.query;
    let res = await questDetail(params);
    this.isHide = false;
    res.detail.map(item=>{
      if(item.questionType ===5){
        item.answer = !!item.answer?item.answer.split(","):undefined
      }
    })
    this.questList = res.detail; //问卷详情列表
    console.log("详情列表",this.questList);
    let tokenRes = await getQiNiuToken()
    sessionStorage.setItem("token",tokenRes.detail.token)
  },
  async mounted(){
    
   
  },
  methods: {
   
    clickFile(index){
      this.currentIndex = index
      document.getElementById("fileul").click();
    },
    clearImg(index){
      this.questList[index].answer = ""
    },
    async choosePic(e) {
      let uploadImg = await upLoaderImg(e.target.files[0]);
      this.questList[this.currentIndex].answer = uploadImg.id
    },
    beforeRead(file) {
      //上传图片
      if (file.type !== "image/jpeg") {
        Toast("请上传 jpg 格式图片");
        return false;
      }
      return true;
    },
    async afterRead(file) {
      let uploadImg = await upLoaderImg(file.file);
    },
   clickSubmit() {
      let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      let flag = true
      let err = false
      let answer = []
      this.questList.map(item=>{
        if(item.questionType === 3){
          if(!reg.test(item.answer)){
            err = true;
          }
        }
        if(Array.isArray(item.answer)){
          if(item.answer.length == 0){
            flag = false
          }
        }
        if(!item.answer){
          flag = false
        }
        answer.push({
          questionId: item.questionId,
          answer: Array.isArray(item.answer)?item.answer.sort().join(","):item.answer
        })
      })

      if(!flag){
          this.$toast.fail('请将答题填写完整!');
          return
      }
      if(err){
         this.$toast("手机号格式错误")
         return
      }
      let _this = this;
      let params = _this.$route.query;
      // 添加参数 answers
      params.answers = answer;
      params.md5=this.md5
      console.log("参数",params);
      submit(params).then(res => {
          if(res.success){
            this.$dialog.alert({
              message: "提交成功！", //改变弹出框的内容
              confirmButtonText:"返回问卷列表",
              confirmButtonColor:"#379BFA"
            }).then(() => {
                this.$router.push({path:"/questionnairelist",query:{id:params.schoolId,tel: params.telephone,}})
              })
           
          }else{
            this.$toast.fail(res.description);
          }
      })
    }
  },
  filters: {
    changetime(time) {
      return formatDate(time);
    }  
  }
};
</script>

<style lang="less">
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
  .intro{
    background-color: #fff;
    padding:8px;
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
}
.input-file{
  display: none;
}
.upload{
  width: 70px;
  height: 70px;
  position: relative;
  img{
    width: 70px;
    height: 70px;
  }
  .up-delete{
    position: absolute;
    width: 20px;
    height: 20px;
    right: -5px;
    top: -5px;
    z-index: 999;
  }
}
</style>