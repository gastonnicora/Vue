<template>
   <router-link v-if="this.article.auction && this.$route.name != 'myArticleB'" :to="'/auction/'+this.article.auction" class="btn  btn-link" style="display:table" >
    <font-awesome-icon :icon="['fas', 'arrow-left']" /> Volver al remate
    </router-link>
    <br v-else>

  <img class="imgArticle" :src="article.urlPhoto" :alt="article.description"><br>
  {{ article.description }} <br>
  <div v-if="article.type==0"> Comienza: {{time(article.dateOfStart)}} </div>
  <div v-if="article.type==0"> Finaliza: {{time(article.dateOfFinish)}} </div>
  Base: ${{ article.minValue}} <br>
  Aumento entre pujas: ${{ article.minStepValue }}
  <p v-if="this.article.dataBid && this.article.dataBid.dataUser && this.$store.state.session && this.article.dataBid.dataUser.uuid==this.$store.state.session.uuid"> Usted pujo: ${{this.article.dataBid.value}} </p>
  <p v-if="this.article.dataBid && this.article.dataBid.dataUser && this.$store.state.session && this.article.dataBid.dataUser.uuid!=this.$store.state.session.uuid"> Ultima puja: ${{this.article.dataBid.value}} </p>
  <p v-if="this.article.dataBid && this.article.dataBid.dataUser && !this.$store.state.session"> Ultima puja: ${{this.article.dataBid.value}} </p>
  <div v-if="timeOfEnd!= 0">Tiempo para que termine: {{ timeOfEnd }}</div>
  <div v-if="this.$store.state.session && article.started==1 && article.finished==0">

  <error v-if="typeof error == 'string'" :error="error"></error>
  <button class="btn btn-outline-success" :disabled="this.article.dataBid && this.article.dataBid.dataUser && this.$store.state.session && this.article.dataBid.dataUser.uuid==this.$store.state.session.uuid" v-if=" this.article.dataBid && this.article.dataBid.value" @click="postBid((article.dataBid.value + article.minStepValue  ))">pujar ${{ (article.dataBid.value + article.minStepValue  )  }}</button>
  <button  class="btn btn-outline-success" v-else @click="postBid(( article.minValue ))">pujar ${{ (article.minValue )  }}</button>
 </div>
 <br/>
 <div>
 <button  class="btn btn-outline-primary button"  id="before" v-if="this.article.before && this.$route.name != 'myArticleB'" @click="changeUrl(article.before)"><font-awesome-icon :icon="['fas', 'chevron-left']" />Articulo anterior</button>
 <button   class="btn btn-outline-primary button" id="next" v-if="this.article.next && this.$route.name != 'myArticleB'" @click="changeUrl(article.next)">Articulo siguiente<font-awesome-icon :icon="['fas', 'chevron-right']"/> </button>
 <div v-if="this.$route.name == 'myArticleB'">
  <hr>
  <h4>Datos de la empresa</h4>
   <div v-if="auction.dataCompany" >Empresa: {{ auction.dataCompany.name }}<br>
                    Direccion: {{ auction.dataCompany.address }}<br>
    </div>
 </div>
</div>
</template>
<style>
@import '@/assets/article.css';

</style>
<script>
import { get, post } from '@/fetch.js'
import { socket } from '@/socket.js'
import Error from '@/components/inputError'
export default {
  name: 'ArticleView',
  data () {
    return {
      article: {},
      error: '',
      users: [],
      timeOfEnd: 0,
      auction: {},
      errorBid: ''
    }
  },
  components: {
    Error
  },
  methods: {
    time (date) {
      const moment = require('moment')
      moment.locale('es')
      return moment(date, 'DD/MM/YYYYTHH:mm:ssZZ').format('LLLL')
    },
    async getArticle (uuid) {
      this.$store.state.isLoading = true
      const json = await get('/article/' + uuid, 'GET', this.$store.state.token)
      this.error = json.error
      if (json.error) {
        alert(this.error)
        this.$router.go(-1)
      } else {
        this.article = json.content
        if (this.$route.name === 'myArticleB') {
          this.getAuction()
        }
      }
      this.$store.state.isLoading = false
    },
    async postBid (value) {
      this.$store.state.isLoading = true
      const body = JSON.stringify({ value, article: this.article.uuid })
      const json = await post('/bidCreate', 'POST', this.$store.state.token, body)
      if (json.error) {
        this.errorBid = json.error
      } else {
        console.log('hola')
      }
      this.$store.state.isLoading = false
    },
    leaveRoom () {
      socket.emit('leave', { room: this.$route.params.uuid })
      socket.off('joinToRoom/' + this.$route.params.uuid)
      socket.off('bidRoom/' + this.$route.params.uuid)
      socket.off('countdown/' + this.$route.params.uuid)
      socket.off('startRoom/' + this.$route.params.uuid)
      socket.off('finishRoom/' + this.$route.params.uuid)
    },
    changeUrl (uuid) {
      this.$router.push({ name: 'article', params: { uuid } })
    },
    socket (uuid) {
      socket.emit('join', { room: uuid })
      socket.on('joinToRoom/' + uuid, (room) => {
        console.log(room)
        this.users = room.users
      })
      socket.on('bidRoom/' + uuid, (bid) => {
        this.article.dataBid = bid
      })
      socket.on('countdown/' + uuid, (room) => {
        console.log(room.time)
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
        if (this.article.next) {
          this.changeUrl(this.article.next)
        }
      })
    },

    async getAuction () {
      this.$store.state.isLoading = true
      const json = await get('/auction/' + this.article.auction, 'GET', this.$store.state.token)
      this.error = json.error
      if (json.error) {
        alert(this.error)
        this.$router.go(-1)
      } else {
        this.auction = json.content
      }
      this.$store.state.isLoading = false
    }
  },
  mounted () {
    this.getArticle(this.$route.params.uuid)
    this.socket(this.$route.params.uuid)

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
    console.log(to.name)
    if (to.name === 'article' || to.name === 'myArticleB') {
      this.getArticle(to.params.uuid)
      this.timeOfEnd = 0
      this.socket(to.params.uuid)
    }
    next()
  }
}
</script>
