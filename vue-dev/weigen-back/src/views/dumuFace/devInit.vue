<template>
  <section>
    <!-- 面包屑 -->
    <el-col :span="24" class="breadcrumb-box">
      <strong class="title">{{ $route.name }}</strong>
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item>人脸识别管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/du-face-device' }">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <div class="contain">
      <div class="content">
        <!-- 初始化状态 -->
        <div class="init-status">
          <div class="text">
            <div class="img" v-if="initStatus == 1">
              <img src="../../assets/loding.png" />
            </div>
            <h3>{{initStatus == 1 ? "正在初始化 。。。。" : "初始化失败"}}</h3>
          </div>
          <div>
            <el-button v-if="initStatus == 2" type="primary" @click="syneByDev">重试</el-button>
          </div>
        </div>
        <!-- 初始化日志 -->
        <div class="init-log">
          <!-- 提示 -->
          <div class="log-item">
            <div class="dot"><div></div></div>
            <div class="title">提示</div>
            <div class="info-box">
              <div class="text">初始化设备提示信息</div>
              <div class="info" v-for="(item,index) in hintArr" :key="index">
                <div>{{item.title}}</div>
                <div :style="{color:item.status == 1 ? '#606266' : (item.status == 2 ? '#f00' : '#67C23A')}">{{status(item.status)}}</div>
                <div><el-button type="primary" v-if="item.status == 2 && initStatus == 2" size="mini" @click="syncByItem(item.item)">重试</el-button></div>
              </div>
            </div>
          </div>
          <!-- 显示 -->
          <div class="log-item">
            <div class="dot"><div></div></div>
            <div class="title">显示</div>
            <div class="info-box">
              <div class="text">初始化设备显示数据</div>
              <div class="info" v-for="(item,index) in showArr" :key="index">
                <div>{{item.title}}</div>
                <div :style="{color:item.status == 1 ? '#606266' : (item.status == 2 ? '#f00' : '#67C23A')}">{{status(item.status)}}</div>
                <div><el-button type="primary" v-if="item.status == 2 && initStatus == 2" size="mini" @click="syncByItem(item.item)">重试</el-button></div>
              </div>
            </div>
          </div>
          <!-- 安全 -->
          <div class="log-item">
            <div class="dot"><div></div></div>
            <div class="title">安全</div>
            <div class="info-box">
              <div class="text">初始化安全设置</div>
              <div class="info" v-for="(item,index) in safetyArr" :key="index">
                <div>{{item.title}}</div>
                <div :style="{color:item.status == 1 ? '#606266' : (item.status == 2 ? '#f00' : '#67C23A')}">{{status(item.status)}}</div>
                <div><el-button type="primary" v-if="item.status == 2 && initStatus == 2" size="mini" @click="syncByItem(item.item)">重试</el-button></div>
              </div>
            </div>
          </div>
          <!-- 数据 -->
          <div class="log-item">
            <div class="dot"><div></div></div>
            <div class="title">数据</div>
            <div class="info-box">
              <div class="text">初始化数据设置</div>
              <div class="info" v-for="(item,index) in dataArr" :key="index">
                <div>{{item.title}}</div>
                <div :style="{color:item.status == 1 ? '#606266' : (item.status == 2 ? '#f00' : '#67C23A')}">{{status(item.status)}}</div>
                <div><el-button type="primary" v-if="item.status == 2 && initStatus == 2" size="mini" @click="syncByItem(item.item)">重试</el-button></div>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
  </section>

</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import util from "../../common/js/util";
import { deviceSyncLog, syneByDev,syncByItem } from "../../api/api";

