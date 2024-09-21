<template>
  <navbar></navbar>
  {{$store.state.session}}
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
      console.log('intento de coneccion')
      console.log(user && user.uuid)
      if (user && user.uuid) {
        socket.emit('coneccion', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
        console.log('coneccion exitosa')
      }
      return state.connected
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
    Footers
  },

  methods: {
    inicio () {
      this.$store.state.session = JSON.parse(localStorage.getItem('sesion'))
      this.$store.state.token = JSON.parse(localStorage.getItem('token'))
    }

  },
  mounted () {
    console.log('con session')
    this.inicio()
    socket.on('connect', () => {
      const user = this.$store.state.session
      if (user && user.uuid) {
        socket.emit('coneccion', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
        console.log('coneccion emitida tras conexión')
      }
    })
    socket.on('updateSession', (data) => {
      console.log(data.data)
      this.$store.state.session = data.data
      localStorage.setItem('sesion', JSON.stringify(data.data))
    })
  }

}
</script>
