<template>
  <div class="clock-type-list">
    <div class="dropdown">
      <van-dropdown-menu>
        <van-dropdown-item v-model="classId" :options="option1" @change='changeOption1'/>
        <van-dropdown-item v-model="status" :options="option2" @change="changeOption2"/>
      </van-dropdown-menu>
      <van-cell 
        class="list-title"
        :title="name"  
        value="打卡状态" 
      />
    </div>
    <div class="list">
      <van-cell 
        v-for="item in list" 
        :key="item.personId" 
        :class="item.status==1?'':'van-red'"
        :title="item.name"  
        :value="item.status==1?'已打卡':(item.status==2?'未打卡':'')" 
      />
      <div class="empty" v-if="count == 0">暂无数据</div>
    </div>
    <div class="button" >
      <van-button round type="info" block @click="showCalendar = true">历史打卡信息</van-button>
    </div>
    <van-popup
      v-model="showCalendar"
      position="bottom"
      :style="{ height: '50%' }"
      >
      <van-datetime-picker
        @cancel="showCalendar = false"
        @confirm="confirm"
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
   
  </div>
</template>

<script>
import { getClockList } from '../api/request'
import { Toast, Loading } from 'vant';
import { getFormatDate } from '../util/util'
  export default {
    data(){
      return {
        personId:'',
        token:'',
        list: [],
        classId:'',
        status:'0',
        option1: [],
        option2: [
          { text: '全部', value: '0' },
          { text: '已打卡', value: '1' },
          { text: '未打卡', value: '2' },
        ],
        showCalendar:false,
        minDate: new Date(1920, 0, 1),
        maxDate: new Date(),
        currentDate: new Date(),
        dataList:{},
        date:getFormatDate(),
        count:'',
        name:'姓名'
      }
    },
    async created() {
      let datas = JSON.parse(localStorage.getItem("detailList"))
      let list = JSON.parse(localStorage.getItem("clockTypeList"))
      if(datas){
        this.personId = datas.personId
        this.token = datas.token
      }
      let arr = []
      list && list.map(item =>{
        arr.push({
          text:item.className,
          value:item.classId,
        })
      })
      console.log(arr);
      
      this.option1 = arr
      this.classId = arr[0].value
      this.getClockList()
    },
    methods:{
      // 打卡详情列表
      getClockList() {
        let params = {
          "personId":this.personId,
          "token":this.token,
          "date":this.date,
          "classId":this.classId,
          "status":this.status,
        }
        console.log(params);
        getClockList(params).then(res =>{
          if(res.success){
            this.list = res.detail.list
            this.count = res.detail.count
            this.name = '姓名（' + res.detail.count + '人）'
          }else {
            Toast.fail(res.description)
          }
        })
      },
      // 班级选择
      changeOption1 (value) {
        this.classId = value
        this.getClockList()
      },
      changeOption2 (value) {
        this.status = value
        this.getClockList()
      },
      // 时间确认
      confirm(value){
        this.date = getFormatDate(value)
        this.getClockList()
        this.showCalendar = false
      },
     
    },
    mounted() { 
    } 

  }
</script>

<style lang="less">
.clock-type-list{
  .empty{
    text-align: center;
    height:2.5rem;
    line-height: 2.5rem;
  }
  .dropdown{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    z-index: 99;
    .list-title{
      background-color: #F8F8F8;
      padding:10px 16px;
    }
  }
  .list{
    margin: 5.625rem 0 2.5rem 0;
  }
  .van-cell__value{
    color:#333;
  }
  .van-red{
    .van-cell__value{
      color: red;
    }
  }
  .button{
    width:100%;
    background-color: #fff;
    position: fixed;
    left:0;
    bottom:0;
    padding: 5px 0;
    button{
      width:40%;
      margin:0 auto;
    }
  }
}
</style>