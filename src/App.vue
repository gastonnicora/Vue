<template>
  <navbar></navbar>
  <div class="body"><router-view /></div>
  <loading
    v-model:active="this.$store.state.isLoading"
    :can-cancel="false"
    :is-full-page="true"
    loader="bars"
  />
  <Footer></Footer>
</template>
<style>
@import './assets/style.css';

@import './assets/app.css';
</style>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { state, socket } from '@/socket.js'
import Navbar from '@/components/nav/navbar'
import Footer from '@/components/nav/footer'
export default {
  computed: {
    connected () {
      const user = this.$store.state.session
      if (user !== null) {
        socket.emit('coneccion', user.uuid, () => {})
      }
      return state.connected
    }
  },
  async created () {
    this.$store.commit('SET_CONNECTION')
    this.inicio()
    const user = this.$store.state.session
    if (user !== null) {
      socket.emit('coneccion', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
    } else {
      socket.emit('coneccion', {})
    }
  },
  data () {
    return {
      isLoading: this.$store.state.isLoading
    }
  },
  components: {
    Loading,
    Navbar,
    Footer
  },

  methods: {
    inicio () {
      this.$store.state.session = JSON.parse(localStorage.getItem('sesion'))
      this.$store.state.token = JSON.parse(localStorage.getItem('token'))
    }
  },
  mounted () {
    if (this.$store.state.session) {
      socket.on('updateSession/' + this.$store.state.session.uuid, (data) => {
        console.log(data.data)
        this.$store.state.session = data.data
        localStorage.setItem('sesion', JSON.stringify(data.data))
      })
    } else {
      console.log('No se ha iniciado sesión, no se puede establecer el listener del socket.')
    }
  }

}
</script>
