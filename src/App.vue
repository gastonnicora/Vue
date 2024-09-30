<template>
  <navbar></navbar>
  <div class="body"><router-view /></div>
  <loading
    v-model:active="this.$store.state.isLoading"
    :can-cancel="false"
    :is-full-page="true"
    loader="bars"
  />
  <Footers></Footers>
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
import Footers from '@/components/nav/footer'
export default {
  computed: {
    connected () {
      const user = this.$store.state.session
      socket.on('connect', () => {
        if (user && user.uuid) {
          socket.emit('coneccion', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
        }
      })
      return state.connected
    }
  },
  data () {
    return {
      isLoading: this.$store.state.isLoading,
      socket: null,
      state1: state.connected
    }
  },
  components: {
    Loading,
    Navbar,
    Footers
  },

  methods: {
    inicio () {
      this.$store.state.session = JSON.parse(localStorage.getItem('sesion'))
      this.$store.state.token = JSON.parse(localStorage.getItem('token'))
    }
  },
  mounted () {
    this.inicio()
    socket.on('connect', () => {
      const user = this.$store.state.session
      if (user && user.uuid) {
        socket.emit('coneccion', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
      }
    })
    socket.on('updateSession', (data) => {
      this.$store.state.session = data.data
      localStorage.setItem('sesion', JSON.stringify(data.data))
    })
  }

}
</script>
