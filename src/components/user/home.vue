<template>
   <div class="container">
        <div class="row  justify-content-center  ">
              <div class="container">
                  <div>
                      <p tabindex="0" role="presentation">Remates:</p>
                      <hr>
                      <ul>
                          <div v-if="auctions.length==0" tabindex="0" role="presentation">No hay remates</div>
                          <div v-else>
                            <div v-for="(auc, index) in auctions" :key="index">
                                <div>
                                    <auction role="button" tabindex="0" :auction="auc" ></auction>
                                </div>
                                <br>
                            </div>
                          </div>
                    </ul>
                  </div>
              </div>
        </div>
    </div>
</template>
<style>
@import '@/assets/marco.css';
@import '@/assets/auction.css';
</style>

<script>
import Auction from '@/components/auction/auction'
import { get } from '@/fetch.js'
export default {
  name: 'Home_',
  components: {
    Auction
  },
  data () {
    return {
      isLoading: false,
      error: null,
      auctions: []
    }
  },
  methods: {
    async getAuctions () {
      this.$store.state.isLoading = true
      const json = await get('/auctionsNotFinished', 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        const moment = require('moment')
        moment.locale('es')
        this.auctions = json.content.auctions.sort(function (a, b) {
          return moment(a.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ') - moment(b.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ')
        })
      }
      this.$store.state.isLoading = false
    }
  },
  mounted () {
    this.getAuctions()
  }
}
</script>
