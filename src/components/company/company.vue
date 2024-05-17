<template>
 <div  class="marco" >
    <div class="row d-flex  justify-content-center">
      <div class="edit"  >
        <router-link :to="'/updateCompany/'+company.uuid"  class="btn  btn-outline-primary" >
          <font-awesome-icon :icon="['fas', 'pen']" />
        </router-link>
        <button class="btn btn-outline-danger " @click="this.delete()" >
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </button>
      </div>
      Nombre: {{company.name}}
      <br>
      Direccion: {{company.address}}
    </div>
  </div>
</template>
<script>
import { get } from '@/fetch.js'
export default {
  name: 'MyCompany',
  components: {
  },
  methods: {
    async delete () {
      const aceptar = confirm('¿Estás seguro de que deseas eliminar esta empresa?')
      if (aceptar) {
        this.$store.state.isLoading = true
        const json = await get('/companyDelete/' + this.company.uuid, 'DELETE', this.$store.state.token)
        if (json.error) {
          alert(json.error)
        } else {
          alert('Empresa eliminada')
          this.$router.push({ name: 'myCompanies' })
        }
        this.$store.state.isLoading = false
      }
    }
  },
  props: [
    'company'
  ],
  mounted () {
  }
}
</script>
