<template>
  <div class="container">
       <div class="row  justify-content-center  ">
             <div class="container">
                 <div>
                  <div class="edit"  v-if="auction.finished">
                     <router-link :to="'/bidForAuction/'+ auction.uuid" class="btn  btn-outline-success" >
                      <font-awesome-icon :icon="['fas', 'gavel']" />
                     </router-link>
                   </div>
                   <div class="edit"  v-if="today(auction.dateStart)">
                     <router-link :to="'/updateAuction/'+ auction.uuid" class="btn  btn-outline-primary" >
                       <font-awesome-icon :icon="['fas', 'pen']" />
                     </router-link>
                     <button @click="this.delete()" class="btn btn-outline-danger " >
                       <font-awesome-icon :icon="['fas', 'trash-can']" />
                     </button>
                   </div>
                   <div v-if="auction.dataCompany" >Empresa: {{ auction.dataCompany.name }}<br>
                    Direccion: {{ auction.dataCompany.address }}<br>
                    <div > Comienza: {{time(auction.dateStart)}} </div>
                    <div v-if="auction.type==0"> Finaliza: {{time(auction.dateFinish)}} </div>
                  </div>
                   {{ auction.description }} <br>
                     <p tabindex="0" role="presentation">Articulos:</p>
                     <hr>
                     <router-link :to="this.$route.path+'/addArticle'" v-if="today(auction.dateStart)" class="btn  btn-outline-success" >
                      <font-awesome-icon :icon="['fas', 'pen']" /> Agregar Articulo
                    </router-link>
                    <br v-if="today(auction.dateStart)">
                    <br v-if="today(auction.dateStart)">
                        <div v-if="articles.length=== 0" tabindex="0" role="presentation">No hay articulos</div>
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
  name: 'MyAuction',
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
      let next = ''
      for (let i = 0; i < articles.length; i++) {
        if (!articles[i].before) {
          let first = {}
          first = articles[i]
          this.articles.push(first)
          next = first.next
          break
        }
      }
      while (next) {
        const n = articles.find(objeto => objeto.uuid === next)
        if (n) {
          this.articles.push(n)
          next = n.next
        } else {
          next = n
        }
      }
    },
    today (dateStart) {
      const moment = require('moment')
      moment.locale('es')
      return moment(dateStart, 'DD/MM/YYYYTHH:mm:ssZZ') > moment()
    },
    async delete () {
      const aceptar = confirm('¿Estás seguro de que deseas eliminar este remate?')
      if (aceptar) {
        this.$store.state.isLoading = true
        const json = await get('/auctionDelete/' + this.$route.params.uuid, 'DELETE', this.$store.state.token)
        if (json.error) {
          alert(json.error)
        } else {
          alert('Remate eliminado')
          this.$router.push({ name: 'myAuctions' })
        }
        this.$store.state.isLoading = false
      }
    }
  },
  mounted () {
    this.getAuction()
  }
}
</script>
