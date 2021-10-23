<template>
    <div class="list-wrap">
       

       <!-- <section>add</section> -->
       <ul class="menu-title" >
            <li class="on1" v-for="item in categoryList" v-bind:id="item.id" v-bind:class="{ on: isActive==item.id }" v-on:click.stop="getList(item.id)"> 
                <!-- <img src="../assets/icon-ruler.png" alt=""> -->
              {{item.catName}}
            </li>
                

        </ul>
        <div class="menu-cont">
                <div>
                    
                
                <div class="floor" v-for="(item,index) in list" v-bind:propertyId="item.propertyId">
                    <p class="floor-name">{{item.propertyName}}</p>
                    <p class="floor-spec">
                        单位：{{item.unit}}
                     </p>
                   <p class="floor-stock">
                      库存：{{item.num}}
                   </p>
                    <p class="floor-tip">
                      {{item.specification}}
                   </p>
                   <div class="number-box clearfix">
                        <a href="javascript:;" class="number-box-minus" v-on:click="minus(index,item.propertyId,item.number,item.propertyName)" v-show="item.number>0">
                            <img src="../assets/icon-minus.png" alt="">
                            <!-- {{reversedMessage}} -->
                       </a>
                        <input type="text"  v-model="item.number" v-show="item.number>0" readonly="readonly" />

                       <a href="javascript:;"  class="number-box-add"  v-on:click="add(index,item.propertyId,item.number,item.propertyName)">
                            <img src="../assets/icon-add1.png" alt="">
                       </a>
                   </div>
                </div>
                </div>
            <section v-show="showTip" class="no-data-tip">
                   暂无数据
            </section>
          
        </div>

        <div class="bottom-box clearfix"  v-show="isHasItem">
                <a href="javascript:;" @touchmove.prevent class="box-left" v-on:click="showList()">物品明细</a>
                <a href="javascript:;" @touchmove.prevent class="box-right" v-on:click="openUrl()">确定</a>

                <ul class="box-menu " v-bind:class="{ hideMask: isHideMask }">
                    <li class="box-menu-list-top" @touchmove.prevent>
                        <a href="javascript:;" v-on:click="clearList()">
                            <img src="../assets/icon-del.png" alt="">
                          清空
                        </a>
                    </li>
                     <div class="floor-box" >
                        <li class="box-menu-list" v-for="(item,index) in idlist" v-show="item.number>0">
                            {{item.propertyName}}
                            <div class="number-box clearfix">
                                <a href="javascript:;" class="number-box-minus" v-bind:propertyId="item.propertyId" v-on:click="minus(index,item.propertyId,item.number,item.propertyName)" >
                                    <img src="../assets/icon-minus.png" alt="">
                                </a>
                                <input type="text"  v-model="item.number" readonly="readonly" />

                                <a href="javascript:;"  class="number-box-add" v-bind:propertyId="item.propertyId" v-on:click="add(index,item.propertyId,item.number,item.propertyName,item.num)">
                                    <img src="../assets/icon-add1.png" alt="">
                                </a>
                            </div>
                        </li>
                    </div>
                    
                </ul>

        </div>
           
        <div class="float-mask" @touchmove.prevent v-on:click="closeMask()" v-show="showMask&&isHasItem">
            
        </div>
       <loading v-show="showLoading"> </loading>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
