<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <transition :name="transitionName">  -->
      <router-view/>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
　　　　return {
　　　　　　transitionName: 'slide-right'  // 默认动态路由变化为slide-right
　　　　}
　　}
}
</script>


<style>
body,p{
  margin: 0;
  padding: 0;
  background: transparent;
}
body{
  height: 100%;
}
html{
  height: 100%;
  background-color: #f5f5f5;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
._v-container>._v-content>.loading-layer{
  display: none;
}
</style>
