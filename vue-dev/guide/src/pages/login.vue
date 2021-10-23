<template>
    <div>
        <img class="img-bg" src="../assets/p1.png" alt="">
       <div class="login-box">
          <div>
            <img src="../assets/p3.png" alt="">
            <input type="text" placeholder="请输入学生姓名" v-model='username'>
          </div>
           <div>
            <img src="../assets/p2.png" alt="">
            <input type="text" placeholder="请输入学生证件号" v-model='id'>
          </div>
       </div>
       <a href="javascript:;" class="login-btn" v-on:click.stop='search'>查询</a>
       <loading v-show="showLoading"> </loading>
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
            showLoading:false,
            username:null,
            id:null
        }
    },
    mounted(){
    },
    methods:{

        search(){
         
          if(this.username&&this.id){
            this.showLoading=true;
            axios.post(baseUrl+'/web/person/search', JSON.stringify({
                name: this.username,
                number: this.id
              }))
              .then(function (response) {

                  this.showLoading=false
                  if(response.data.success){
                    sessionStorage.setItem("name",response.data.detail[0].name);
                    sessionStorage.setItem("className",response.data.detail[0].className);
                    sessionStorage.setItem("icCardNo",response.data.detail[0].icCardNo);
                    sessionStorage.setItem("schoolLogo",response.data.detail[0].schoolLogo);
                    sessionStorage.setItem("schoolName",response.data.detail[0].schoolName);
                    sessionStorage.setItem("activeCode",response.data.detail[0].activeCode);
                    this.$router.push({ name: 'detail'})
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
            }else{
                this.$toast("请输入姓名和证件号码！", {
                durtaion: 200,
                location: 'center' // 默认在中间
                    });
                
            }
          
        },

    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-box{
  width: 6.8rem;
  margin: 0 auto;
  margin-top: 0.5rem;
  background-color: #fff;
  border-radius: 0.1rem;
}
.login-box>div{
  width: 6.8rem;
  height: 0.96rem;
  position: relative;
}
.login-box>div:first-child{
  border-bottom: 1px solid #ededed;
}
.login-box>div>img{
  width:0.4rem;
  height: 0.4rem;
  display: block;
  position: absolute;
  left: 0.2rem;
  top:50%;
  margin-top: -0.2rem;
}
.login-box>div>input{
  position: absolute;
  border: none;
  left: 0.85rem;
  height: 0.4rem;
  padding: 0;
  top: 50%;
  margin-top: -0.2rem;
  outline: none;
  -webkit-appearance: none;
  width: 5.5rem;
  font-size: 0.28rem;
}
::-webkit-input-placeholder { /* WebKit browsers */
  color:    #bbb;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color:    #bbb;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color:    #bbb;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
  color:    #bbb;
}
.login-btn{
  width: 6.15rem;
  height: 0.9rem;
  text-align: center;
  line-height: 0.9rem;
  color: #fff;
  background-color: #4fc2f3;
  display: block;
  font-size: 0.28rem;
  text-decoration: none;
  border-radius: 0.08rem;
  margin: 0.6rem auto;
}
.img-bg{
  width: 100%;
}
</style>
