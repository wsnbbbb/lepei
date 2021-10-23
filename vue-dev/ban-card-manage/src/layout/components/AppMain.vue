<template>
  <section class="app-main" :class="{'app-container':this.$route.name !== 'Welcome'}">
    <breadcrumb class="breadcrumb-container" />
    <transition name="fade-transform" mode="out-in">
      <!-- <router-view :key="key" /> -->
      <div>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
      </div>
    </transition>
  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb
  },
  data() {
    return {
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">
.app-main {
  /*60 = navbar  */
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.app-container{
  padding:0 20px;
}
.fixed-header+.app-main {
  padding-top: 60px;
}

.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
