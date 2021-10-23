<template>
  <div class="home">
    <div class="logo">
      <img :src="detail.logo ? detail.logo : defaltImg" alt="" />
      <p>欢迎使用{{ detail.schoolName }}入学登记系统</p>
    </div>
    <div class="login-box">
      <van-form validate-first @failed="onFailed" @submit="onSubmit">
        <van-field
          v-model="account"
          clearable
          name="account"
          label="账号"
          placeholder="请填写"
          input-align="right"
        />
        <van-field
          v-model="password"
          name="password"
          label="密码"
          placeholder="请填写"
          input-align="right"
          type="password"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit">
            进入系统
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { getSchool, login } from "../api/request";
import { Decrypt } from "../util/secret";
import { stringCheck } from "../util/util";
export default {
  data() {
    return {
      defaltImg: require("../assets/imgs/logo.png"),
      account: "",
      password: "",
      detail: {},
      imgsrc: "",
      schoolId: "",
    };
  },
  async created() {
    let id = this.$route.params.id; //截取地址栏带的id
    if (!id) return;
    let res = await getSchool({ schoolId: Decrypt(id) });
    this.schoolId = Decrypt(id);
    sessionStorage.setItem("shoolId", this.schoolId);
    console.log(res);
    this.detail = res.detail;
    sessionStorage.setItem("logo", res.detail.logo);
    sessionStorage.setItem("schoolName", res.detail.schoolName);
  },
  methods: {
    onSubmit(value) {
      if (stringCheck(this.account)) {
        Toast("请输入账号");
        return;
      }
      if (stringCheck(this.password)) {
        Toast("请输入密码");
        return;
      }
      let params = {
        username: this.account,
        password: this.password,
      };
      login(params).then((res) => {
          console.log(res)
        if (res.success) {
          this.$toast("登录成功");
          sessionStorage.setItem("token", res.detail.token);
          sessionStorage.setItem("uid", res.detail.uid);
          sessionStorage.setItem("username", this.account);
          setTimeout(() => {
            this.$router.push({ path: "/welcome" });
          }, 1000);
        } else {
          this.$toast.fail(res.description);
        }
      });
    },
  },
};
</script>

<style lang="less">
.home {
  width: 100%;
  .logo {
    width: 100%;
    height: 180px;
    padding-top: 5rem;
    text-align: center;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    p {
      color: #aeacad;
    }
  }
}
.login-box {
  padding: 0 35px;
}
</style>