<template>
    <div class="list-wrap">
     <ul class="list">
          <li class="list-item" >
              <p class="item-name">
                  {{this.params.teacherName}}
              </p>
              <p class="item-time">
                    <img src="../assets/icon-time.png" alt="">
                    <span class="span-time">{{this.params.classTime}}</span>
                     <img src="../assets/icon-location.png" alt="">
                    <span class="span-time">{{this.params.teachingPlace}}</span>
              </p>
              <p class="item-title">
                   {{this.params.teachingTitle}}
              </p>
          </li>
      </ul>

      <section class="content">
        <div class="content-item" v-for="item in list">
            <p class="item-title">
             {{item.name}}
            </p>
            <ul>
              <li class="item-list" v-for="li in item.points">
                <p>{{li.title}}</p>
                <div class="drag-bar">
                   <div class="bar-total bar" id="bar">
                      <img src="../assets/icon-bar.png" alt="" class="block" v-bind:pointId="li.pointId"/>
                   </div>
                   <span>
                      <span>{{li.score<0?"0.0":li.score}}</span>
                   / {{li.totalScore}}分</span>
                </div>
              </li>
            </ul>
        </div>
      </section>

      <section class="comment-box">
        <div class="comment-div">
          <textarea name="" id=""  maxlength="200" @input="descInput" v-model="desc"></textarea>
          <p>
            <span>{{remnant}}</span>/不得少于50字
          </p>
        </div>
        <a href="javascript:;" class="submit-btn" v-on:click="submit()">提交</a>
      </section>

       <loading v-show="showLoading"> </loading>
       <div class="preview-list" @touchmove.prevent v-show="isShowPre">
          <ul>
            <li class="preview-list-li" v-for="item in attachList">
                <img src="../assets/icon-li.png" alt="" class="img-l">
                 <p>{{item.name}}</p>
                <img src="../assets/icon-pre.png" alt="" class="img-r" :id="item.url" v-on:click="previewAttach(item.url)">
            </li>
            <li class="preview-list-li" id="no-data-tip" v-show="attachList.length==0">
                暂无数据！
            </li>
            <li class="preview-list-li" v-on:click="toggle()">
                取消
            </li>
          </ul>
       </div>
    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,user} from '../config/env'
