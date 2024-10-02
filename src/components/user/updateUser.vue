<template>
  <h4><font-awesome-icon :icon="['fas', 'user-pen']" /> Editar Perfil</h4>
  <br />
  <form @submit.prevent="update" >
    <label >Nombre: </label> <br/>
    <input type="text" v-model="user.name" required />
    <error  v-if="error.name" >{{error.name}}</error>
    <br/>
    <label >Apellido: </label> <br/>
    <input type="text" v-model="user.lastName" required />
    <error  v-if="error.lastName" >{{error.lastName}}</error>
    <br/>
    <label for="pass">Nacimiento: </label> <br/>
    <input type="date" v-model="birthdate" @change="date()" name="birthdate" id="birthdate"  required />
    <error  v-if="error.birthdate" >{{error.birthdate}}</error>
    <br/> <br>
    <div class="error" v-if="save" style="background-color:#5f5" >El perfil se edito correctamente</div>
    <error v-if="typeof error == 'string'" >{{error}}</error>
    <button class=" btn btn-outline-danger" @click="cancel()" type="button" style="margin: 1rem;">
        Cancelar
      </button>
    <button class=" btn btn-outline-success" type="submit">
      <font-awesome-icon :icon="['fas', 'user-pen']" />
      Actualizar
    </button>
  </form>
</template>

<script>
import { post } from '@/fetch.js'
import Error from '@/components/inputError'
export default {
  name: 'UpdateUser',
  data () {
    return {
      user: { name: '', lastName: '', birthdate: '' },
      error: [],
      birthdate: '',
      save: false
    }
  },
  components: {
    Error
  },
  methods: {
    async update () {
      this.$store.state.isLoading = true
      const body = JSON.stringify(this.user)
      const json = await post('/userUpdate', 'PUT', this.$store.state.token, body)
      this.error = json.error
      if (json.error) {
        this.save = false
      } else {
        this.save = true
      }
      this.$store.state.isLoading = false
    },
    initializeDate () {
      const moment = require('moment')
      const birthdate = moment(this.$store.state.session.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      let today = new Date()
      let dd = today.getDate() - 1
      let mm = today.getMonth() + 1
      const yyyy = today.getFullYear()

      if (dd < 10) {
        dd = '0' + dd
      }

      if (mm < 10) {
        mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd
      document.getElementById('birthdate').setAttribute('max', today)
      document.getElementById('birthdate').value = birthdate
      this.birthdate = birthdate
    },
    date () {
      const moment = require('moment')
      this.user.birthdate = moment(this.birthdate, 'YYYY-MM-DD').format('DD/MM/YYYY')
    },
    cancel () {
      this.user = { ...this.$store.state.session }
      this.initializeDate()
    }
  },
  mounted () {
    this.user = { ...this.$store.state.session }
    this.initializeDate()
  }
}
</script>
