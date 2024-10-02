<template>
  <div v-if="bids && bids.bids && bids.bids.length=== 0" tabindex="0" role="presentation">No hay pujas realizadas</div>
  <table v-else class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Puja</th>
      </tr>
    </thead>
    <tbody  v-for="(bid, index) in bids.bids" :key="index" class="article">
      <tr>
        <th scope="row">{{index + 1}}º</th>
        <td v-if="bid.dataUser">{{bid.dataUser.name}} {{bid.dataUser.lastName}}</td>
        <td v-else></td>
        <td v-if="bid.value">$ {{bid.value}}</td>
        <td v-else></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { get } from '@/fetch.js'
export default {
  name: 'ArticleView',
  data () {
    return {
      error: '',
      bids: {}
    }
  },
  props: ['article'],
  methods: {
    async getBid () {
      this.$store.state.isLoading = true
      const json = await get('/bidByArticle/' + this.article, 'GET', this.$store.state.token)
      if (json.error) {
        alert(json.error)
        this.$router.go(-1)
      } else {
        this.bids = json.content
      }
      this.$store.state.isLoading = false
    }
  },
  mounted () {
    if (this.article) {
      this.getBid()
    }
  },
  watch: {
    article: {
      handler () {
        if (this.article) {
          this.getBid()
        }
      },
      deep: true
    }
  }
}
</script>
