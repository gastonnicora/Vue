<template>
  <RouterLink :to="to[this.$route.path]+''+ auction.uuid " class="noLink" style="text-decoration: none">
  <div  class="marco" >
    <div class="row d-flex  justify-content-center">
      <div class="dataCompany">Empresa: {{ auction.dataCompany.name }}<br>
      Direccion: {{ auction.dataCompany.addres }}<br></div>
      {{ auction.description }} <br>
      Comienzo: {{ time(auction.dateStart) }} <br>
      <div v-if="auction.type==0">Finaliza: {{ time(auction.dateFinish) }}</div>
      <div v-if="this.now > 0 && auction.finished!=1"> Comenzó {{ fromNow }}</div>
      <div v-if="this.now < 0 && auction.finished!=1"> Empieza {{ fromNow }}</div>
      <div v-if="auction.finished==1"> Finalizo </div>
      <div > {{auction.type}} </div>
    </div>
  </div>
</RouterLink>
</template>
<script>
export default {
  name: 'Auction_',
  components: {
  },
  data () {
    return {
      isLoading: false,
      fromNow: '',
      now: '',
      to: { '/': '/auction/', '/myAuctions': '/myAuction/' }
    }
  },
  methods: {
    time (date) {
      const moment = require('moment')
      moment.locale('es')
      return moment(date, 'DD/MM/YYYYTHH:mm:ssZZ').format('LLLL')
    }
  },
  props: [
    'auction'
  ],
  mounted () {
    const moment = require('moment')
    moment.locale('es')
    setInterval(() => {
      this.fromNow = moment(this.auction.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ').fromNow()
      this.now = moment() - moment(this.auction.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ')
    }, 1000)
  }
}
</script>
