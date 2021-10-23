<template>
    <div>
       
      <div class="item" v-on:click.stop="openUrl('save')"> 
        <img src="../assets/icon-a1.png" alt="">
        存钱
        <span class="item-arr"></span>
      </div>
        <div class="item" v-on:click.stop="openUrl('draw')"> 
        <img src="../assets/icon-a2.png" alt="">
        取钱
        <span class="item-arr"></span>
      </div>
        <div class="item" v-on:click.stop="openUrl('query')"> 
        <img src="../assets/icon-a3.png" alt="">
        查询
        <span class="item-arr"></span>
      </div>

    </div>
</template>
<script>
import loading from '../components/loading'
import axios from 'axios'
import {baseUrl,user} from '../config/env'
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
  
        
    },
    methods:{

      openUrl(url){
        this.$router.push({ name: url})
      }


    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .item{
    height: 1.6rem;
    width: 6.8rem;
    line-height: 1.6rem;
    background-color: #fff;
    margin:0.24rem auto;
    position: relative;
    border-radius: 0.08rem;
    font-size: 0.36rem;
    color: #7b7b7b;
    padding-left: 1.7rem;
    box-sizing: border-box;
   }
 
   .item>img{
    position: absolute;
    display: block;
    width:0.96rem;
    height: 1.6rem;
    left: 0.47rem;
    top: 0;
   }
   .item-arr{
    display: block;
    position: absolute;
    width: 0.2rem;
    height: 0.35rem;
    right: 0.36rem;
    top: 50%;
    margin-top: -0.175rem;
    background-image: url(../assets/icon-arr.png);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
   }
</style>
