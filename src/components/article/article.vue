<template>
  <RouterLink v-if="this.$route.name=== 'myAuction'" :to="this.$route.path + '/myArticle/' + article.uuid" class="noLink" style="text-decoration: none">
    <div class="marco">
      <div class="center">
        <div v-if="article.started === 1 && article.finished === 0" class="started">Comenzó</div>
        <div v-if="article.started === 1 && article.finished === 1" class="finished">Finalizó</div>
        <img class="imgAuction" :src="article.urlPhoto" :alt="article.description">
      </div>
    </div>
  </RouterLink>
  <RouterLink v-else :to="'/article/' + article.uuid" class="noLink" style="text-decoration: none">
    <div class="marco">
      <div class="center">
        <div v-if="article.started === 1 && article.finished === 0" class="started">Comenzó</div>
        <div v-if="article.started === 1 && article.finished === 1" class="finished">Finalizó</div>
        <img class="imgAuction" :src="article.urlPhoto" :alt="article.description">
      </div>
    </div>
  </RouterLink>
</template>

<script>
export default {
  name: 'Article_',
  props: ['article']
}
</script>
