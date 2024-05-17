<template>
  <div class="item" type="button" data-bs-toggle="collapse" @click="toggleCollapse"  :data-bs-target="'#collapse'+company.uuid" aria-expanded="false"
    :aria-controls="'collapse'+company.uuid">
      <div>{{company.name}} </div>
      <font-awesome-icon :icon="['fas', isCollapsed ? 'chevron-down' : 'chevron-up']" />
  </div>
    <br>
  <div class="collapse " :id="'collapse'+company.uuid">
        <div class="row  justify-content-center  ">
              <div class="container">
                  <div>
                      <p tabindex="0" role="presentation">Remates:</p>
                      <hr>
                      <ul>
                          <div v-if=" !auctions || auctions.length==0" tabindex="0" role="presentation">Esta empresa no tiene remates</div>
                          <div v-else-if="auctions && auctions.length!=0">
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
<script>
import Auction from '@/components/auction/auction'
import { get } from '@/fetch.js'
export default {
  name: 'ListAuction',
  props: [
    'company'
  ],
  components: {
    Auction
  },
  data () {
    return {
      error: null,
      auctions: [],
      isCollapsed: true
    }
  },
  methods: {
    async getAuctions () {
      this.$store.state.isLoading = true
      const json = await get('/auctionsByCompany/' + this.company.uuid, 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        if (!json.content.auctions) {
          this.auctions = json.content.auctions
        } else {
          const moment = require('moment')
          moment.locale('es')
          this.auctions = json.content.auctions.sort(function (a, b) {
            if (a.finished < b.finished) return 1
            if (a.finished > b.finished) return 1
            else {
              return moment(a.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ') - moment(b.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ')
            }
          })
        }
      }
      this.$store.state.isLoading = false
    },
    toggleCollapse () {
      this.isCollapsed = !this.isCollapsed
    }
  },
  mounted () {
    this.getAuctions()
  }
}
</script>
