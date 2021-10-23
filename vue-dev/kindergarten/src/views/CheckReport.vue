<template>
  <div class="check-report">
    <div class="detail">
      <h4 class="title">测评报告</h4>
      <p class="name">
        <span>{{ detailList.personName }}</span>
        <span>{{ detailList.applyTime }}</span>
      </p>
      <p class="content">{{ detailList.content }}</p>
      <viewer :images="previewImages">
        <div class="imgs">
          <div class="imgbox" v-for="(src, index) in previewImages" :key="index">
            <img class="img" :src="src">
          </div>
        </div>
      </viewer>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { formatDate } from "../utils/utils";
import { ReadDetailParm, TextReport } from "../types/index";


@Component({})
export default class CheckReport extends Vue {
  private previewImages: Array<string> = [];
  private time: number;
  private detailList: TextReport = {
    type: 0,
    personName: "",
    content: "",
    applyTime: "",
    pics: []
  };
  private params: ReadDetailParm = {
    recordId: localStorage.getItem("recordId")
  };
 
  mounted(): void {
    this.testReport();
  }
  
  private async testReport(): Promise<void> {
    const data: any = await this.$https.post(this.$urls.testReport, this.params)
    console.log(data);
    this.detailList = data;
    this.detailList.applyTime = formatDate(data.applyTime);
    if (data.pics && data.pics.length != 0) {
      data.pics.forEach((item:any) => {
        this.previewImages.push(item.url);
      });
    }
    
  }

}
</script>

<style lang="less">
.check-report {
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