<template>
  <div class="help-punch-card">
    <div class="dropdown">
      <van-notice-bar text="批量代打卡，仅支持已有打卡记录的人员，无法批量打卡的人员，请预先登录学生账号，请填写基础信息，并完成一次打卡" left-icon="volume-o" />
      <van-dropdown-menu>
        <van-dropdown-item v-model="classId" :options="option1" @change='changeOption1'/>
        <van-dropdown-item v-model="status" :options="option2" @change="changeOption2"/>
      </van-dropdown-menu>
    </div>
    <div class="list">
      <van-cell 
        class="list-title"
        title="姓名"  
        value="打卡状态" 
      />
      <div class="list-detail" v-for="item in list" :key="item.personId" >
        <van-checkbox-group class="left" v-model="result" >
          <van-cell-group >
            <van-cell
              :title="item.name"
              clickable
            >
              <template #title>
                <span class="name">{{item.name}}</span>
                <van-notice-bar class="ft12" v-if="item.status == 2" color="#fff" background="#FF7100" style="width:60px" text="不支持批量"/>
                <van-notice-bar class="ft12" v-if="item.status == 1" color="#fff" background="#FF0000" text="请登录学生账号，完成基础信息"/>
              </template>
              <template #icon>
                <van-checkbox 
                  :disabled="item.status == 3 ? false : true"
                  :name="item.personId"
                  @click="choose(item.personId,item.status)" 
                  ref="checkboxes" 
                  />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
        <van-swipe-cell class="right">
          <van-cell
            clickable
            :is-link="item.status == 4 ? false : true"
            :class="item.status !=4 ? 'van-red' : '' "
            :value="item.status == 4 ? '已打卡':'未打卡'" 
            @click="toSignInfo(item.status,item.personId)"
          />
          <template #right v-if="item.status == 4">
            <van-button
              @click="del(item.personId)"
              square
              text="删除"
              type="danger"
            />
          </template>
        </van-swipe-cell>
      </div>
      
    </div>
    <div class="footer">
      <div>
        <van-checkbox 
        v-model="AllChecked"
        @click="checkAll"
        :disabled="choice"
        >全选</van-checkbox>
      </div>
      <div>已选择（<span>{{selectedNum}}</span>/<span>{{total}}</span>）</div>
      <div class="btn"><van-button @click="agentPunchCard" round type="info" :disabled="selectedNum == 0">批量代打卡</van-button></div>
    </div>

    <van-overlay :show="fastClock" @click="cancel">
      <div class="modal">
        <div class="content" @click.stop>
          <div class="title-img"><img src="../assets/imgs/modal-img.png" alt=""></div> 
          <div>
            <van-cell  title="今日体温" is-link @click="showTemperature = true" :value="currentTemperture" />
          </div>
          <div class="changeClock">
            <button :class="{bgColor:changeColor == 1}"  @click="fastPunchCard(1)">信息无变更，快速打卡</button>
            <button v-if="isBatch == true" :class="{bgColor:changeColor == 2}" style="marginTop:20px"  @click="fastPunchCard(2)">信息变更，新建打卡</button>
          </div>
        </div>
      </div>
    </van-overlay>
    <van-popup
      v-model="showTemperature"
      position="bottom"
      :style="{ height: '40%' }">
      <van-picker :columns="temperatures"
        :default-index="30" 
        show-toolbar
        title="选择温度"
        @cancel="showTemperature = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { agentStudentList,agentPunchCard,agentDelete } from '../api/request'
