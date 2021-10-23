<template>
    <div class="list-wrap">
       <div class="list-item" v-for="item in list">
         <span class="item-name">{{item.propertyName}}</span>
         <span class="item-price">{{item.price}}
            <span v-show="item.price!=''">元</span>
         </span>
         <span class="item-number">{{item.applyNum}}{{item.propertyUnit}}</span>
       </div>
      
       <section class="btn-box1" v-show="!((!!list)&&list.length!=0)">
         还没有物品，<span class="add-list" v-on:click="addList">点此添加</span>
       </section>
      <section class="btn-box" v-show="(!!list)&&list.length!=0">
        <a href="javascript:;" v-on:click.stop="apply">提交</a>
      </section>
       <div class="picker-mask" v-show="show"></div>
       <vue-pickers
            :show="show"
            :columns="columns"
            :defaultData="defaultData"
            :selectData="pickData"
            @cancel="close"
            @confirm="confirmFn">
       </vue-pickers>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import vuePickers from 'vue-pickers'
import {baseUrl} from '../config/env'
export default {
    name: 'add-goods',
    components: {
      loading,
      vuePickers
    },
    data() {
        return {
            showLoading:false,
            list:[],
            show: false,
            columns: 1,
            defaultData: [
              
            ],
            isShowChanel:false,
            pickData: {
                // 第一列的数据结构
              data1: [
                  // {
                  //   text: 1999,
                  //   value: 1999
                  // },
                  // {
                  //   text: 2001,
                  //   value: 2001
                  // }
              ]
            },
            user: {}
        }
    },
    computed: {
        // a computed getter
        reversedMessage: function () {
          // `this` points to the vm instance
          return 555
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

        if(sessionStorage.getItem("list")){
          this.show=false;
          this.isShowChanel=true;
          this.list=JSON.parse(sessionStorage.getItem("list"))
        }else{
      
            var timer = setInterval(() => {
              if(this.user.uid&&this.user.token&&this.user.personId){
                this.channel();
                window.clearInterval(timer)
              }
            }, 100);
         
        }
        
        window.toggle=this.addList;

        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(true);
            window.webkit.messageHandlers.setToolBarRight.postMessage({title:"添加", type: 2});
            window.webkit.messageHandlers.setToolBarTitle.postMessage("添加物品");
        }else{
            window.app.showRightToolBar(true);
            window.app.setToolBarRight("添加", 2)  //1 筛选 2 加号
            window.app.setToolBarTitle("添加物品")
        }


    },
    methods:{
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
        close() {
          this.show = false
        },
        confirmFn(val) {
          this.show = false
          this.defaultData = [val.select1]
          console.log(val.select1.value)
          sessionStorage.setItem("channelId", val.select1.value)
        },
        toShow() {
          this.show = true
        },
        channel(){
             axios.post(baseUrl+'/teacher/material-purchase/channel', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token: this.user.token,
              }))
              .then(function (response) {
                this.isShowChanel=true;
                let pickerArr=[];
                for(let i=0;i<response.data.detail.length;i++){
                    pickerArr.push(
                        {"text":response.data.detail[i].name,"value":response.data.detail[i].channelId}
                    ) 
                }
                this.pickData.data1=pickerArr;
                if(pickerArr.length==0){
                  sessionStorage.setItem("channelId", 0)
                }else{
                  this.toShow();
                }
                
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },
        apply(){

            if((!this.isNull(this.propertyName))&&(!this.isNull(this.inpNum))&&(!this.isNull(this.specification))){
              this.showLoading=true;
                axios.post(baseUrl+'/teacher/material-purchase/apply', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                propertyMaterial:JSON.parse(sessionStorage.getItem("list")),
                channelId:sessionStorage.getItem("channelId")
              }))
              .then(function (response) {
                this.showLoading=false;
                if(response.data.success){
                  this.$alert(
                        {
                            title: '',
                            content: "提交成功",
                        }).then(
                          function(){
                            console.log("ok")
                            window.history.go(-1);
                            sessionStorage.setItem("list",[]);
                            this.list=[];
                            // window.history.go(-1);
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );

                }else{
                  this.$alert(
                        {
                            title: '',
                            content: response.data.description,
                        }).then(
                          function(){
                            console.log("ok")
                            // window.history.go(-1);
                          }
                        ).catch(
                          function(){
                            console.log('点了取消')
                          }
                       );
                }
                
              }.bind(this))
              .catch(function (response) {
              
              });
            }else{
                this.$toast("请输入必填项", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                });
            }
            
        },
        addList(){
          if(this.isShowChanel==false){
              this.$toast("数据获取中，请稍后...", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
              });
             return;
          }
        
          if(this.show==true){
             this.$toast("请选择通道", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
            });
             return;
          }
          this.$router.push({name:'addGoods'})
        }, 
        isNull( str ){
          if ( str == "" ) return true;
          var regu = "^[ ]+$";
          var re = new RegExp(regu);
          return re.test(str);
        },

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
margin:0;
padding: 0;
}
input, button, select, textarea {
outline: none;
-webkit-appearance: none;
border-radius: 0;
}
.list-item{
  overflow: hidden;
  font-size:0.32rem;
  padding-left: 0.35rem;  
  padding-right: 0.35rem;
  background-color: #fff;
  color: #626262;
  border-bottom: 1px solid #f5f5f9;
  padding: 0.25rem;
}

.list-item>span{
  width: 33.3%;
  float: left;
  word-break: break-all;
  min-height: 0.01rem;
}

.item-number{
  float: right;
}
.item-price{
  color: #9b9b9b;
  font-size: 0.28rem;
  padding: 0 0.2rem;
  box-sizing: border-box;
}
.item-number{
  color: #7b7b7b;
  font-size: 0.26rem;
  text-align: right;
}
.btn-box a{
  width: 6.6rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-align: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.32rem;
  background-color: #4fc2f3;
  display: block;
  border-radius: 0.08rem;
  margin: 2rem auto;
}
.btn-box1{
  font-size: 0.32rem;
  color: #7b7b7b;
  text-align: center;
  margin-top: 3rem;
}

.btn-box1>span{
  color:#4fc2f3;
  margin-top: 5rem;
}
.list-wrap{
  /*height: 500px;*/
}
.container{
  /*position: relative;*/
}
.picker-mask{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
    background: rgba(0,0,0,0.6);
}
</style>
