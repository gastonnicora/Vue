<template>
  <div class="container">
       <div class="row  justify-content-center  ">
             <div class="container">
                 <div>
                  <div class="edit"  v-if="auction.finished">
                     <router-link :to="'/bidForAuction/'+ auction.uuid" class="btn  btn-outline-primary" >
                      <font-awesome-icon :icon="['fas', 'gavel']" />
                     </router-link>
                   </div>
                   <div v-if="auction.dataCompany" >Empresa: {{ auction.dataCompany.name }}<br>
                    Direccion: {{ auction.dataCompany.address }}<br>
                    <div > Comienza: {{time(auction.dateStart)}} </div>
                    <div v-if="auction.type==0"> Finaliza: {{time(auction.dateFinish)}} </div>
                  </div>
                   {{ auction.description }} <br>
                     <p tabindex="0" role="presentation">Articulos:</p>
                     <hr>
                        <div v-if="articles.length=== 0" tabindex="0" role="presentation">No hay articulos</div>
                        <table v-else class="table">
                          <thead>
                            <tr>
                              <th scope="col">Articulo</th>
                              <th scope="col">Ganador</th>
                              <th scope="col">Puja</th>
                            </tr>
                          </thead>
                          <tbody  v-for="(ar, index) in articles" :key="index" class="article">
                            <tr>
                              <th scope="row"><img class="imgBid" :src="ar.urlPhoto" :alt="ar.description"></th>
                              <td v-if="ar.dataBid && ar.dataBid.dataUser">{{ar.dataBid.dataUser.name}} {{ar.dataBid.dataUser.lastName}}</td>
                              <td v-else></td>
                              <td v-if="ar.dataBid && ar.dataBid.value">$ {{ar.dataBid.value}}</td>
                              <td v-else></td>
                            </tr>
                          </tbody>
                        </table>
                 </div>
             </div>
       </div>
   </div>
</template>

<style>
@import '@/assets/auction.css';
</style>
<script>
import { get } from '@/fetch.js'
export default {
  name: 'BidForAuction',
  data () {
    return {
      auction: {},
      articles: [],
      error: ''
    }
  },
  methods: {
    async getAuction () {
      this.$store.state.isLoading = true
      const json = await get('/auction/' + this.$route.params.uuid, 'GET', this.$store.state.token)
      this.error = json.error
      if (json.error) {
        alert(json.error)
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
    }
  },
  mounted () {
    this.getAuction()
  }
}
</script>
