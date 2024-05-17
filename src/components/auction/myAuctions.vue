<template >
  <br>
  <div v-if="this.$store.state.session">
    <div  v-for="(company,i)  in this.$store.state.session.companies.companies" :key=i>
      <ListAuction :company="company"></ListAuction>
    </div>
  </div>
</template>
<style>
  @import '@/assets/marco.css';
  @import '@/assets/auction.css';
  @import '@/assets/yourAuction.css';
</style>
<script>
import ListAuction from '@/components/auction/listAuction'
export default {
  name: 'myAuctions',
  components: {
    ListAuction
  }
}
</script>
