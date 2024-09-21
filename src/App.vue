<template>
  <navbar></navbar>
  <p>State: {{ con }}</p>
  <button @click="connect()">Connect</button>
  <button @click="disconnect()">Disconnect</button>
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
    },
    con () {
      return state.connected
    }
  },
  async created () {
    this.$store.commit('SET_CONNECTION')
    this.inicio()
    const user = this.$store.state.session

    console.log('intento de coneccion')
    console.log(user && user.uuid)
    if (user && user.uuid) {
      socket.emit('coneccion', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
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
    },
    connect () {
      socket.connect()
    },
    disconnect () {
      socket.disconnect()
    }

  },
  mounted () {
    console.log('con session')
    socket.on('updateSession', (data) => {
      console.log(data.data)
      this.$store.state.session = data.data
      localStorage.setItem('sesion', JSON.stringify(data.data))
    })
  }

}
</script>
