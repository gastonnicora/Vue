<template>
  <h4><font-awesome-icon :icon="['fas', 'door-open']" /> Registrarse</h4>
  <br />
  <form @submit.prevent="registrarse" id="form">
    <label for="email">Nombre: </label> <br/>
    <input type="text" v-model="user.name" required />
    <error  v-if="error.name" :error="error.name"></error>
    <br/>
    <label for="email">Apellido: </label> <br/>
    <input type="text" v-model="user.lastName" required />
    <error  v-if="error.lastName" :error="error.lastName"></error>
    <br/>
    <label for="email">Email: </label> <br/>
    <input type="text" v-model="user.email" required />
    <error  v-if="error.email" :error="error.email"></error>
    <br />
    <label for="pass">Contraseña: </label> <br/>
    <input type="password" v-model="user.password" name="pass" />
    <error  v-if="error.password" :error="error.password"></error>
    <br/>
    <label for="pass">Repita la contraseña: </label> <br/>
    <input type="password" v-model="user.repetitionPass"  />
    <error  v-if="error.repetitionPass" :error="error.repetitionPass"></error>
    <br/>
    <label for="pass">Nacimiento: </label> <br/>
    <input type="date" v-model="user.birthday" @change="date()" pattern="\d{2}/\d{2}/\d{4}"  />
    <error  v-if="error.birthdate" :error="error.birthdate"></error>
    <br/>
    <error  v-if="typeof error == 'string'" :error="error"></error>
    <button class=" btn btn-outline-success" type="submit">
      <font-awesome-icon :icon="['fas', 'user-plus']" />
      Registrarse
    </button>
  </form>
  <br />
  <hr/>
  <button @click="login(true)" class=" btn btn-outline-primary">
    <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" /> Iniciar Sesión
    </button>
</template>

<script>
import { post } from '@/fetch.js'
import Error from '@/components/inputError'
export default {
  name: 'CheckIn',
  data () {
    return {
      isLoading: false,
      error: {},
      user: { name: '', lastName: '', email: '', password: '', repetitionPass: '', birthdate: '' }
    }
  },
  props: ['login'],
  components: {
    Error
  },

  methods: {
    async registrarse () {
      this.$store.state.isLoading = true
      const body = JSON.stringify(this.user)
      const json = await post('/userCreate', 'POST', null, body)
      this.error = json.error
      this.$store.state.isLoading = false
      if (!this.error) {
        alert('Se ha creado su usuario. Por favor valide su email e inicie sesión')
        this.login(true)
      }
    },
    date () {
      const moment = require('moment')
      this.user.birthdate = moment(this.user.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY')
    }
  }
}
</script>
