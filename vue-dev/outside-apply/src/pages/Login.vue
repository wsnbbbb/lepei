<template>
  <div class="login">
    <div class="top">
      <div class="log-img">
        <img :src="detail.logo ? detail.logo : defaltImg" alt="" />
      </div>
      <p>欢迎使用{{detail.schoolName}}申请系统</p>
    </div>
    <div class="login-form">
      <van-form @submit="loginSystem">
        <van-field
          maxlength="11"
          label="手机号"
          type="tel"
          clearable="true"
          class="input"
          name="telphone"
          v-model="telphone"
          placeholder="请输入手机号"
          :rules="telRules"
        />
        <p class="tips">*手机号是系统唯一识别号，请输入有效的手机号*</p>
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >进入系统</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import {getSchool} from '../api/request'
export default {
  inject: ["reload"],
  data() {
    return {
      defaltImg: require('../assets/imgs/logo.png'),
      schoolId: '',
      detail:{},
      telphone: "",
      telRules: [
        {
          required: true,
          message: "手机号码不能为空",
          trigger: "onBlur",
        },
        {
          // 自定义校验规则
          validator: (value) => {
            return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
              value
            );
          },
          message: "请输入正确格式的手机号码",
          trigger: "onBlur",
        },
      ],
    };
  },
  async created() {
    
    let id = this.getQueryString("schoolId")
    if (!id) return
    this.schoolId = id
    let res = await getSchool({"schoolId": id})
    if(res.success){
      this.detail = res.detail;
    }
  },
  methods: {
    // 登录
    loginSystem(value) {
      let userInfo = {
        id:this.schoolId,
        tel:value.telphone,
      }
      sessionStorage.setItem("userInfo",JSON.stringify(userInfo))
       this.$router.push({path:"/outside-list"})
    },
    getQueryString(name){ 
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const href = window.location.href;
        const index = href.indexOf('?');
        const query = href.substr(index);
        const r = query.substr(1).match(reg);
        if(r != null) {
          return unescape(r[2]);
        }
        return null;
    }
  },
};
</script>

<style lang="less" scope>
.login {
  .top {
    width: 100%;
    padding: 40px 0;
    text-align: center;
    .log-img {
      width: 100px;
      height: 100px;
      margin: 10px auto;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .login-form {
    .tips {
      color: #aeacae;
      margin: 10px 0;
      font-size: 12px;
      text-indent: 2rem;
    }
  }
}
</style>
