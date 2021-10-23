<template>
  <div class="welcome-container" />
</template>

<script>
import { setToken, getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { checkToken } from '@/api/user'
export default {
  name: 'Welcome',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    const token = this.$route.query.verify || getToken()
    // const token = 'db332421b377b9621cc7d4f99c8ddbae'
    setToken(token)
    checkToken({ token })
  }
}
</script>

<style lang="scss" scoped>
.welcome-container{
  width:100%;
  height: calc(100vh - 60px);
  background:url('../../assets/images/welcome.png') no-repeat;
  background-size: cover;
}
</style>
