<template>
  <div class="row" v-if="this.$store.state.session == null">
    <div class="col-md-6">
      <div >
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe distinctio, sit rem dolor doloremque ut illo delectus dignissimos magnam neque culpa nulla magni harum quod? Repellat, dicta? Totam, neque numquam.
      </div>
    </div>
    <div class="col-md-6">
      <login v-if="this.$store.state.session == null && login" :login="l"  ></login>
      <checkIn v-if="this.$store.state.session == null && !login" :login="l"  ></checkIn>
    </div>
  </div>
</template>

<script>
import Login from '@/components/user/login'
import CheckIn from '@/components/user/checkin'
export default {
  name: 'LoginBasic',
  components: {
    Login,
    CheckIn
  },
  data () {
    return {
      login: true
    }
  },
  methods: {
    l (state) {
      this.login = state
    }
  },
  mounted () {
    if (this.$store.state.session != null) {
      this.$router.push('/')
    }
  }
}
</script>
