<template>
   <div class="container">
      <div class="row  justify-content-center  ">
        <div class="container">
          <p tabindex="0" role="presentation">Articulos Comprados:</p>
          <hr>
          <div v-if="articles.length== 0" tabindex="0" role="presentation">No hay artículos</div>
          <div v-else class="contenedor">
            <div  v-for="(ar, index) in articles" :key="index" class="article">
              <Articles  :article="ar"  ></Articles>
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
export default {
  name: 'MyArticlesBasic',
  components: {
    Articles
  },
  data () {
    return {
      articles: []
    }
  },
  methods: {
    async getMyArticles () {
      this.$store.state.isLoading = true
      const json = await get('/myArticlesBought', 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        this.articles = json.content.articles
      }
      this.$store.state.isLoading = false
    }
  },
  mounted () {
    this.getMyArticles()
  }
}
</script>
