<template>
  <div class="homework">
    <div class="info space">
      <van-row class="box">
        <van-col class="left" span="5">提交人</van-col>
        <van-col span="17" offset="2">{{ homeWorkDetail.applyPersonName }}</van-col>
      </van-row>
      <van-row class="box">
        <van-col class="left" span="5">提交时间</van-col>
        <van-col span="17" offset="2">{{ homeWorkDetail.applyTime }}</van-col>
      </van-row>
      <van-row class="issue">
        <van-col class="left" span="5">发布对象</van-col>
        <van-col span="17" offset="2">{{ homeWorkDetail.target }}</van-col>
      </van-row>
    </div>
    <div class="content space">
      <p>{{ homeWorkDetail.content }}</p>
      <viewer :images="previewImages">
        <div class="imgs">
          <div class="imgbox" v-for="(src,index) in previewImages" :key="index">
            <img class="img" :src="src">
          </div>
        </div>
      </viewer>
    </div>
    <div class="approval-process">
      <p class="title">审批流程</p>
      <div class="examines">
        <div class="step first">
          <div class="left">
            <div class="portrait"><img :src="homeWorkDetail.portrait" alt=""></div>
            <span class="text">{{ homeWorkDetail.applyPersonName }}</span>
          </div>
          <div class="right">{{ submitTime }}</div>
        </div>
        <div class="step" v-for="item in homeWorkDetail.examines" :key="item.step">
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
        <div v-if="homeWorkDetail.copyPersons.length > 0" class="step copyPerson">
          <div class="left box">
            <div class="defalutText portrait bgcolor2">抄送</div>
            <div class="person" v-for="(item, index) in homeWorkDetail.copyPersons" :key="index">
              <div class="header"><img :src="item.portrait" alt=""></div>
              <p style="marginTop:4px">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns">
      <div v-if="homeWorkDetail.canExamine == true">
        <van-button class="examines-btn" type="default" @click="clickbtn(0)">拒绝</van-button>
        <van-button class="examines-btn" color="#FFA1D2" @click="clickbtn(1)">同意</van-button>
      </div>
      <div class="status-btn" v-if="homeWorkDetail.status == 2">已同意</div>
      <div class="status-btn" v-if="homeWorkDetail.status == 3">已拒绝</div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Toast } from "vant";
import { notSeconds, examineType, formatDate } from "../utils/utils";
import { RelateDetailParm, clickExamine, DetailList } from "../types/index";


@Component({})
export default class Homework extends Vue {
  private previewImages: Array<string> = [];
  private submitTime: any = "";
  private examines: Array<object> = [];
  private params: RelateDetailParm = {
    recordId: localStorage.getItem("recordId"),
    type: "6"
  };
  private params1: clickExamine = {
    recordId: "",
    type: "6",
    status: ""
  };
  private homeWorkDetail: DetailList = {
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
  
  mounted(): void {
    this.getDtail();
  }
  private async getDtail(): Promise<void> {
    const data: any = await this.$https.post(this.$urls.getDetail, this.params)
    console.log(data);
    this.submitTime = formatDate(data.applyTime);
    this.homeWorkDetail = data;
    this.homeWorkDetail.applyTime = notSeconds(data.applyTime);
    this.params1.recordId = data.recordId + "";
    if (data.pics && data.pics.length != 0) {
      data.pics.forEach((item:any) => {
        this.previewImages.push(item.url);
      });
    }
    if (data.examines && data.examines.length != 0) {
      data.examines.forEach((item:any) => {
        item.examineTime = formatDate(item.examineTime);
        item.type = examineType(item.status.toString());
        if (item.persons && item.persons.length > 2) {
          item.persons.forEach((v:any, index:number) => {
            if (index < 2) {
              this.examines.push(v);
            }
          });
        }
      });
    }
  }

  private async clickbtn(status: number): Promise<void> {
    this.params1.status = status + "";
    const data: any = await this.$https.post(this.$urls.clickExamine, this.params1)
    this.getDtail()
  }
}
</script>

<style lang="less">
.homework {
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
    }
  }
  .approval-process {
    padding: 0.75rem 1rem 1rem 1rem;
  }
  
}
</style>