import { Dialog, Toast, Loading } from 'vant';
import { getFormatDate } from '../util/util'
  export default {
    inject:['reload'],
    data(){
      return {
        personId:'',
        token:'',
        list: [],
        result:[],
        selectedData: [],
        classId:'',
        status:'0',
        option1: [],
        option2: [
          { text: '全部', value: '0' },
          { text: '已打卡', value: '1' },
          { text: '未打卡', value: '2' },
        ],
        dataList:{},
        newErr:[],
        AllChecked:false,
        fastClock:false, 
        showTemperature: false,
        temperatures: [ '34.0', '34.1', '34.2', '34.3', '34.4', '34.5', '34.6', '34.7', '34.8', '34.9', '35.0', 
        '35.1', '35.2', '35.3', '35.4', '35.5', '35.6', '35.7', '35.8', '35.9', '36.0', '36.1', '36.2', '36.3', 
        '36.4', '36.5', '36.6', '36.7', '36.8', '36.9', '37.0', '37.1', '37.2', '37.3', '37.4', '37.5', '37.6', 
        '37.7', '37.8', '37.9', '38.0', '38.1', '38.2', '38.3', '38.4', '38.5', '38.6', '38.7', '38.8', '38.9',
        '39.0', '39.1', '39.2', '39.3', '39.4', '39.5', '39.6', '39.7', '39.8', '39.9', '40.0', '40.1', '40.2',
        '40.3', '40.4', '40.5', '40.6', '40.7', '40.8', '40.9', '41.0', '41.1', '41.2', '41.3', '41.4', '41.5',
        '41.6', '41.7', '41.8', '41.9', '42.0'
        ],
        currentTemperture: '请选择',
        total:0,
        selectedNum:0,
        choice:false,
        changeColor:1,
        studentId:'',
        studentIds:[],
        isBatch:false,
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
      this.option1 = arr
      this.classId = arr[0].value
      this.agentStudentList()
    },
    methods:{
      //数组删除
      remove(arr, val) {
        var index = arr.indexOf(val);
        if (index > -1) {
          arr.splice(index, 1);
        }
      },
      // 取消弹框
      cancel () {
        this.fastClock = false;
        this.currentTemperture = '请选择'
        this.studentIds = [],
        this.studentId = '',
        this.isBatch = false
      },
      // 代打卡学生列表
      agentStudentList() {
        let params = {
          "personId":this.personId,
          "token":this.token,
          "classId":this.classId,
          "status":this.status,
        }
        // console.log(params);
        agentStudentList(params).then(res =>{
          if(res.success){
            let choosable = res.detail.filter(item =>{
              return item.status == 3;
            })
            // console.log(choosable.length);
            
            if(choosable.length == 0){
              this.choice = true
            }else{
              this.choice = false
              this.newErr = choosable
            }
            this.selectedData = [];
            this.result = [];
            this.AllChecked = false;
            this.selectedNum = 0;
            this.list = res.detail
            this.total = res.detail.length
          }else {
            Toast.fail(res.description)
          }
        })
      },

      // 班级选择
      changeOption1 (value) {
        this.classId = value
        this.agentStudentList()
      },
      changeOption2 (value) {
        this.status = value
        this.agentStudentList()
      },

      // 打卡
      toSignInfo(status,id) { 
        if(status == 1){
          Toast.fail("请登录学生账号，完成基础信息")
        }else if(status == 2){
          // 跳转打卡页面
          this.$router.push({path:"/sign-info",query:{studentId:id}})
        }else if(status == 3){
          this.fastClock = true;
          this.studentId = id
          this.studentIds.push(id)
          this.isBatch = true
          console.log(this.studentIds);
          
        }else{
          return
        }
      },

      // 删除
      del(id) {
        let _this = this
        Dialog.confirm({
            message: '确定删除吗？'
          }).then(() => {
            let parmas = {
              "personId": _this.personId,
              "token": _this.token,
              "studentId": id
            }
            agentDelete(parmas).then(res =>{
              if(res.success){
                 this.$toast("删除成功!")
                 setTimeout(() =>{
                  //  this.reload()
                  this.agentStudentList()
                 },1000)
              }else{
                Toast(res.description);
              }
            }).catch(()=>{
            })
          }).catch(() =>{
        })
      },

      // 单选
      choose(id,status) {
        if(status == 3){
          if(this.selectedData.indexOf(id) > -1){
            this.remove(this.selectedData, id);
          }else{
            this.selectedData.push(id);
          }
          if(this.selectedData.length < this.newErr.length){
            this.AllChecked = false;
          }else{
            this.AllChecked = true;
          }
           this.selectedNum = this.selectedData.length
        }else{
          return
        }
        // console.log(this.selectedData);
      },

      // 全选
      checkAll() {
        if(this.choice == false){
          if (this.AllChecked) {
            this.newErr.forEach(element => {
              element.isChecked = false;
            });
            this.selectedData = [];
            this.result = [];
            this.selectedNum = 0;
          } else {
            this.newErr.forEach(item => {
              item.isChecked = true;
              if (this.selectedData.indexOf(item.personId) < 0) {
                this.selectedData.push(item.personId);
                this.result.push(item.personId);
              }
            });
            this.selectedNum = this.newErr.length
          }
        }
      },
      
      // 批量代打卡
      agentPunchCard () {
        this.fastClock = true;
      },

      // 快速打卡
      fastPunchCard (type) {
        this.changeColor = type;
        if(type == 1){
          if(parseFloat(this.currentTemperture).toString() == "NaN"){
            this.$toast("请选择体温")
            return
          }
          let temperatureState
          if(this.currentTemperture <= 37.3){
              temperatureState = 1
          }else if(this.currentTemperture>37.3 && this.currentTemperture < 38.5){
              temperatureState = 2
          }else if(this.currentTemperture >= 38.5){
              temperatureState = 3
          }
          let params = {
            "personId" : this.personId,
            "token" : this.token,
            "temperatureState" : temperatureState,
            "temperature" : this.currentTemperture,
            "studentIds" : this.studentIds.length!=0?this.studentIds:this.selectedData,
          }
          console.log("11",this.studentIds);
          console.log("22",this.selectedData);
          agentPunchCard (params).then(res =>{
            if(res.success){
              this.$toast("快速打卡成功");
              setTimeout(() =>{
                this.fastClock = false;
                this.selectedData = [];
                this.result = [];
                this.selectedNum = 0;
                this.studentId = '';
                this.studentIds = [] ;
                this.isBatch = false;
                this.currentTemperture = '请选择'
                this.agentStudentList()
                // this.reload()
              },500)
            }else{
              this.$toast.fail(res.description)
            }
          })
        }else{
          this.$router.push({path:"/sign-info",query:{studentId:this.studentId}})
        }

      },

      onConfirm(value) {
        this.currentTemperture = value;
        this.showTemperature = false;
      },  
    
    },
    mounted() { 
    } 

  }
</script>

<style lang="less">
.help-punch-card{
  .ft12{
    font-size: 12px;
  }
  .dropdown{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    z-index: 99;
  }
  .list{
    margin: 5.625rem 0 2.5rem 0;
    .list-title{
      background-color: #F8F8F8;
      padding:10px 30px;
    }
    .list-detail{
      display: flex;
      justify-content: space-between;
      border-bottom:1px solid #fafafa;
      .van-red{
        .van-cell__value{
          color: red;
        }
      }
      .van-cell:not(:last-child)::after{
        border:none;
      }
      .van-hairline--top-bottom::after,.van-hairline--top-bottom::after{
        border:none;
      }
      .left{
        width:68%;
        .van-cell--clickable{
          height: 44px;
          padding: 0 0 0 16px;
          .van-cell__title{
            display: flex;
            .name{
              line-height: 2.75rem;
              margin:0 .625rem;
            }
            .van-notice-bar{
              text-align: center;
              width:6.25rem;
              height: 24px;
              margin: auto 0;
              border-radius: 16px;
              padding:0 10px;
            }
          }
        }
      }
      .right{
        width:32%;
        .van-cell__value--alone{
          text-align: right;
        }
      }
    }
  }
  .footer{
    width:100%;
    height:50px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left:0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    .btn{
      margin:0 20px;
      .van-button{
        height:38px;
        line-height: 38px;
      }
    }
  }
  .van-cell__value{
    color:#333;
  }
  .modal{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .content{
      width:90%;
      background-color: #fff;
      .title-img{
        width:100%;
        img{
          width:100%;
        }
      }
      .changeClock{
        margin:26px;
        text-align: center;
        button{
          width:100%;
          line-height: 44px;
          border:none;
          background-color: #fff;
          color:#1989FA;
          border-radius: 50px;
        }
        .bgColor{
          background-color: #1989FA;
          color:#fff;
        }
       
      }
    }
  }
  
}
</style>