export default {
  data() {
    return {
      initStatus:'',
      hintArr:[],
      showArr:[],
      safetyArr:[],
      dataArr:[],

    };
  },
  computed: {
   
  },
  methods: {
    ...mapActions("common", [
      //collection是指modules文件夹下的collection.js
      "invokePushItems", //collection.js文件中的actions里的方法，在上面的@click中执行并传入实参
    ]),

    // 同步状态
    status (type) {
      if (type == 1) {
        return "同步中";
      } else if (type == 2) {
        return "同步失败";
      } else if (type == 3) {
        return "同步成功";
      } else {
        return "";
      }
    },

    // 查询初始化日志
    deviceSyncLog () {
      let params = {
        devSn:this.$route.query.devSn
      }
      deviceSyncLog(params).then((res) => {
        if(res.code == 200) {
          this.initStatus = res.data.devInfo.initStatus
          res.data.initLogs && res.data.initLogs.map(item =>{
            if(item.type == 1) {
              this.hintArr.push(item)
            }else if(item.type == 2) {
              this.showArr.push(item)
            }else if(item.type == 2) {
              this.showArr.push(item)
            }else if(item.type == 3) {
              this.safetyArr.push(item)
            }else if(item.type == 4) {
              this.dataArr.push(item)
            }
          })
        }
      });
    },

    // 一键重试
    syneByDev () {
      let params = {
        devSn:this.$route.query.devSn
      }
      syneByDev(params).then((res) => {
        if(res.code == 200) {
          this.$message({message: res.msg,type: 'success'});
          setTimeout(() =>{ 
            window.history.go(-1);
          }, 1000);
         
        }
      })
    },

    // 单个配置项重试
    syncByItem (item) {
      let params = {
        devSn:this.$route.query.devSn,
        item:item
      }
      syncByItem(params).then((res) => {
        if(res.code == 200) {
          this.$message({message: res.msg,type: 'success'});
          setTimeout(() =>{ 
            window.history.go(-1);
          }, 1000);
        }
      })
    }
   
   
   
  },

  mounted() {
    this.deviceSyncLog()
  },
};
</script>

<style scoped lang="scss">
.contain{
  width:100%;
  height: 830px;
  background-color: #f2f2f2;
  padding: 15px 0;
  box-sizing: border-box;
  overflow-y: auto;
  .content{
    width:98%;
    min-height: 800px;
    margin:0 auto;
    background-color: #fff;
    padding:0 100px;
    box-sizing: border-box;
    .init-status{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height:120px;
      border-bottom:1px solid #ccc;
      padding:0 50px;
      .text {
        display: flex;
        align-items: center;
        .img{
          width:40px;
          height:40px;
          margin-right: 20px;
          img{
            width:100%;
            height: 100%;
            -webkit-transform:translate3d(0,0,0);
            -moz-transform:translate3d(0,0,0);
            transform:translate3d(0,0,0);
            /* 设置动画，animation:动画名称 动画播放时长单位秒或微秒 动画播放的速度曲线linear为匀速 动画播放次数infinite为循环播放; */
            -webkit-animation:play 2 linear infinite;
            -moz-animation:play 2s linear infinite;
            animation:play 2s linear infinite;
          }
        }
        h3{
          font-size: 30px;
          font-weight: normal;
        }
      }
    }
    .init-log{
      padding:0 50px;
      .log-item{
        padding:20px 0;
        display: flex;
        .dot{
          width:3%;
          margin-top: 3px;
          div{
            width:20px;
            height: 20px;
            border-radius: 10px;
            background-color:#3492E9;
          }
        }
        .title{
          width:7%;
          color:#3492E9;
          font-size: 18px;
          // text-align: center;
        }
        .info-box{
          width:85%;
          .text{
            font-size: 18px;
            margin-bottom: 10px;
          }
          .info{
            display: flex;
            justify-content: space-between;
            align-items: center;
            color:#A3A3A3;
            margin-bottom:10px;
            div{
              &:first-child{
                width:80%;
              }
              &:nth-child(2){
                width:10%;
              }
              &:last-child{
                width:8%;
              }

            }
          }
        }
      }
    }
  }
}
@-webkit-keyframes play{
  0%  {
    // 顺时针旋转
    -webkit-transform:rotate(0deg);
  }
  100% {
    // 顺时针旋转
    -webkit-transform:rotate(360deg);
  }
}


</style>