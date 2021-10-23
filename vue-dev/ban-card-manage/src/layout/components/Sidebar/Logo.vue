<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <!-- 折叠状态显示 -->
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
      <!-- 未折叠状态显示 -->
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      title: '电子班牌管理平台',
      // logo:require('../../../assets/images/avatar.jpg')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #20a0ff;
  text-align: center;
  overflow: hidden;
  border-right: 1px solid #E6E6E6;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: normal;
      line-height: 60px;
      font-size: 18px;
      // font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