export default {
    name: 'rateSubmit',
    components: {
      loading
    },
    data() {
        return {
            showLoading:true,
            params:{},
            list:[],
            attachList:[],
            id: sessionStorage.getItem("id"),
            remnant: 0,
            desc:"",
            isShowPre:false
        }
    },
    computed: {
        // a computed getter
        scoreRecords(){
            let scoreRecords=[];
            for(let i=0;i<this.list.length;i++){  
                for(let j=0;j<this.list[i].points.length;j++){
                    if(this.list[i].points[j].score<=0){
                      this.list[i].points[j].score=0
                    }
                    scoreRecords.push({"pointId":parseInt(this.list[i].points[j].pointId),"score":Number(this.list[i].points[j].score)})
                  }
            }
            return scoreRecords;
        }
      },
     beforeCreate() {
      if(this.$route.params.id){
        sessionStorage.setItem("params",JSON.stringify(this.$route.params));
        console.log("123456789")
      }
      this.$nextTick(function () {
         this.initData();
         this.preview();
      })
    }, 
    mounted:function(){
      this.params=JSON.parse(sessionStorage.getItem("params"));
      window.app.showRightToolBar(true);
      window.toggle=this.toggle;
    },
    updated(){
     
    },
    methods:{

        initData(){
            axios.post(baseUrl+'/teacher/course-valuation/detail', JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
                id:this.params.id
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                this.list=response.data.detail.points;

                for(let i=0;i<this.list.length;i++){  
                    for(let j=0;j<this.list[i].points.length;j++){
                          this.list[i].points[j].score=0
                      }
                }
                this.$nextTick(function () {
                //dom已更新
                this.addEvent();
                })
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },

        preview(){
            axios.post(baseUrl+'/web/course-valuation/course-ware-preview', JSON.stringify({
                id:this.params.id
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                this.attachList=response.data.detail;
                console.log(this.list);
              }.bind(this))
              .catch(function (response) {
                console.log(response);
              });
        },

        doThis(id){
            alert(id)
        },
       
        addEvent(){
          var _this=this;
          // 获取节点
          var block = document.querySelectorAll(".block");

          for(let i=0;i<block.length;i++){


            var bar = document.querySelectorAll(".bar")[i];
            var bar_width=bar.offsetWidth;
            // debugger;
            var oW,oH;
            // 绑定touchstart事件
            block[i].addEventListener("touchstart", function(e) {
             console.log(e);
             var touches = e.touches[0];
             oW = touches.clientX - block[i].offsetLeft;
             // debugger;
             // oH = touches.clientY - block.offsetTop;
             //阻止页面的滑动默认事件
             document.addEventListener("touchmove",defaultEvent,false);
            },false)
           
            block[i].addEventListener("touchmove", function(e) {
             var touches = e.touches[0];
             var oLeft = touches.clientX - oW;
             // var oTop = touches.clientY - oH;
             if(oLeft < 0) {
              oLeft = 0;
             }else if(oLeft > bar.offsetWidth - block[i].offsetWidth) {
              oLeft = (bar.offsetWidth - block[i].offsetWidth);
             }
             block[i].style.left = oLeft + "px";
   
              for(let m=0;m<_this.list.length;m++){
                for(let n=0;n<_this.list[m].points.length;n++){
                    if(_this.list[m].points[n].pointId==block[i].getAttribute("pointid")){
                      // _this.list[m].points[n].score=((oLeft/(bar.offsetWidth - block[i].offsetWidth))*_this.list[m].points[n].total_score).toFixed(1);
                      let score=((oLeft/(bar.offsetWidth - block[i].offsetWidth))*_this.list[m].points[n].totalScore).toFixed(1);
                      if(score.substring(score.indexOf("."))<0.5){
                        score=score.replace(/\.\d/,".0");
                      }else{
                        score=score.replace(/\.\d/,".5");
                      }
                      _this.list[m].points[n].score=score;
                    }
                }
              }
            },false);
             
            block[i].addEventListener("touchend",function() {
             document.removeEventListener("touchmove",defaultEvent,false);
            },false);
            function defaultEvent(e) {
              e.preventDefault();
            };
            }

        },
        descInput(){
         var txtVal = this.desc.length;
         this.remnant = txtVal;
        },
        submit(){
            if(this.remnant<50){
                 this.$toast("评论内容不得少于50字哦！", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                });
            }else if(this.isEmojiCharacter(this.desc)){
                 this.$toast("评论内容不得含有表情符号哦！", {
                      durtaion: 200,
                      location: 'center' // 默认在中间
                });
            }else{
              this.showLoading=true;
               axios.post(baseUrl+'/teacher/course-valuation/score', JSON.stringify({
                personId: user.personId,
                uid: user.uid,
                token:user.token,
                valuationId:this.params.id,
                valuation:this.desc,
                scoreRecords:this.scoreRecords
              }))
              .then(function (response) {
                console.log(response);
                this.showLoading=false;
                if(response.data.success){
                  this.$confirm(
                    {
                        title: '',
                        content: '提交成功',
                        yesText: '返回',
                        noText: '再次编辑'
                    }).then(
                      function(){
                        console.log("ok")
                        window.history.go(-1);
                      }
                    ).catch(
                      function(){
                        console.log('点了取消')
                      }
                    );
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
              
            }
         },
         toggle(){
            this.isShowPre=!this.isShowPre;
         },

         previewAttach(url){
          console.log(url);
          window.app.openClientUrl(url);
         },
         isEmojiCharacter(substring) {
            for (var i = 0; i < substring.length; i++) {
                var hs = substring.charCodeAt(i);
                if (0xd800 <= hs && hs <= 0xdbff) {
                    if (substring.length > 1) {
                        var ls = substring.charCodeAt(i + 1);
                        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                        if (0x1d000 <= uc && uc <= 0x1f77f) {
                            return true;
                        }
                    }
                } else if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    if (ls == 0x20e3) {
                        return true;
                    }
                } else {
                    if (0x2100 <= hs && hs <= 0x27ff) {
                        return true;
                    } else if (0x2B05 <= hs && hs <= 0x2b07) {
                        return true;
                    } else if (0x2934 <= hs && hs <= 0x2935) {
                        return true;
                    } else if (0x3297 <= hs && hs <= 0x3299) {
                        return true;
                    } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
                        hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
                        hs == 0x2b50) {
                        return true;
                    }
                }
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   body,ul,li{
    margin: 0;
    padding: 0;
   }
   li{
    list-style:none;
   }
   .list-item{
    padding: 0.3rem 0.3rem;
    background-color: #fff;
    position: relative;
    /*margin-top: 0.15rem;*/
   }
   .item-name{
    font-size: 0.26rem;
    color: #4696db;
    padding-bottom: 0.1rem;
   }
   .item-time{
    font-size: 0.24rem;
    color: #999999;
    display: flex;
    align-items: center;
   }
   .item-time img{
    width:0.3rem;
    height: 0.3rem;
   }
   .span-time{
    padding: 0 0.1rem;
   }
   .span-time{
    padding: 0 0.1rem;
   }
   .item-title{
        font-size: 0.28rem;
        color: #7b7b7b;
        padding-top: 0.1rem;
   }
   .list-item>img{
    position: absolute;
    width:0.14rem;
    height:0.25rem;
    display: block;
    top: 50%;
    margin-top: -0.125rem;
    right: 0.3rem;
    z-index: 999; 
   }

.content{
  background-color: #fff;
  margin-top: 0.3rem;
  padding: 0.25rem;
}
.content .item-title{
  color: #50bdf0;
  font-size: 0.28rem;
}
.content-item ul li>p{
  font-size: 0.24rem;
  padding: 0.3rem 0;
  color: #9a9a9a;
  word-break: break-all;

}
.bar-total{
  width:5.7rem;
  height: 0.15rem;
  background: #efefef;
  border-radius: 0.1rem;
  position: relative;
  /*display: inline-block;*/
}
.bar-total img{
  width:0.94rem;
  height: 0.46rem;
  display: block;
  position: absolute;
  left: 0rem;
  margin-top: -0.15rem;
  z-index: 999;
}
.drag-bar{
  position: relative;
  /*height: 0.46rem;*/
}
.drag-bar>span{
  font-size: 0.24rem;
  color: #9a9a9a;
  /*float: right;*/
  position: absolute;
  right: 0;
  top: 50%;
  display: inline-block;
  height: 0.46rem;
  line-height: 0.46rem;
  margin-top: -0.23rem;
}
.drag-bar>span>span{
 color: #50bdf0;
}
.item-list{
  padding-bottom: 0.3rem;
}
.comment-box{
  width: 100%;
  padding-top: 0.25rem;
  padding-bottom: 2rem;
  background-color: #fff;
}
.comment-div{
  /*padding: 0.3rem;*/
  /*width: 100%;*/

  margin: 0 auto;
  width:6.8rem;
  border: 1px solid #e6e6e6;
}
.comment-div textarea{
  width:6.8rem;
  border: none;
  height: 2.5rem;
  display: block;
  padding: 0.1rem;
  box-sizing: border-box;
  color: #626262;
  font-size: 0.26rem;
}
input,button,select,textarea{outline:none}
textarea{resize:none}

.submit-btn{
  display: block;
  width: 6.8rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-align: center;
  color: #fff;
  font-size:0.32rem;
  background: #4fc2f3;
  text-decoration: none;
  border-radius: 0.1rem;
  margin: 0.6rem auto;
  margin-bottom: 0;

}
.comment-div p{
  font-size: 0.22rem;
  color: #a2a2a2;
  text-align: right;
  padding-bottom: 0.1rem;
  padding-right: 0.1rem;
}
.comment-div p>span{
  color:#55da8b;
}
.preview-list-li{

}
.preview-list{
  position: fixed;
  height: 100%;
  width:100%;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.4);
  z-index: 999999;
}
.preview-list>ul{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.preview-list-li{
/*  min-height: 1.0rem;
  line-height: 1.0rem;*/
  font-size: 0.3rem;
  background-color: #fff;
  width: 100%;
  position: relative;
  padding-left: 1rem;
  box-sizing: border-box;
  color: #7b7b7b;
  border-top: 1px solid #f5f5f9;
  padding: 0.3rem 1rem;
}
.preview-list-li>p{
  word-break: break-all;
  word-wrap:break-word;
}
.preview-list-li:last-child{
  /*border:none;*/
}
/*.preview-list-li*/
.preview-list-li img.img-l{
  width:0.24rem;
  height: 0.27rem;
  display: block;
  position: absolute;
  top: 50%;
  margin-top: -0.135rem;
  left: 0.55rem;
}
.preview-list-li img.img-r{
  width:0.6rem;
  height: 0.6rem;
  display: block;
  position: absolute;
  top: 50%;
  margin-top: -0.3rem;
  right: 0.35rem;

}
.preview-list-li:last-child{
  background-color: #f5f5f9;
  color: #848484;
  text-align:center;
  border-top:1px solid #dadada;
  padding-left: 0;
  border-bottom: none;
  padding-right: 0;
}
#no-data-tip{
  height: 2.0rem;
  line-height: 1.5rem;
  text-align: center;
}
</style>
