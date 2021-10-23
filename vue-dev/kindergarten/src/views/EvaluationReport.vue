<template>
  <div class="evaluation-report">
    <div class="info space">
      <van-row class="box">
        <div class="left">提交人</div>
        <div span="17" class="right">{{ reportDetail.applyPersonName }}</div>
      </van-row>
      <van-row class="box">
        <div class="left">提交时间</div>
        <div span="17" class="right">{{ reportDetail.applyTime }}</div>
      </van-row>
      <van-row class="issue">
        <div class="left">发布对象</div>
        <div span="17" class="right">{{ reportDetail.target }}</div>
      </van-row>
    </div>
    <div class="content space">
      <p>{{ reportDetail.content }}</p>
      <viewer :images="previewImages">
        <div class="imgs">
          <div class="imgbox" v-for="(src,index) in previewImages" :key="index">
            <img class="img" :src="src">
          </div>
        </div>
      </viewer>
    </div>
    <!-- <div class="approval-process">
      <p class="title">审批流程</p>
      <div class="examines">
        <div class="step first">
          <div class="left">
            <div class="portrait"><img :src="reportDetail.portrait" alt=""></div>
            <span class="text">{{ reportDetail.applyPersonName }}</span>
          </div>
          <div class="right">{{ submitTime }}</div>
        </div>
        <div class="step" v-for="item in reportDetail.examines" :key="item.step">
          <div v-if="item.persons.length == 1" class="left">
            <div class="portrait"><img :src="item.persons[0].portrait" alt=""></div>
            <span class="text">{{ item.persons[0].name }}</span>
            <span class="text" 
            :style="{color:item.status == 1 ? '#4EE54E' : item.status == 2 ? '#F84E2D' : item.status == 0 ? '#F69332' : '' }"
            >{{ item.type }}</span>
          </div>
          <div v-else-if="item.persons.length > 2" class="left">
            <div class="defalutText portrait bgcolor1">审批</div>
            <div class="person" v-for="(v, i) in examines" :key="i">
              <div class="header"><img :src="v.portrait" alt=""></div>
              <p style="marginTop:4px">{{ v.name }}</p>
            </div>
            <van-icon class="text" name="ellipsis" />
            <span class="text"
            :style="{color:item.status == 1 ? '#4EE54E' : item.status == 2 ? '#F84E2D' : item.status == 0 ? '#F69332' : '' }"
            >{{ item.type }}</span>
          </div>
          <div v-else-if="item.persons.length > 0" class="left">
            <div class="defalutText portrait bgcolor1">审批</div>
            <div class="person" v-for="(v, i) in item.persons" :key="i">
              <div class="header"><img :src="v.portrait" alt=""></div>
              <p style="marginTop:4px">{{ v.name }}</p>
            </div>
            <span class="text"
            :style="{color:item.status == 1 ? '#4EE54E' : item.status == 2 ? '#F84E2D' : item.status == 0 ? '#F69332' : '' }"
            >{{ item.type }}</span>
          </div>
          <div class="right" v-if="item.status != 0">{{ item.examineTime }}</div>
        </div>
        <div v-if="reportDetail.copyPersons.length > 0" class="step copyPerson">
          <div class="left box">
            <div class="defalutText portrait bgcolor2">抄送</div>
            <div class="person" v-for="(item, index) in reportDetail.copyPersons" :key="index">
              <div class="header"><img :src="item.portrait" alt=""></div>
              <p style="marginTop:4px">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="btns">
      <div v-if="reportDetail.canExamine == true">
        <van-button class="examines-btn" type="default" @click="clickbtn(0)">拒绝</van-button>
        <van-button class="examines-btn" color="#FFA1D2" @click="clickbtn(1)">同意</van-button>
      </div>
      <div class="status-btn" v-if="reportDetail.status == 2">已同意</div>
      <div class="status-btn" v-if="reportDetail.status == 3">已拒绝</div>
    </div> -->
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Toast } from "vant";
import { notSeconds, examineType, formatDate } from "../utils/utils";
import { RelateDetailParm, DetailList, clickExamine } from "../types/index";


