<template>
  <router-link :to="'/myAuction/'+this.$route.params.uuid" class="btn  btn-link" style="display:table" >
    <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver al remate
    </router-link>
  <div class="edit" v-if="today(article.dateOfStart)">
    <router-link :to="this.$route.path+'/updateArticle'" class="btn  btn-outline-primary" >
      <font-awesome-icon :icon="['fas', 'pen']" />
    </router-link>
    <button  class="btn btn-outline-danger " @click="this.delete()">
      <font-awesome-icon :icon="['fas', 'trash-can']" />
    </button>
  </div>
  <p>Usuarios conectados:{{  users.length }}</p>
  <img class="imgArticle" :src="article.urlPhoto" :alt="article.description"><br>
  {{ article.description }} <br>
  <div v-if="article.type==0"> Comienza: {{time(article.dateOfStart)}} </div>
  <div v-if="article.type==0"> Finaliza: {{time(article.dateOfFinish)}} </div>
  Base: ${{ article.minValue}} <br>
  Aumento entre pujas: ${{ article.minStepValue }}
  <p v-if="this.article.dataBid && this.article.dataBid.dataUser && this.$store.state.session && this.article.dataBid.dataUser.uuid==this.$store.state.session.uuid"> Usted pujo: ${{this.article.dataBid.value}} </p>
  <p v-if="this.article.dataBid && this.article.dataBid.dataUser && this.$store.state.session && this.article.dataBid.dataUser.uuid!=this.$store.state.session.uuid"> Ultima puja: {{this.article.dataBid.dataUser.name}} {{this.article.dataBid.dataUser.lastName}} ${{this.article.dataBid.value}} </p>
  <div v-if="timeOfEnd!= 0">Tiempo para que termine: {{ timeOfEnd }}</div>
 <br/>
 <div>
 <button  class="btn btn-outline-primary button"  id="before" v-if="this.article.before" @click="changeUrl(article.before)"><font-awesome-icon :icon="['fas', 'chevron-left']" />Articulo anterior</button>
 <button class="btn btn-outline-primary button" id="next" v-if="this.article.next" @click="changeUrl(article.next)">Articulo siguiente<font-awesome-icon :icon="['fas', 'chevron-right']"/> </button>
</div>
<bidForArticle v-if="this.article.finished && this.article.maxBid" :article="$route.params.article"></bidForArticle>
</template>
<style >
@import '@/assets/article.css';

</style>
<script>
import bidForArticle from '@/components/bid/bidForArticle.vue'
import { get } from '@/fetch.js'
import { socket } from '@/socket.js'
export default {
  name: 'ArticleView',
  data () {
    return {
      article: {},
      error: '',
      users: [],
      timeOfEnd: 0
    }
  },
  components: {
    bidForArticle
  },
  methods: {
    time (date) {
      const moment = require('moment')
      moment.locale('es')
      return moment(date, 'DD/MM/YYYYTHH:mm:ssZZ').format('LLLL')
    },
    today (dateStart) {
      const moment = require('moment')
      moment.locale('es')
      return moment(dateStart, 'DD/MM/YYYYTHH:mm:ssZZ') > moment()
    },
    async getArticle (uuid) {
      this.$store.state.isLoading = true
      const json = await get('/article/' + uuid, 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        this.article = json.content
      }
      this.$store.state.isLoading = false
    },
    leaveRoom () {
      socket.emit('leave', { room: this.$route.params.article })
      socket.off('joinToRoom/' + this.$route.params.article)
      socket.off('bidRoom/' + this.$route.params.article)
      socket.off('countdown/' + this.$route.params.article)
    },
    changeUrl (uuid) {
      window.removeEventListener('beforeunload', this.leaveRoom)
      this.leaveRoom()
      this.$router.push({ name: 'myArticle', params: { uuid: this.$route.params.uuid, article: uuid } })
      this.getArticle(uuid)
      this.socket(uuid)
    },
    async delete () {
      const aceptar = confirm('¿Estás seguro de que deseas eliminar este articulo?')
      if (aceptar) {
        this.$store.state.isLoading = true
        const json = await get('/articleDelete/' + this.$route.params.article, 'DELETE', this.$store.state.token)
        if (json.error) {
          alert(json.error)
        } else {
          alert('Articulo eliminado')
          this.$router.push({ name: 'myAuction', params: { uuid: this.$route.params.uuid } })
        }
        this.$store.state.isLoading = false
      }
    },
    socket (uuid) {
      socket.emit('join', { room: uuid })
      socket.on('joinToRoom/' + uuid, (room) => {
        this.users = room.users
      })
      socket.on('bidRoom/' + uuid, (bid) => {
        this.article.dataBid = bid
      })
      socket.on('countdown/' + uuid, (room) => {
        this.timeOfEnd = room.time
        if (room.time === 0 && this.article.next) {
          this.changeUrl(this.article.next)
        }
      })
      socket.on('startRoom/' + uuid, (room) => {
        this.article.started = 1
      })
      socket.on('finishRoom/' + uuid, (room) => {
        this.article.finished = 1
      })
    }
  },
  mounted () {
    this.getArticle(this.$route.params.article)
    this.socket(this.$route.params.article)

    window.addEventListener('beforeunload', this.leaveRoom)
  },
  beforeUnmount () {
    this.leaveRoom()
    window.removeEventListener('beforeunload', this.leaveRoom)
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('beforeunload', this.leaveRoom)
    this.leaveRoom()
    next()
  },
  beforeRouteUpdate (to, from, next) {
    window.removeEventListener('beforeunload', this.leaveRoom)
    this.leaveRoom()
    this.getArticle(to.params.article)
    this.socket(to.params.article)
    next()
  }
}
</script>
