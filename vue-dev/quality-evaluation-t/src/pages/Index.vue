<template>
    <div>
       <div class="top-banner">
            <img src="../assets/b1.png" alt="">
       </div>
       <div class="bottom-box">
           <ul class="ul1">
               <li>
                    <img src="../assets/b5.png" alt="" v-on:click.stop="openUrl('quality-evaluation-filter')">
               </li>
                <li>
                    <img src="../assets/b6.png" alt="" v-on:click.stop="openUrl('self-evaluation-filter')">
               </li>
                <li>
                    <img src="../assets/b2.png" alt="" v-on:click.stop="openUrl('parents-word-filter')">
               </li>
           </ul>
             <ul class="ul2">
               <li>
                    <img src="../assets/b3.png" alt="" v-on:click.stop="openUrl('teacher-word-filter')">
               </li>
                <li>
                    <img src="../assets/b4.png" alt="" v-on:click.stop="openUrl('evaluation-report')">
               </li>
           </ul>
       </div>
      

    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl} from '../config/env'
export default {
    name: 'index',
    components: {
      loading
    },
    data() {
        return {
           
        }
    },
    mounted(){        
        if(this.isiOS()){
            window.webkit.messageHandlers.showRightToolBar.postMessage(false);
        }else{
            window.app.showRightToolBar(false);
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
        openUrl(url){
            this.$router.push({ path: url})
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
li,ul{
    list-style: none;
}
.top-banner{
    height: 4.15rem;
}
.top-banner>img{
    height: 4.15rem;
}
.ul1{
    overflow: hidden;
    padding-top: 0.2rem;
    padding-bottom: 0.4rem;
}
.ul1>li{
    float: left;
    width: 33.33%;
}
.ul1>li>img{
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    margin: 0 auto;
}
.ul2{
    overflow: hidden;
    padding-top: 0.2rem;
    width: 66.66%;
    margin: 0 auto;
}
.ul2>li{
    float: left;
    width: 50%;
}
.ul2>li>img{
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    margin: 0 auto;
}
</style>
