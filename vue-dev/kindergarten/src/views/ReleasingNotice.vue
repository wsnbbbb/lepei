<template>
  <div class="releasing-notice">
    <div class="info">
      <van-row class="box">
        <van-col class="left" span="5">提交人</van-col>
        <van-col span="17" offset="2">{{ detailList.applyPersonName }}</van-col>
      </van-row>
      <van-row class="box">
        <van-col class="left" span="5">提交时间</van-col>
        <van-col span="17" offset="2">{{ detailList.applyTime }}</van-col>
      </van-row>
      <div class="times">
        <van-row class="box">
          <van-col class="left" span="5">通知类型</van-col>
          <van-col span="17" offset="2">{{ detailList.typeName }}</van-col>
        </van-row>
        <van-row class="issue">
          <van-col class="left" span="5">发布对象</van-col>
          <van-col span="17" offset="2">{{ detailList.target }}</van-col>
        </van-row>
      </div>
    </div>
    <div class="content">
      <p class="title">{{ detailList.title }}</p>
      <p>{{ detailList.content }}</p>
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
            <div class="portrait"><img :src="detailList.portrait" alt=""></div>
            <span class="text">{{ detailList.applyPersonName }}</span>
          </div>
          <div class="right">{{ submitTime }}</div>
        </div>
        <div class="step" v-for="item in detailList.examines" :key="item.step">
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
        <div v-if="detailList.copyPersons.length > 0" class="step copyPerson">
          <div class="left box">
            <div class="defalutText portrait bgcolor2">抄送</div>
            <div class="person" v-for="(item, index) in detailList.copyPersons" :key="index">
              <div class="header"><img :src="item.portrait" alt=""></div>
              <p style="marginTop:4px">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns">
      <div v-if="detailList.canExamine == true">
        <van-button class="examines-btn" type="default" @click="clickbtn(0)">拒绝</van-button>
        <van-button class="examines-btn" color="#FFA1D2" @click="clickbtn(1)">同意</van-button>
      </div>
      <div class="status-btn" v-if="detailList.status == 2">已同意</div>
      <div class="status-btn" v-if="detailList.status == 3">已拒绝</div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { notSeconds, examineType, formatDate } from "../utils/utils";
import { RelateDetailParm, noticeData, clickExamine } from "../types/index";


@Component({})
export default class ReleasingNotice extends Vue {
  private previewImages: Array<string> = [];
  private submitTime: any;
  private examines: Array<object> = [];
  private params: RelateDetailParm = {
    recordId: localStorage.getItem("recordId"),
    type: "8"
  };
  private params1: clickExamine = {
    recordId: "",
    type: "8",
    status: ""
  };
  private detailList: noticeData = {
    applyPersonName: "",
    title: "",
    portrait: "",
    target: "",
    examines: [],
    copyPersons: [],
    applyTime: "",
    content: "",
    typeName: "",
    pics: [],
    canExamine: true,
  };
  
  mounted(): void {
    this.getDtail();
  }
  private async getDtail(): Promise<void> {
    const data: any = await this.$https.post(this.$urls.getDetail, this.params);
    this.submitTime = formatDate(data.applyTime);
    this.detailList = data;
    this.detailList.applyTime = notSeconds(data.applyTime);
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
    this.params1.status = status + '';
    const data: any = await this.$https.post(this.$urls.clickExamine, this.params1)
    this.getDtail();
  }
}
</script>

<style lang="less">
.releasing-notice {
  padding: 1.75rem 1rem;
  .bgcolor1 {
    background-color: #269af4;
  }
  .bgcolor2 {
    background-color: #f84e2d;
  }
  .van-nav-bar .van-icon {
    color: #2c3e50;
  }
  .info {
    .times {
      padding: 30px 0;
      border-bottom: 1px solid #f8f8f8;
    }
    .box {
      line-height: 2rem;
    }
    .issue {
      padding-top: 5px;
    }
    .left {
      text-align: right;
      color: #999999;
    }
  }
  .content {
    margin-top: 30px;
    .title {
      color: #999;
      margin-bottom: 1rem;
    }
  }
}
</style>