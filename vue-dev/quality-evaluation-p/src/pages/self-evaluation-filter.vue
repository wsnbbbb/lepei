<template>
    <div>
      <div class="class-name-div" v-on:click.stop="openPicker">
        {{className}}
        <span></span>
      </div>
      <div class="person-box">
        <ul>
          <li v-for="list in personList" v-bind:id="list.personId" v-on:click.stop="openUrl(list.personId)" >
            <img src="../assets/b9.png" alt="" v-show="list.status==1">
            {{list.name}}
          </li>
          
        </ul>
          <div class="no-data-tip" v-show="personList.length==0">
          暂无数据！
        </div>
      </div>
      <vue-pickers :show="show1"
        :selectData="pickData1"
        v-on:cancel="close"
        v-on:confirm="confirmFn">
      </vue-pickers>
      <div class="picker-mask" v-show="showMask" @touchmove.prevent></div>
      <span class="filter-btn" v-on:click="toggle">筛选</span>
      <div class="filter-mask"  @touchmove.prevent v-show="isShowMask" v-bind:class="{ showFilter: isShowFilter }">
          <div class="filter-box" >
            <p class="fb-title">姓名筛选</p>
            <div class="fb-input-box">
              <span></span>
              <input type="text" placeholder="请输入学生姓名" ref="searchinput" v-model="studentName">
            </div>
            <p class="fb-status">评价状态</p>
            <div class="fbs-box">
              <span v-bind:class="{ active: status==-1 }" v-on:click.stop="setStatus(-1)">全部</span>
              <span v-bind:class="{ active: status==1 }" v-on:click.stop="setStatus(1)">已评价</span>
              <span v-bind:class="{ active: status==0 }" v-on:click.stop="setStatus(0)">未评价</span>
            </div>
            <div class="f-btn-box">
                <a href="javascript:;" class="btn-cancel" v-on:click.stop="toggle">取消</a>
                <a href="javascript:;" class="btn-comfirm" v-on:click.stop="filterData">确定</a>
            </div>
          </div>
      </div>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
