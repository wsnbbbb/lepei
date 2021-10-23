<template>
  <div class="auditDetail">
    <div class="status">
      <h2>当前状态：{{status | applyStatus}}</h2>
      <p v-if="status == 3 && reason != ''" class="remark">{{reason}}</p>
    </div>
    <div v-if="status == 3 && reasonImgs.length > 0">
      <van-image
        v-for="(img, index) in reasonImgs"
        :key=index
        width="80"
        height="80"
        :src="img"
        class="img"
      />
    </div>
    <div class="typeName">
      <p>{{title}}</p>
      <p v-if="remark !== ''" class="remark">{{remark}}</p>
    </div>
    <div v-for="(item,index) in questList" :key="item.id" class="question">
      <p class="title"><span>{{index+1}}、</span>{{item.title}}{{item.type == 5 ? '（多选）' : ''}}</p>
      <!-- 简答题（10个字） -->
      <van-field
        v-if="item.type === 1"
        readonly 
        v-model="item.answers"
        class="myInput"
      />
      <!-- 简答题（50个字） -->
      <van-field
        v-if="item.type === 2"
        readonly
        v-model="item.answers"
        type="textarea"
        class="text"
      />
      <!--手机号  -->
      <van-field
        v-if="item.type === 3" 
        v-model="item.answers" 
        readonly
      />
      <!-- 单选 -->
      <van-radio-group v-if="item.type === 4" v-model="item.answers" >
        <van-cell-group>  
          <van-cell
            v-for="option in item.options"
            :key="option.item"
          >
            <span>{{option.item}}.&emsp;{{option.val}}</span>
            <van-radio disabled slot="right-icon" :name="option.item" class="marginLeft" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <!-- 多选题 -->
      <van-checkbox-group v-if="item.type === 5" v-model="item.answers">
        <van-cell-group>
          <van-cell 
          v-for="option in item.options"
          :key="option.item"
          >
            <span class="titleName">{{option.item}}.&emsp;{{option.val}}</span>
            <van-checkbox
              :name="option.item"
              disabled
              ref="checkboxes"
              slot="right-icon"
              class="marginLeft"
            />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <!-- 图片（单张） -->
      <van-image
        v-if="item.type === 6"
        width="80"
        height="80"
        class="img"
        :src= dealImg(item.answers)
      />
      <!-- 图片（不超过3张） -->
      <div v-if="item.type === 7">
        <van-image
          v-for="(img, index) in item.answers"
          :key='index'
          width="80"
          height="80"
          :src="dealImg(img)"
          class="img"
        />
      </div>
      <!-- 身份证号 -->
      <van-field
        v-if="item.type === 8" 
        v-model="item.answers"
        readonly
      />
      <!-- 日期与时间 -->
      <van-field
        v-if="item.type === 9"
        :value="item.answers" 
        readonly
      />
    </div>
    <div v-if="status == 0" :class="isHide ? 'hide' : 'btnBox'">
      <van-button plain round block type="danger" @click="del">删除</van-button>
    </div>
  </div>
</template>

<script>
import { applyDetail, delRecord } from "../api/request";

import { getQueryString, applyType, dealImg } from "../util/util";
import { Toast } from "vant";
export default {
  data() {
    return {
      questList: [], //详情列表
      applyId:'',
      isHide: true, //隐藏
      title: "",
      remark: "",
      userInfo:{},
      status:'',
      reason:'',
      reasonImgs:[],
    };
  },
  async created() {
    this.dealImg = dealImg

    let applyId = getQueryString("id")
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    this.userInfo = userInfo
    this.applyId = applyId
    let params = {
      "schoolId": userInfo.id,
      "telephone": userInfo.tel,
      "applyId": applyId,
    }
    let res = await applyDetail(params)
    if(res.success){
      res.detail.questionList && res.detail.questionList.map(item =>{
        if(item.type === 5 || item.type === 7){
          item.answers = item.answers.split(",")
        }
      })
      this.title = res.detail.title
      this.status = res.detail.status
      this.remark = res.detail.remark
      this.reason = res.detail.reason
      this.reasonImgs = res.detail.imgs
      this.questList = res.detail.questionList
      this.isHide = false;
    }
  },
  methods: {
    
    // 删除
    del() {
      let params = {
        "schoolId":this.userInfo.id,
        "telephone":this.userInfo.tel,
        "applyId": this.applyId,
      }
      console.log({params});
      delRecord(params).then(res => {
        if(res.success){
          Toast.success('删除成功')
          .then(() => {
            this.$router.push({path:"/apply-list"})
          })
        }
      })
    }
  },
  filters:{
    applyStatus(type){
      return applyType(type)
    },
  }
};
</script>

<style lang="less" scope>
.auditDetail {
  font-size: 0.8rem;
  padding-top: .625rem;
  .status {
    background-color: #EBFFD5;
    color:#95938F;
    padding:10px 15px;
    margin-bottom: 10px;
    h2{
      font-weight: normal;
      margin-bottom: 5px;
    }
  }
  .hide{
    display: none;
  }
  .typeName{
    background-color: #fff;
    padding:10px 15px;
    margin-bottom: 10px;
    .remark{
      color:#b5b3b3;
      font-size: .75rem;
      margin-top: 15px;
    }
  }
  .question {
    .title {
      margin: 0.8rem 0;
      text-indent: 0.8rem;
    }
  }
  .img{
    margin:0 10px;
  }
  .btnBox {
    padding:1rem 2rem;
    button{
      border-radius: 4px;
    }
  }
}

</style>
