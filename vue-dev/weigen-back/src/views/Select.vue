<template>
  <div class="main">
    <h2>登录成功，请选择需要管理的业务类型，<span @click="loginOut()">退出登录</span></h2>
    <div class="card-box">
      <ul>
        <li class="card-item" v-if="isShowModule('wg-entry')" :class="{'active':activeItem==1}" @click='select(1)'>
          <h2>乐陪门禁</h2>
          <img src="../assets/icon-menjin.png" alt="">
          <h4>门禁控制终端管理，门禁通行策略管理，门禁出入记录查询，门禁实时出入查看</h4>
        </li>
        <li class="card-item" v-if="isShowModule('ssw-bluetooth')" :class="{'active':activeItem==2}"  @click='select(2)'>
          <h2>蓝牙定位</h2>
          <img src="../assets/icon-bluetooth.png" alt="">
          <h4>定位标签管理，实时定位查询，手环健康数据查询，手环运动数据查询，手环电量查询</h4>
        </li>
        <li class="card-item" v-if="isShowModule('baidu-face')" :class="{'active':activeItem==3}"  @click='select(3)'>
          <h2>人脸识别</h2>
          <img src="../assets/icon-face.png" alt="">
          <h4>人脸识别终端管理，人脸识别终端配置，人脸库配置，人脸库权限管理</h4>
        </li>
      </ul>
      <el-button size="medium" class="btn-enter" :disabled="activeItem==''" @click='enter()'>进入</el-button>
    </div>
  </div>
</template>

<script>
  import { store, mapActions } from 'vuex'
  import { getSchoolDetail, getModules} from '../api/api';
  import { routes, weigenRoutes, duFaceRoutes , bluetoothLocationRoutes} from '../routes/routes.js'
  import axios from 'axios';
  import {imgBase } from '../config'
  const decode = require('decode-html');
  const md5 = require('md5');
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
       activeItem: '',
       modules: []

      };
    },
    computed: {
     
    },
    methods: {
      isShowModule: function(module){
        return this.modules.includes(module)
      },
      select(index){
        this.activeItem = index
      },
      getModules(){
        let param ={}
        getModules(param).then(data => {
              if (data.code == 200) {
                this.modules = data.data.modules
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
            }).finally(()=>{
              
            })
      },
      enter(){
        if(!this.activeItem) return
        if(this.activeItem==1){
          sessionStorage.setItem('activeItem', 1)
          this.$router.options.routes = routes.concat(weigenRoutes);
          this.$router.addRoutes(weigenRoutes)
          this.$router.push({ path: '/devConfig' });
        }else if(this.activeItem == 2){
          sessionStorage.setItem('activeItem', 2)
          this.$router.options.routes = routes.concat(bluetoothLocationRoutes);
          this.$router.addRoutes(bluetoothLocationRoutes)
          this.$router.push({ path: '/base-station-manage' });
        }else if(this.activeItem == 3){
          sessionStorage.setItem('activeItem', 3)
          this.$router.options.routes = routes.concat(duFaceRoutes);
          this.$router.addRoutes(duFaceRoutes)
          this.$router.push({ path: '/du-face-device' });
        }
        
        let cludeRoutes = this.$router.options.routes.filter(ele => ele.children && ele.children.length > 0).map(ele => ele.children);
        if(cludeRoutes.length > 0){
          let includeRoute = cludeRoutes[0].filter(ele => ele.meta && ele.meta.keepAlive).map(ele => ele.name)
          let excludeRoute = cludeRoutes[0].filter(ele => !ele.meta || !ele.meta.keepAlive).map(ele => ele.name)
          this.$store.dispatch("keepRoutes/setIncludeRoute", includeRoute);
          this.$store.dispatch("keepRoutes/setExcludeRoute", excludeRoute);
        }
      },
      loginOut(){
        var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem("userId");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});
      }
     
      
    },
    mounted() {
      this.getModules()
    }
  }

</script>

<style lang="scss" scoped>
  .btn-enter{
    width: 260px;
    height: 50px;
    font-size: 18px;
  }
  ul, li{
      list-style: none;
      margin: 0;
      padding: 0;
  }
  .main{
    width: 960px;
    margin: 0 auto;
    padding-top: 50px;
    >h2{
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: #222;
      padding-bottom: 20px;
      span{
        cursor: pointer;
        color: #1689ff;
        
      }
    }
    .card-item:hover{
      // border: 1px solid #bac8d4;
      box-sizing: border-box;
      position: relative;
      top: -1px;
      opacity: 0.8;
    }
    .card-item{
      cursor: pointer;
      width: 280px;
      height: 400px;
      border: 1px solid #fff;
      padding: 20px;
      box-sizing: border-box;
      img{
        width: 240px;
        display: block;
        margin: 0 auto;
      }
    }
    .active{
      box-shadow: 0px 2px 9px #bac8d4;
    }
    .card-box{
      text-align: center;
      ul{
        overflow: hidden;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
        box-sizing: border-box;
        li{
          margin: 0 16px;
          margin-bottom: 50px;
          h2{
            font-size: 18px;
            font-weight: 400;
            text-align: center;
            margin-top: 0;
          }
          h4{
            font-size: 16px;
            font-weight: 400;
            text-align: left;
            margin: 0;
          }
        }
      }
    }
  }
   
  
</style>