export default {
    name: 'add',
    components: {
      loading
    },
    data() {
        return {
            showLoading:true,
            showMask:false,
            isHideMask:true,
            isActive:"",
            categoryList:[],
            list:[
                // {
                //     id:"1",
                //     name:"垃圾桶1",
                //     spec:"无",
                //     stock:2,
                //     tip:"一个人限购5件",
                //     number:1
                // },
             
                // {
                //     id:"1",
                //     name:"垃圾桶9",
                //     spec:"无",
                //     stock:2,
                //     tip:"一个人限购5件",
                //     number:1
                // }
            ],
            idlist:[],
            showTip:false,
            id: this.$route.params.id, //接收参数
            user: {}
        }
    },
    computed: {
        // a computed getter
        reversedMessage: function () {
          // `this` points to the vm instance
          return 555
            
        },
        isHasItem: function () {
           for(var index in this.idlist){  
                if(this.idlist[index].number>0){
                    return true;
                }
            }  
            return false;
        },
        submitList:function(){
            var submitlistItems=[];
            for(let i=0;i<this.idlist.length;i++){
                if(this.idlist[i].number>0){
                    submitlistItems.push({"propertyId":this.idlist[i].propertyId,"propertyName":this.idlist[i].propertyName,"applyNum":this.idlist[i].number})
                }
            }
            return submitlistItems;
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
            this.initData();;
            window.clearInterval(timer)
          }
        }, 100);

        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(false);
        }else{
            window.app.showRightToolBar(false);
        }
        window.addEventListener('scroll', this.handleScroll)


        function addEvent(){
            var titilArr=document.querySelectorAll(".menu-title li");
            var ContentArr=document.querySelectorAll(".menu-cont>div");    
            for(let i=0;i<titilArr.length;i++){
                     titilArr[i].onclick=function(){
                        // document.querySelectorAll(".floor")[i].offsetTop=0;
                         // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                         // console.log("8888");
                         // document.body.scrollTop=500;
                         // alert(i)
                         document.documentElement.scrollTop=200;
                         document.body.scrollTop=200;
                         // debugger;
                         // window.scrollTo(0,ContentArr[i].offsetTop);
                           // var hight=ContentArr[i].offsetTop;
                           // var index=i;
                           // var  scrollToptimer = setInterval(function () {
                           //      console.log("定时循环回到顶部")
                           //      var top = ContentArr[index].offsetTop;
                           //      var speed = parseInt(top / 4);
                           //      // debugger;
                           //      // if (document.body.scrollTop!=0) {
                           //      //     document.body.scrollTop -= speed;
                           //      // }else {
                           //          // document.documentElement.scrollTop -= speed;
                           //      // }
                           //      if (document.documentElement.scrollTop < top) {
                           //          // clearInterval(scrollToptimer);
                           //          document.documentElement.scrollTop += speed;
                           //      }else if(document.documentElement.scrollTop > top){
                           //          document.documentElement.scrollTop -= speed;
                           //      }else{
                           //          clearInterval(scrollToptimer);
                           //      }
                           //  }, 30); 
                           //  
                           //  clearInterval(timer);  
                           // var timer=setInterval(function(){  
                           //      var currentPos=document.documentElement.scrollTop || document.body.scrollTop, 
                           //      iSpeed=0;  
                                  
                           //      iSpeed=(ContentArr[index].offsetTop)/10;  
                           //      iSpeed=iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);  
                                  
                           //      if(ContentArr[index].offsetTop!=currentPos){  
                                      
                           //          window.scrollTo(0,currentPos+iSpeed);  
                           //          // document.documentElement.scrollTop=currentPos+iSpeed;
                           //      }  
                           //      else{  
                           //          clearInterval(timer);  
                           //      }  
                           //  },1);  

                     

                     }
            }
        }
        // addEvent();
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
        initData(){
            axios.post(baseUrl+'/teacher/material-claim/category', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                // id:this.id
                pid:"",
                
              }))
              .then(function (response) {
                console.log(response);
                // this.showLoading=false;
                this.categoryList=response.data.detail;
                // this.list=response.data.detail;
                console.log(this.list);
                this.getList(response.data.detail[0].id)
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },

        doThis(id){
            alert(id)

        },
        minus(index,id,number,propertyName){
               
                // this.list[index].number=parseInt(this.list[index].number)-1;
                // if(this.list[index].number<0){
                //      this.list[index].number=0;
                //  }
                //  console.log(id)
                //  console.log(number-1)
                for(let i=0;i<this.list.length;i++){
                    if(this.list[i].propertyId==id){
                        this.list[i].number=number-1;
                    }
                }

                for(let j=0;j<this.idlist.length;j++){
                    if(this.idlist[j].propertyId==id){
                        this.idlist[j].number=this.idlist[j].number-1;
                        return;
                    }
                }
        },
        add(index,id,number,propertyName,stock){
                // this.list[index].number=parseInt(this.list[index].number)+1;
                // if(this.list[index].number>this.list[index].num){
                //     this.list[index].number=this.list[index].num
                //      this.$toast("所选数量已达上限", {
                //             durtaion: 200,
                //             location: 'center' // 默认在中间
                //     });
                //      return;
                // }
                if(number==0){
                    this.closeMask();
                }
                for(let i=0;i<this.list.length;i++){
                    if(this.list[i].propertyId==id){
                        this.list[i].number=number+1;
                        if(stock==number+1){
                            this.$toast("所选数量已达上限", {
                                    durtaion: 200,
                                    location: 'center' // 默认在中间
                            }); 
                        }
                    }
                }



                for(let j=0;j<this.idlist.length;j++){
                    if(this.idlist[j].propertyId==id){
                        this.idlist[j].number=this.idlist[j].number+1;
                        return;
                    }
                }

                this.idlist.push({"propertyId":id,"number":number+1,"propertyName":propertyName})
                console.log( this.idlist)

        },
        closeMask(){
            this.showMask=false;
            this.isHideMask=true;
        },
        showList(){
            this.showMask=!this.showMask;
            this.isHideMask=!this.isHideMask;
        },
        clearList(){
            var _this=this;
            this.$confirm("确定清空已选物品？").then(
                function(){
                     for(var index in _this.list){  
                        _this.list[index].number=0;
                    };
                     for(var index in _this.idlist){  
                        _this.idlist[index].number=0;
                    };

                    _this.showMask=false;
                    _this.isHideMask=true;
                    _this.$toast("物品已清空", {
                            durtaion: 200,
                            location: 'center' // 默认在中间
                    });
                }
              ).catch(
                    function(){
                        console.log("no");
                        
                    }
                )
        },
           //跳转到详情页面，传递参数id
        openUrl(){
            this.$router.push({name:'submitlist',params: {list:this.submitList }})
        },
        handleScroll () {
         var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
         console.log(scrollTop)
         for(var j=0;j<document.querySelectorAll('.floor').length;j++){
             var offsetTop = document.querySelectorAll('.floor')[j].offsetTop
             if (scrollTop >= offsetTop) {
             // this.searchBarFixed = true
             // console.log("123")
             console.log("OK")
             for(var i=0;i<document.querySelectorAll(".menu-title>li").length;i++){
                document.querySelectorAll(".menu-title>li")[i].classList.remove("on");
             }
           
             document.querySelectorAll(".menu-title>li")[j].classList.add("on");
             } else {
             // this.searchBarFixed = false
              console.log("456")
             //    for(var i=0;i<document.querySelectorAll(".menu-title>li").length;i++){
             //    document.querySelectorAll(".menu-title>li")[0].classList.remove("on");
             // }
              // document.querySelectorAll(".menu-title>li")[j].classList.remove("on");
             }

         }
         
        },
        getList(id){
            this.isActive=id;
            this.showLoading=true;
             axios.post(baseUrl+'/teacher/material-claim/material-list', JSON.stringify({
                personId: this.user.personId,
                uid: this.user.uid,
                token:this.user.token,
                catId:id,
                page:1,
                pageSize:10000
                
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                // this.categoryList=response.data.detail;
                
                // this.idlist.push(id);

                for(let i=0;i< response.data.detail.length;i++){
                    response.data.detail[i].number=0;
                }

                if(response.data.detail.length>0){
                    this.showTip=false;
                }else{
                    this.showTip=true;
                }
                this.list=response.data.detail;

                for(let i=0;i<this.idlist.length;i++){
                    for(let j=0;j<this.list.length;j++){
                       if(this.idlist[i].propertyId==this.list[j].propertyId){
                        this.list[j].number=this.idlist[i].number;
                        } 
                    }
                }

                console.log(this.list);
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        }

    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .list-wrap{
      /*  height: 3rem;
        overflow: auto;*/
    }
    *{
    margin: 0;
    padding: 0;
    }
   ul,li{
    margin:0;
    padding: 0;
   }
   li{
    list-style:none;
   }
   .menu-title{
    position: fixed;
    left: 0;
    top:0;
    height: 100%;
    background:#e8edf7;
   }
.menu-title li{
    font-size: 0.28rem;
    height: 0.9rem;
    width: 2.46rem;
    line-height: 0.9rem;
    /*background: #fff;*/
    line-height: 0.9rem;
    position: relative;
    padding-left: 0.2rem;
    box-sizing: border-box;
    /*text-indent: 0.5rem;*/
    color: #626262;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.menu-title li span{
    color: red;
    width: 2rem;
    word-break: break-all;
    height: 0.9rem;
    overflow: hidden;
    display: inline-block;
}
      .menu-title li img{
        width:0.4rem;
        width:0.4rem;
        display: block;
        position: absolute;
        top:50%;
        margin-top: -0.2rem;

      }
    .menu-cont{
        margin-left: 2.46rem;
        display: block;
           background-color: #fff;
        margin-bottom: 1.0rem;
        height: 100%;
       overflow-y :yes;
    }
    .on{
        background: #fff;
        color: #4696db!important;
    }
     .floor{
        margin-left: 0.3rem;
        margin-right: 0.45rem;
        border-bottom: 1px solid #d5d5d5;
        position: relative;
     }
     .floor:last-child{
        border-bottom: none;
     }
    .floor p{
        font-size: 0.28rem; 
    }
    .floor-name{
        padding-top: 0.38rem;
        padding-bottom: 0.35rem;
    }
    .floor-spec {
        color: #7b7b7b;
    }
    .floor-stock{
        color: #7b7b7b;
        padding-top: 0.05rem;
        padding-bottom: 0.15rem;
    }
    .floor-tip{
         color: #b0b0b0;
         padding-bottom:  0.15rem;

    }
    .number-box{

    }
.number-box{
    display: inline-block;
    position: absolute;
    top:50%;
    margin-top: -0.25rem;
    right: 0;
}

.number-box a{
    width: 0.5rem;
    height: 0.5rem;
    display: block;
    float: left;
}
.number-box a img{
    width: 0.5rem;
    height: 0.5rem;
    display: block;
}
.number-box input{
    float: left;
    width:0.6rem;
    outline: none;
    -webkit-appearance: none;
    border-radius: 0;
    background:none;    
    outline:none;    
    border:0px;  
    height: 0.5rem;
    text-align: center;
}
.clearfix:before,.clearfix:after {
              content: "";
              display: block;
              clear: both;
}
.clearfix {
      zoom: 1;
}

.bottom-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    z-index: 100;
}
.bottom-box a.box-left{
    height: 1.0rem;
    line-height: 1.0rem;
    display: inline-block;
    width:60%;
    float: left;
    background-color: #4fc2f3;
    color:#fff;
    font-size: 0.32rem;
    text-align: center;
    text-decoration: none;

}
.bottom-box a.box-right{
    height: 1.0rem;
    line-height: 1.0rem;
    display: inline-block;
    width:40%;
    float: left;
    background-color: #e2f1ff;
    color:#7b7b7b;
    font-size: 0.32rem;
    text-align: center;
    text-decoration: none;
    border:1px solid #bebebe;
    box-sizing: border-box;
}
.box-menu{
    position: absolute;
    left: 0;
    bottom: 1.0rem;
    padding: 0 0.2rem;
    padding-right: 0.45rem;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
}
.box-menu li{
    font-size: 0.3rem;
    height: 0.96rem;
    line-height: 0.96rem;
    border-top: 1px solid #cecece;
    color: #444444;
}
.box-menu .box-menu-list-top{
    border-top: none;
    height: 0.7rem;
    line-height: 0.7rem;
    text-align: right;
}
.box-menu .box-menu-list-top a{
    display: block;
    float: right;
    line-height: 0.7rem;
    position: relative;
    width: 1.0rem;
    font-size:0.28rem;
    text-decoration: none;
    color: #909090;
}
.box-menu .box-menu-list-top a>img{
    display: block;
    width: 0.22rem;
    height: 0.29rem;
    position: absolute;
    top:50%;
    margin-top: -0.145rem;
    left: 0.1rem;
}
.box-menu-list {
    position: relative;
}
.box-menu-list .number-box-minus{
    position: relative;
}
.box-menu-list .number-box-minus img{
    width:0.5rem;
    height: 0.5rem;
    display: block;
    float: left;
}
.box-menu-list .number-box-minus input{
  float: left;
    width: 0.6rem;
    outline: none;
    -webkit-appearance: none;
    border-radius: 0;
    background: none;
    outline: none;
    border: 0px;
    height: 0.5rem;
    text-align: center;
}
.float-mask{
    position: fixed;
    background: rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    left: 0;
    top:0;
    z-index: 99;
}
.hideMask{
    position: absolute;
    top:0;
    z-index: -1;
    transition: top 2s;
}
.floor-box{
    max-height:6rem;
    overflow :auto;
    position: relative;
}
.no-data-tip{
    text-align: center;
    padding-top: 5rem;
    background: #F5F5F9;
    font-size: 0.40rem;
}
.menu-cont>div:last-child{
    border-bottom: none;
}
</style>
