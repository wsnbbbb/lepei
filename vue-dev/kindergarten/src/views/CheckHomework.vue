<template>
  <div class="check-homework">
    <div class="detail">
      <h4 class="title">{{ detailList.title }}</h4>
      <p class="name">
        <span>{{ detailList.publisherName }}</span>
        <span>{{ detailList.applyTime }}</span>
      </p>
      <p class="content">{{ detailList.content }}</p>
      <viewer :images="previewImages">
        <div class="imgs">
          <div class="imgbox" v-for="(src,index) in previewImages" :key="index">
            <img class="img" :src="src">
          </div>
        </div>
      </viewer>
    </div>
    <div class="btns">
      <van-button class="confirmBtn" v-if="detailList.hasRead == false" @click="confirm" color="#FFA1D2">确认收到</van-button>
      <div class="status-btn " v-else>已确认</div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Toast } from "vant";
import { formatDate } from "../utils/utils";
import { ReadDetailParm, ReadHomework, ConfirmRead } from "../types/index";


@Component({})
export default class CheckHomework extends Vue {

  private previewImages: Array<string> = [];
  private time: number;
  private detailList: ReadHomework = {
    title: "",
    publisherName: "",
    content: "",
    applyTime: "",
    pics: [],
    hasRead: false,
    homeworkId: 0
  };
  private params: ReadDetailParm = {
    recordId: localStorage.getItem("recordId")
  };
  private params1: ConfirmRead = {
    recordId: 0
  };
  mounted(): void {
    this.checkHomework();
  }

  
  private async checkHomework(): Promise<void> {
    const data: any = await this.$https.post(this.$urls.checkHomework, this.params)
    console.log(data);
    this.detailList = data;
    this.params1.recordId = data.homeworkId;
    this.detailList.applyTime = formatDate(data.applyTime);
    if (data.pics && data.pics.length != 0) {
      data.pics.forEach((item:any) => {
        this.previewImages.push(item.url);
      });
    }
    
  }
  private async confirm(): Promise<void> {
    const data: any = await this.$https.post(this.$urls.confirmRead, this.params1)
    this.checkHomework();
  }

}
</script>

<style lang="less">
.check-homework {
  margin-bottom: 3.125rem;
  .detail {
    padding: 1.25rem 1.6875rem;
    .name {
      margin: 0.75rem 0;
      font-size: 0.75rem;
      color: #adadad;
      span {
        &:first-child {
          margin-right: 16px;
        }
      }
    }
    .content {
      padding: 15px 0;
    }
  }
}
</style>