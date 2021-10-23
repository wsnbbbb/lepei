<template>
  <div class="check-student-leave">
    <div class="info">
      <van-row class="box">
        <van-col class="left" span="5">宝宝</van-col>
        <van-col span="17" offset="2">{{ detailList.personName }}</van-col>
      </van-row>
      <van-row class="box">
        <van-col class="left" span="5">提交时间</van-col>
        <van-col span="17" offset="2">{{ detailList.applyTime }}</van-col>
      </van-row>
      <div class="times">
        <van-row class="box">
          <van-col class="left" span="5">请假原因</van-col>
          <van-col span="17" offset="2">{{ detailList.typeName }}</van-col>
        </van-row>
        <van-row class="box">
          <van-col class="left" span="5">开始时间</van-col>
          <van-col span="17" offset="2">{{ detailList.startTime }}</van-col>
        </van-row>
        <van-row class="box">
          <van-col class="left" span="5">结束时间</van-col>
          <van-col span="17" offset="2">{{ detailList.endTime }}</van-col>
        </van-row>
        <van-row class="box">
          <van-col class="left" span="5">请假天数</van-col>
          <van-col span="17" offset="2">{{ detailList.days }}天</van-col>
        </van-row>
      </div>
      <van-row class="box">
        <van-col class="left" span="5">状态</van-col>
        <van-col 
        span="17"
        offset="2"
        :style="{color:detailList.status == 1 ? '#4EE54E' : detailList.status == 2 ? '#F69332' : detailList.status == 0 ? '#F84E2D' : '' }">
        {{ detailList.type }}</van-col>
      </van-row>
    </div>
    <div class="content">
      <p class="title">备注说明</p>
      <p>{{ detailList.remark }}</p>
      <viewer :images="previewImages">
        <div class="imgs">
          <div class="imgbox" v-for="(src,index) in previewImages" :key="index">
            <img class="img" :src="src">
          </div>
        </div>
      </viewer>
    </div>
    
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { notSeconds, examineType, formatDate } from "../utils/utils";
import { ReadDetailParm, LeaveDetail } from "../types/index";


@Component({})
export default class CheckStudentLeave extends Vue {
  private previewImages: Array<string> = [];
  private params: ReadDetailParm = {
    recordId: localStorage.getItem("recordId")
  };
  private detailList: LeaveDetail = {
    personName: "",
    applyTime: "",
    remark: "",
    pics: [],
    status: 0,
    type: "",
    canExamine: true,
    startTime: "",
    endTime: "",
    days: 0,
    typeName: ""
  };
  
  mounted(): void {
    this.checkStudentLive();
  }
  private async checkStudentLive(): Promise<void> {
    const data: any = await this.$https.post(this.$urls.checkStudentLive, this.params)
    console.log(data);
    this.detailList = data;
    this.detailList.applyTime = notSeconds(data.applyTime);
    this.detailList.startTime = notSeconds(data.startTime);
    this.detailList.endTime = notSeconds(data.endTime);
    this.detailList.type = examineType(data.status);
    if (data.pics && data.pics.length != 0) {
      data.pics.forEach((item:any) => {
        this.previewImages.push(item.url);
      });
    }
  }


}
</script>

<style lang="less">
.check-student-leave {
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
      padding: 35px 0;
    }
    .box {
      line-height: 2rem;
    }
    .left {
      text-align: right;
      color: #999999;
    }
  }
  .content {
    margin-top: 35px;
    .title {
      color: #999;
      margin-bottom: 1rem;
    }
  }
 
}
</style>