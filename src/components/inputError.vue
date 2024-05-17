<template>
  <div v-if="typeof error != 'string'" >
    <div class="errorContainer" v-for="(e, index) in error" :key="index">
      <div class="error">{{ e }}</div>
    </div>
  </div>
  <div v-if="typeof error == 'string'" >
    <div class="errorContainer" >
      <div class="error">{{ error }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'errorBasic',
  data () {
    return {}
  },
  props: ['error'],
  components: {}
}
</script>
