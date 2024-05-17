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
                                    <Article  :article="ar" ></Article>
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
import Article from '@/components/article/article'
import { get } from '@/fetch.js'
export default {
  name: 'AuctionBasic',
  components: {
    Article
  },
  data () {
    return {
      auction: {},
      articles: []
    }
  },
  methods: {
    async getAuction () {
      this.$store.state.isLoading = true
      const json = await get('/auction/' + this.$route.params.uuid, 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
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
    }
  },
  mounted () {
    this.getAuction()
  }
}
</script>
