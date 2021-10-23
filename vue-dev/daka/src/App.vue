<template>
  <div id="app">
   
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>
<style lang="less">
  *{
    padding:0;
    margin:0;
  }
  html,body,#app{
      height: 100%;
      color:#444;
  }
  
</style>
