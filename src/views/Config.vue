<template>
  <div class="row">
    <div class="config-body col-md-9  order-md-2">
      <UpdatePass v-if="this.$route.path == '/updatePass'"></UpdatePass>
      <UpdateUser v-if="this.$route.path == '/updateUser'"></UpdateUser>
      <CreateCompany v-if="this.$route.path == '/createCompany'"></CreateCompany>
      <CreateCompany v-if="this.$route.name == 'updateCompany'"></CreateCompany>
      <MyCompanies v-if="this.$route.path == '/myCompanies'"></MyCompanies>
      <CreateAuction v-if="this.$route.path == '/createAuction'"></CreateAuction>
      <CreateAuction v-if="this.$route.name == 'updateAuction'"></CreateAuction>
      <MyAuctions v-if="this.$route.path == '/myAuctions'"></MyAuctions>
      <MyAuction v-if="this.$route.name == 'myAuction'"></MyAuction>
      <CreateArticle v-if="this.$route.name == 'addArticle'"></CreateArticle>
      <MyArticle v-if="this.$route.name == 'myArticle'"></MyArticle>
      <CreateArticle v-if="this.$route.name == 'updateArticle'"></CreateArticle>
      <BidForAuction v-if="this.$route.name == 'bidForAuction'"></BidForAuction>
    </div>
    <Link class="link col-md-3 order-md-1"></Link>
  </div>
</template>
<style>
@import '@/assets/config.css';
</style>

<script>
import Link from '@/components/link.vue'
import UpdatePass from '@/components/user/updatePass.vue'
import UpdateUser from '@/components/user/updateUser.vue'
import CreateCompany from '@/components/company/createCompany.vue'
import MyCompanies from '@/components/company/myCompanies.vue'
import CreateAuction from '@/components/auction/createAuction.vue'
import MyAuctions from '@/components/auction/myAuctions.vue'
import MyAuction from '@/components/auction/myAuction.vue'
import CreateArticle from '@/components/article/createArticle.vue'
import MyArticle from '@/components/article/myArticle.vue'
import BidForAuction from '@/components/bid/bidForAuction.vue'
export default {
  name: 'ConfigView',
  components: {
    Link,
    UpdatePass,
    UpdateUser,
    CreateCompany,
    MyCompanies,
    CreateAuction,
    MyAuctions,
    MyAuction,
    CreateArticle,
    MyArticle,
    BidForAuction
  },
  watch: {
    '$store.state.session': {
      handler () {
        if (!this.$store.state.session) {
          this.$router.push({ name: 'home' })
        }
      },
      deep: true
    }
  },
  mounted () {
    if (!this.$store.state.session) {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
