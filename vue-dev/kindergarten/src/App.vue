<template>
  <div id="app">
    <router-view />
    <!-- {{msg}}
    {{recordId}} -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Toast } from "vant";


@Component({})
export default class App extends Vue {
  // private msg: string = "";
  // private recordId: string = "";
  mounted(): void {
    
  }

  
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
.btns {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  .examines-btn {
    width: 50%;
  }
  .confirmBtn {
    width: 100%;
  }
  .status-btn,.examines-btn,.confirmBtn {
    height: 2.9375rem;
    line-height: 2.9375rem;
    font-size: 16px;
  }
  .status-btn {
    width: 100%;
    background-color: #ffffff;
    color: #FFA1D2;
    text-align: center;
    border: 1px solid #EBEBEB;
  }
}
.imgs {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  .imgbox {
    width: 32%;
    height: 6.5625rem;
    margin: 0 1% 1% 0;
    .img {
      width: 100%;
      height: 100%;
    }
  }
}
.approval-process {
  color: #999999;
  .title {
    margin-top: 1rem;
  }
  .examines {
    padding-left: 1.25rem;
    font-size: 14px;
    .first {
      border: none !important;
    }
    .step {
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-left: 2px solid #CBCBCB;
      padding-left: 30px;
      .left {
        width: 63%;
        height: 34px;
        position: relative;
        display: flex;
        .van-icon {
          font-size: 1.125rem;
        }
        .portrait {
          position: absolute;
          left: -47px;
          top: 0;
          width: 34px;
          height: 34px;
          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }
        .text {
          line-height: 34px;
          margin-right: 16px;
        }
        .defalutText {
          border-radius: 50%;
          color: #fff;
          font-size: 13px;
          line-height: 34px;
          text-align: center;
        }
        .person {
          font-size: 12px;
          margin-right: 15px;
          .header {
            margin: 0 auto;
            width: 22px;
            height: 22px;
            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .right {
        width: 38%;
        height: 34px;
        line-height: 34px;
        text-align: right;
      }
    }
    .copyPerson {
      .box {
        width: 100%;
      }
    }
  }
}

</style>
