<template>
  <div class="d-flex flex-column justify-content-center">
    <h4>Bienvenido</h4>
    <br>
    <p>Hola le damos la bienvenida a remates</p>
    <p>Su email ya fue confirmado. Por favor inicie sesión para comprar productos </p>
  </div>
</template>

<script>
import { get } from '@/fetch.js'
export default {
  name: 'ConfirmEmail',
  data () {
    return {
      login: true
    }
  },
  methods: {
    async get () {
      this.$store.state.isLoading = true
      const json = await get('/confirmEmail/' + this.$route.params.uuid, 'GET', this.$store.state.token)
      if (json.error) {
        alert(json.error)
        this.$router.push({ name: 'home', params: {} })
      }
      this.$store.state.isLoading = false
    }
  },
  mounted () {
    this.get()
  }
}
</script>
