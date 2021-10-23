<template>
  <div class="navbar">
    <!-- 面包屑 折叠按钮 已注释  -->
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <img src="../../assets/images/lepei.png" class="user-avatar">
    </div>

    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item  @click.native="logout">
            <span style="display:block;">退出登陆哦!!</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 去退出登陆啦.vuex里面的事件里面去做逻辑
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-caret-bottom{
  display: none;
}
.user-dropdown{
  box-shadow: none;
  margin: 0px;
  padding: 8px 5px;
}
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #20a0ff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    padding:10px 20px;
    .user-avatar {
      object-fit: cover;
      width: 40px;
      height: 40px;
      border-radius: 100%;
    }

    // &:focus {
    //   outline: none;
    // }

    // .right-menu-item {
    //   display: inline-block;
    //   padding: 0 8px;
    //   height: 100%;
    //   font-size: 18px;
    //   color: #5a5e66;
    //   vertical-align: text-bottom;

    //   &.hover-effect {
    //     cursor: pointer;
    //     transition: background .3s;

    //     &:hover {
    //       background: rgba(0, 0, 0, .025)
    //     }
    //   }
    // }

    // .avatar-container {
    //   margin-right: 30px;

    //   .avatar-wrapper {
    //     margin-top: 5px;
    //     position: relative;

    //     .user-avatar {
    //       object-fit: cover;
    //       cursor: pointer;
    //       width: 40px;
    //       height: 40px;
    //       border-radius: 100%;
    //     }

    //     .el-icon-caret-bottom {
    //       cursor: pointer;
    //       position: absolute;
    //       right: -20px;
    //       top: 25px;
    //       font-size: 12px;
    //     }
    //   }
    // }
  }
}
</style>