import VuePickers from 'vue-pickers'
export default {
    name: 'index',
    components: {
      loading,
      VuePickers
    },
    data() {
        return {
           show1:false,
           showMask:false,
           className:"",
           classId:"",
           studentName:"",
           isShowFilter:false,
           isShowMask:false,
           status:-1,
           personList:[],
           pickData1: {
            columns: 1, // picker的列数
            default: [
             
            ], // 默认显示哪个
            // 第一列的数据结构
            data1: []
          },
          user: {}
        }
    },
    mounted(){
  
        window.postCurrentCardId=this.postCurrentCardId;
        window.postBaseInfo=this.postBaseInfo;
        if(this.isiOS()){
          window.webkit.messageHandlers.getBaseInfo.postMessage(null);
          window.webkit.messageHandlers.getCurrentCardId.postMessage(null);
        }else{
          this.user.uid = JSON.parse(window.app.publicParameters())["uid"]
          this.user.token = JSON.parse(window.app.publicParameters())["token"]
          this.user.personId = window.app.getCurrentCardId()
        }
        var timer = setInterval(() => {
            if(this.user.uid&&this.user.token&&this.user.personId){
              this.getClassList();
              window.clearInterval(timer)
            }
        }, 100);
        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(true);
        }else{
            window.app.showRightToolBar(true);
        }
        window.toggle=this.toggle;
    },
    beforeCreate(){

    },
    methods:{

        getClassList(){
            axios.post(baseUrl+'/teacher/quality-valuation/comment-class-list', JSON.stringify({
                uid: this.user.uid,
                token: this.user.token,
                personId: this.user.personId
            }))
            .then(function (response) {
                this.showLoading=false;
                console.log(response);
                if(response.data.success){
                  let pickerArr=[];
                  this.className=response.data.detail[0].className;
                  this.classId=response.data.detail[0].classId;
                  for(let i=0;i<response.data.detail.length;i++){
                    pickerArr.push({
                        "text":response.data.detail[i].className,
                        "value":response.data.detail[i].classId
                      })
                  }
                  this.pickData1.data1=pickerArr;
                  this.init(1,-1,this.classId);
                }else{
                    this.$toast(response.data.description, {
                    durtaion: 200,
                    location: 'center' // 默认在中间
                        });
                    }
            }.bind(this))
            .catch(function (response) {
              console.log(response);
            });

        },
        isiOS(){
          var u = navigator.userAgent, app = navigator.appVersion;
          var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //如果输出结果是true就判定是android终端或者uc浏览器
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //根据输出结果true或者false来判断ios终端
          if(isAndroid){
            return false
          }else if(isiOS){
            return true
          }
        },
        postBaseInfo(result){       
          this.user.uid = JSON.parse(result)["uid"]
          this.user.token = JSON.parse(result)["token"]
        },
        postCurrentCardId(result){
          this.user.personId = result
        },
        init(type,status,classId){
            axios.post(baseUrl+'/teacher/quality-valuation/get-student', JSON.stringify({
                        uid: this.user.uid,
                        token: this.user.token,
                        personId: this.user.personId,
                        type:type, //1自我 2家长 3教师
                        name:'',
                        status:status, //1已完成 0未完成 -1全部
                        classId:classId
                    }))
                    .then(function (response) {
                        // this.showLoading=false;
                        console.log(response);
                        if(response.data.success){
                         this.personList=response.data.detail;

                        }else{
                            this.$toast(response.data.description, {
                              durtaion: 200,
                              location: 'center' // 默认在中间
                            });
                        }
                    }.bind(this))
                    .catch(function (response) {
                      console.log(response);
                    });
        },

        close() {
           this.show1=false;
           this.showMask=false;
        },
        confirmFn(data){
            console.log(data);
            this.className=data.select1.text;
            this.classId=data.select1.value;
            this.show1=false;
            this.showMask=false;
            // this.pickData1.default=[{
            //   "text":data.select1.text,
            //   "value":data.select1.value
            // }]
            this.init(1,-1,this.classId);
        },
        openPicker(){
            this.showMask=true;
            this.show1=true;
        },
        openUrl(studentId){
         sessionStorage.setItem("studentId",studentId);
         this.$router.push({ path: "self-evaluation"});
        },
        toggle(){
          this.isShowFilter=!this.isShowFilter;
          this.isShowMask=!this.isShowMask;
          this.status=-1;
          this.studentName="";
          this.$refs.searchinput.blur();
        },
        setStatus(status){
          this.status=status;
        },
        filterData(){
            axios.post(baseUrl+'/teacher/quality-valuation/get-student', JSON.stringify({
                        uid: this.user.uid,
                        token: this.user.token,
                        personId: this.user.personId,
                        type: 1, //1自我 2家长 3教师
                        name: this.studentName,
                        status: this.status, //1已完成 0未完成 -1全部
                        classId: this.classId
                    }))
                    .then(function (response) {
                        // this.showLoading=false;
                        console.log(response);
                        if(response.data.success){
                         this.personList=response.data.detail;

                        }else{
                            this.$toast(response.data.description, {
                              durtaion: 200,
                              location: 'center' // 默认在中间
                            });
                        }
                    }.bind(this))
                    .catch(function (response) {
                      console.log(response);
                    });
            this.toggle();
        }
       
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

*{
  margin: 0;
  padding: 0;
}
ul,li{
  list-style: none;
}
.class-name-div{
  height: 0.78rem;
  line-height: 0.78rem;
  background-color: #eeeeee;
  color: #3492e9;
  font-size: 0.26rem;
  /*margin-top: 0.1rem;*/
  /*box-sizing: border-box;*/
  position: relative;
  padding-left: 0.3rem;
}
.class-name-div>span{
  width:0.13rem;
  height: 0.2rem;
  display: block;
  position: absolute;
  right: 0.3rem;
  top: 50%;
  margin-top: -0.1rem;
  background-image: url(../assets/b7.png);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.picker-mask{
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;

}
.person-box>ul>li{
  float: left;
  width: 25%;
  font-size: 0.24rem;
  color: #626262;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  border-right: 1px solid #d9d9d9;
  /*border-left: 1px solid #d9d9d9;*/
  position: relative;
  margin-top: 1px;
}
.person-box>ul>li>img{
  position: absolute;
  height: 0.65rem;
  width: 0.65rem;
  display: block;
  left: 0;
  top: 0;
  z-index: 999;
}
.person-box>ul>li:nth-child(4n+0){
  border-right: none;
}
.filter-btn{
  position: fixed;
  bottom: 0.2rem;
  left: 0.2rem;
  z-index: 99999;
  font-size: 0.16rem;
}
.filter-mask{
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.filter-box{
  width: 5.5rem;
  height: 100%;
  position: absolute;
  right: -5.5rem;
  top: 0;
  background-color: #fff;
  transition: 0.2s;
}
.fb-title{
  font-size: 0.26rem;
  color: #565656;
  padding: 0.4rem 0.2rem;
}
.fb-input-box{
  width: 5.1rem;
  height: 0.6rem;
  background: #eeeeee;
  margin: 0 auto;
  position: relative;
  border-radius: 0.08rem;

}
.fb-input-box>span{
  display: block;
  position: absolute;
  width: 0.29rem;
  height: 0.31rem;
  background-image: url(../assets/icon-search.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  left: 0.3rem;
  top: 50%;
  margin-top: -0.155rem;
}
.fb-input-box>input{
  position: absolute;
  left: 0.9rem;
  width: 4rem;
  height: 0.4rem;
  line-height: 0.4rem;
  outline: none;
  -webkit-appearance: none;
  border-radius: 0;
  border:none;
  top: 50%;
  margin-top: -0.2rem;
  background: transparent;
  font-size: 0.28rem;
  color: #a1a1a1;
}
.fb-status{
    font-size: 0.26rem;
  color: #565656;
  padding: 0.4rem 0.2rem;
}
.fbs-box{
  display: flex;
  justify-content: space-around;
  padding: 0 0.1rem;
}
.fbs-box>span{
  /*float: left;*/
  width: 1.6rem;
  height: 0.6rem;
  background: #eeeeee;
  font-size: 0.24rem;
  text-align: center;
  line-height: 0.6rem;
  color: #626262;
  border-radius: 0.06rem;
  box-sizing: border-box;
}
.fbs-box>span.active{
  border: 1px solid #53b6e0;
  background: #fff;
  background-image: url(../assets/select-bg.png);
  background-repeat: no-repeat;
  background-size: 0.37rem 0.38rem;
  background-position: 100% 100%;
}
.f-btn-box{
  display: flex;
  justify-content: space-around;
  margin-top: 6.0rem;
}
.f-btn-box>a{
  width: 2.1rem;
  height: 0.84rem;
  display: block;
  text-align: center;
  line-height: 0.84rem;
  font-size: 0.3rem;
  text-decoration: none;

  border-radius: 0.08rem;
  box-sizing: border-box;
}
.btn-cancel{
  background: #f4f4f4;
  border: 1px solid #e4e4e4;
  color: #777777;
}
.btn-comfirm{
  background-color: #4fc2f3;
  color: #fff;
}
.showFilter>.filter-box{
  right: 0rem;
  transition: 0.2s;
}
.no-data-tip{
  font-size: 0.32rem;
  margin-top: 2rem;
  text-align: center;
  color: #7b7b7b;
}
</style>
