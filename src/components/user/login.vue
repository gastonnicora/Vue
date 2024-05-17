<template>
  <h4><font-awesome-icon :icon="['fas', 'door-open']" /> Iniciar sesión</h4>
  <br />
  <form @submit.prevent="iniciarSesion" id="form">
    <label for="email">Email: </label> <br/>
    <input type="email" id="email" name="email" required />
    <error v-if="error && error.email">{{ this.error.email }}</error>
   <br />
    <label for="pass">Contraseña: </label> <br/>
    <input type="password" required id="pass" name="pass" />
    <error v-if="error && error.password">{{ this.error.password }}</error>
    <br />
    <error  v-if="typeof error == 'string'" :error="error"></error>
    <button class=" btn btn-outline-success" type="submit">
      <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
      Iniciar Sesión
    </button>
  </form>
  <br />
  <hr/>
  <button @click="login(false)" class=" btn btn-outline-primary">
      <font-awesome-icon :icon="['fas', 'user-plus']" /> Registrarse
    </button>
</template>

<script>
import { post } from '@/fetch.js'
import { socket } from '@/socket.js'
import Error from '@/components/inputError'
export default {
  name: 'UserLogin',
  data () {
    return {
      isLoading: false,
      error: null
    }
  },
  components: {
    Error
  },
  props: ['login'],

  methods: {
    async iniciarSesion () {
      this.$store.state.isLoading = true
      const email = document.getElementById('email').value
      const pass = document.getElementById('pass').value
      const body = JSON.stringify({ email: email, password: pass })
      const json = await post('/login', 'POST', null, body)
      if (json.error) {
        this.error = json.error
      } else {
        localStorage.setItem('sesion', JSON.stringify(json.content))
        this.$store.state.session = json.content

        localStorage.setItem('token', JSON.stringify(json.token))
        this.$store.state.token = json.token
        const user = this.$store.state.session
        socket.emit('coneccion', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
        this.$router.go(-1)
      }
      this.$store.state.isLoading = false
    }
  }
}
</script>