@Component({})
export default class EvaluationReport extends Vue {
  private msg: string = "";
  private recordId: string = "";
  private previewImages: Array<string> = [];
  private submitTime: any = "";
  private examines: Array<object> = [];
  private params: RelateDetailParm = {
    recordId: '',
    type: "1"
  };
  private params1: clickExamine = {
    recordId: "",
    type: "1",
    status: ""
  };
  private reportDetail: DetailList = {
    applyPersonName: "",
    target: "",
    content: "",
    applyTime: "",
    pics: [],
    portrait: "",
    examines: [],
    copyPersons: [],
    status: 0,
    canExamine: true
  };

  private postBaseInfo(result): void {
    console.log(result);
    this.msg = result
    localStorage.setItem("userInfo", result)
  }

  private postRecordId(result): void {

    this.getDtail(result);
   
  }

  private isiOS(): Boolean {
    let u = navigator.userAgent, app = navigator.appVersion;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //如果输出结果是true就判定是android终端或者uc浏览器
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //根据输出结果true或者false来判断ios终端
    if(isAndroid){
      return false
    }else if(isiOS){
      return true
    }
  }

  mounted(): void {
    try {
      if(this.isiOS()){
        window.webkit.messageHandlers.getBaseInfo.postMessage(null);
        window.webkit.messageHandlers.getRecordId.postMessage(null);
      }else{
        localStorage.setItem("userInfo", window.app.getBaseInfo());
        this.getDtail(window.app.getRecordId());
      }
    } catch (e) {

    }
    window.postBaseInfo = this.postBaseInfo;
    window.postRecordId = this.postRecordId;
  }
  
  private async getDtail(id): Promise<void> {
    let params ={
      recordId: id,
      type: "1"
    }
    const data: any = await this.$https.post(this.$urls.getDetail, params)
    console.log(data);
    
    this.submitTime = formatDate(data.applyTime);
    this.reportDetail = data;
    this.reportDetail.applyTime = notSeconds(data.applyTime);
    this.params1.recordId = data.recordId + "";
    if (data.pics && data.pics.length != 0) {
      data.pics.forEach((item:any) => {
        this.previewImages.push(item.url);
      });
    }
    // if (data.examines && data.examines.length != 0) {
    //   data.examines.forEach((item:any) => {
    //     item.examineTime = formatDate(item.examineTime);
    //     item.type = examineType(item.status.toString());
    //     if (item.persons && item.persons.length > 2) {
    //       item.persons.forEach((v:any, index:number) => {
    //         if (index < 2) {
    //           this.examines.push(v);
    //         }
    //       });
    //     }
    //   });
    // }
    // }
  }

  // private async clickbtn(status: number): Promise<void> {
  //   this.params1.status = status + "";
  //   const data: any = await this.$https.post(this.$urls.clickExamine, this.params1)
  //   this.getDtail()
  // }
}
</script>

<style lang="less">
.evaluation-report {
  margin-bottom: 3rem;
  .bgcolor1 {
    background-color: #269af4;
  }
  .bgcolor2 {
    background-color: #f84e2d;
  }
  .space {
    padding: 1.75rem 1rem;
    border-bottom: 1px solid #f8f8f8;
  }
  .van-nav-bar .van-icon {
    color: #2c3e50;
  }
  .info {
    .box {
      line-height: 2rem;
    }
    .issue {
      margin-top: 1.5625rem;
    }
    .left {
      text-align: right;
      color: #999999;
      width: 30%;
      display: inline-block;
    }
    .right{
      display: inline-block;
      width: 70%;
      text-indent: 2em;
    }
  }
  .approval-process {
    padding: 0.75rem 1rem 1rem 1rem;
  }
}
</style>