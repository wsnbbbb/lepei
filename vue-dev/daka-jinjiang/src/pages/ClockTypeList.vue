<template>
  <div class="clock-type-list">
    <div class="select">
      <!-- <treeselect 
        placeholder="请选择班级"
        :show-count="true"
        v-model="value"
        :options="options1" 
        /> -->
      <van-field
        clickable
        name="classes"
        :value="classes"
        placeholder="点击选择年级班级"
        input-align="right"
        is-link
        @click="showClass = true"
      />
      <van-dropdown-menu class="statuSlect">
        <van-dropdown-item v-model="status" :options="option" />
      </van-dropdown-menu>

    </div>
    <van-cell 
      v-for="item in list" 
      :key="item.personId" 
      :class="item.status==1?'':'van-red'"
      :title="item.name"  
      :value="item.status==1?'已打卡':(item.status==2?'未打卡':'')" 
    />
    <div class="btn-box" >
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
    <van-popup
      v-model="showClass"
      position="bottom"
      :style="{ height: '50%' }"
      >
      <van-picker 
      show-toolbar 
      :columns="columns" 
      @cancel="onCancel = false"
      @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getGradeClass,getClockList } from '../api/request'
import moment from 'moment'
import { Toast, Loading } from 'vant';
  export default {
    components: { Treeselect },
    data(){
      return {
        personId:'',
        token:'',
        list: [],
        classId:'',
        status:'0',
        columns: [],
        option: [
          { text: '全部', value: '0' },
          { text: '已打卡', value: '1' },
          { text: '未打卡', value: '2' },
        ],
        showCalendar:false,
        minDate: new Date(1920, 0, 1),
        maxDate: new Date(),
        currentDate: new Date(),
        showClass:false,
        dataList:{},
        classes:'',
        date:moment().format('YYYY-MM-DD'),
      }
    },
    async created() {
     let datas = JSON.parse(localStorage.getItem("detailList"))
     this.personId = datas.personId
     this.token = datas.token
     
    },
    methods:{
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
            this.list = res.detail
          }else {
            Toast.fail(res.description)
          }
        })
      },
      confirm(value){
        let date = moment(value).format('YYYY-MM-DD');
        this.date = date
        this.getClockList()
        this.showCalendar = false
      },
      onConfirm(value){
        console.log(value);
        this.dataList && this.dataList.gradeTypes.map(item =>{
          if(value[0] == item.name){
            this.dataList.grades.map(v =>{
              if(item.gradeType == v.gradeType){
                this.dataList.classes.map(j =>{
                  if(v.gradeId == j.gradeId){
                    this.classId = j.classId
                    console.log(j.classId);
                    
                  }
                })
              }
            })
          }
        })
        this.classes = value[0] + value[1] + value[2]
        this.showClass = false
      },
      async getGradeClass() {
        let res = await getGradeClass({"personId":this.personId,"token":this.token,})
        if(res.success){
            this.dataList = res.detail
            let gradeType = '';
            let grade = '';
            let classes = '';
            let arr =[]
            res.detail.gradeTypes.map(item =>{
              let arr1 = []
              arr.push({
                id:item.gradeType,   
                text:item.name,
                children:arr1
              })
              gradeType = arr[0].text
              res.detail.grades.map(v =>{
                let arr2 = []
                if(item.gradeType == v.gradeType){
                  arr1.push({
                    id:v.gradeId,
                    text:v.name,
                    children:arr2
                  })
                   grade = arr1[0].text
                }
                res.detail.classes.map(j =>{
                  if(v.gradeId == j.gradeId){
                    arr2.push({
                      id:j.classId,
                      text:j.name,
                    })
                     classes = arr2[0].text
                     this.classId = arr2[0].id
                  }
                })
              })
            })
            this.columns = arr
            this.classes = gradeType + grade + classes
            this.getClockList()
        }else{
          Toast.fail(res.description)
        }
      }
      
    },
    mounted() { 
      this.getGradeClass()
    } 

  }
</script>

<style lang="less">
.clock-type-list{
  .select{
    display: flex;
    justify-content: space-around;
    text-align: center;
    padding: 0 20px 0 10px;
    .van-cell--clickable{
      width:12.5rem;
    }
    .vue-treeselect{
      line-height: 3.125rem;
      .vue-treeselect__control{
        width:13.125rem;
        border:none;
      }
      .vue-treeselect__control-arrow{
        color:#444;
      }
    }
    .statuSlect{
      width:40%;
    }
  }
  .cellTitle{
    background-color:#F8F8F8;
    border:none;
  }
  .van-cell__value{
    color:#333;
  }
  .van-red{
    .van-cell__value{
      color: red;
    }
  }
  .btn-box{
    width:100%;
    // text-align: center;
    position: fixed;
    left:0;
    bottom:15px;
    button{
      width:40%;
      margin:0 auto;
    }
  }
}
</style>