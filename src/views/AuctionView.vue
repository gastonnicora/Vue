<template>
   <div class="container">
        <div class="row  justify-content-center  ">
              <div class="container">
                  <div>
                    <div v-if="auction.dataCompany" >Empresa: {{ auction.dataCompany.name }}<br>
                    Direccion: {{ auction.dataCompany.address }}<br>

                  <div > Comienza: {{time(auction.dateStart)}} </div>
                  <div v-if="auction.type==0"> Finaliza: {{time(auction.dateFinish)}} </div>
                  </div>
                    {{ auction.description }} <br>
                      <p tabindex="0" role="presentation">Articulos:</p>
                      <hr>
                          <div v-if="articles.length== 0" tabindex="0" role="presentation">No hay articulos</div>
                          <div v-else class="contenedor">
                            <div  v-for="(ar, index) in articles" :key="index" class="article">
                                    <Articles  :article="ar" ></Articles>
                            </div>
                          </div>
                  </div>
              </div>
        </div>
    </div>
</template>
<style>
@import '@/assets/auction.css';
</style>
<script>
import Articles from '@/components/article/article'
import { get } from '@/fetch.js'
import { socket } from '@/socket.js'
export default {
  name: 'AuctionBasic',
  components: {
    Articles
  },
  data () {
    return {
      auction: {},
      articles: [],
      error: null
    }
  },
  methods: {
    async getAuction () {
      this.$store.state.isLoading = true
      const json = await get('/auction/' + this.$route.params.uuid, 'GET', this.$store.state.token)
      this.error = json.error
      if (json.error) {
        alert(this.error)
        this.$router.go(-1)
      } else {
        this.auction = json.content
        if (this.auction.articles.articles) {
          this.order(this.auction.articles.articles)
        }
      }
      this.$store.state.isLoading = false
    },
    time (date) {
      const moment = require('moment')
      moment.locale('es')
      return moment(date, 'DD/MM/YYYYTHH:mm:ssZZ').format('LLLL')
    },
    order (articles) {
      let first = {}
      for (let i = 0; i < articles.length; i++) {
        if (!articles[i].before) {
          first = articles[i]
          break
        }
      }
      if (first.uuid) {
        this.articles.push(first)
        let next = first.next
        while (next) {
          const n = articles.find(objeto => objeto.uuid === next)
          if (n) {
            this.articles.push(n)
            next = n.next
          } else {
            next = n
          }
        }
      }
    },
    startAll () {
      for (let i = 0; i < this.articles.length; i++) {
        this.article[i].started = 1
      }
    },
    finishAll () {
      for (let i = 0; i < this.articles.length; i++) {
        this.article[i].started = 1
      }
    }
  },
  mounted () {
    this.getAuction()
    if (this.articles[0] && this.articles[0].type === 0) {
      const uuid = this.articles[0].uuid
      socket.emit('join', { room: uuid })
      socket.on('finishRoom/' + uuid, (room) => {
        this.art.finished = 1
        this.finishAll()
        this.leaveRoom()
      })
      socket.on('startRoom/' + uuid, (room) => {
        this.art.started = 1
        this.startAll()
      })
    }
  }
}
</script>
