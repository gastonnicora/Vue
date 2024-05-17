<template>
  <h1 v-if="this.$route.name === 'updateCompany'"> Actualizar Empresa</h1>
  <h1 v-else> Crear Empresa</h1>
  <hr>
  <form @submit.prevent="createCompany()" id="form">
    <label >Nombre: </label> <br/>
    <input v-model="this.company.name" maxlength="255" >
    <error v-if="error && error.name">{{ this.error.name }}</error>
    <br>
    <label >Dirección: </label> <br/>
    <input v-model="this.company.address" maxlength="255" >
    <error v-if="error && error.address">{{ this.error.address}}</error>
    <br>
    <error  v-if="typeof error == 'string'" :error="error"></error>
    <div v-if="this.$route.name === 'updateCompany'"  >
      <button class=" btn btn-outline-danger" @click="cancel()" type="button" style="margin: 1rem;">
        Cancelar
      </button>
      <button class=" btn btn-outline-success" type="submit" style="margin: 1rem;">
        Actualizar
      </button>
  </div>
  <button v-else class=" btn btn-outline-success" type="submit">
        Guardar
    </button>
  </form>
</template>

<script>
import { get, post } from '@/fetch.js'
import Error from '@/components/inputError'
export default {
  name: 'CreateCompany',
  data () {
    return {
      error: null,
      company: {
        uuid: this.$route.params.uuid,
        name: '',
        address: ''
      },
      company2: {
        uuid: this.$route.params.uuid,
        name: '',
        address: ''
      }
    }
  },
  components: {
    Error
  },
  methods: {
    async createCompany () {
      this.$store.state.isLoading = true
      const body = JSON.stringify(this.company)
      if (this.$route.name === 'updateCompany') {
        const json = await post('/companyUpdate ', 'PUT', this.$store.state.token, body)
        if (json.error) {
          this.error = json.error
        } else {
          this.error = json.error
          alert('Empresa actualizada correctamente')
          this.$router.push({ name: 'myCompanies' })
        }
      } else {
        const json = await post('/companyCreate ', 'POST', this.$store.state.token, body)
        if (json.error) {
          this.error = json.error
        } else {
          this.error = json.error
          alert('Empresa creada correctamente')
          this.$router.push({ name: 'myCompanies' })
        }
      }
      this.$store.state.isLoading = false
    },
    async getCompany () {
      this.$store.state.isLoading = true
      const json = await get('/company/' + this.$route.params.uuid, 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        this.company = json.content
        this.company2 = { ...this.company }
      }
      this.$store.state.isLoading = false
    },
    cancel () {
      this.company = { ...this.company2 }
    }
  },
  mounted () {
    if (this.$route.name === 'updateCompany') {
      this.getCompany()
    }
  }
}
</script>
