<template>
  <h4>Cambiar Contraseña</h4>
  <br />
  <form @submit.prevent="update" >
    <label >Antigua contraseña: </label> <br/>
    <input type="password" v-model="body.oldPassword" required />
    <error  v-if="error.oldPassword" >{{error.oldPassword}}</error>
    <br>
    <label >Nueva contraseña: </label> <br/>
    <input type="password" v-model="body.password" required />
    <error  v-if="error.password" >{{error.password}}</error>
    <br>
    <label >Repita la contraseña: </label> <br/>
    <input type="password" v-model="body.repetitionPass" required />
    <div  v-if="error.repetitionPass" >{{error.repetitionPass}}</div>
    <br>
    <div class="error" v-if="save" style="background-color:#5f5" >Se cambio la contraseña correctamente</div>
    <error v-if="typeof error == 'string'">{{error}}</error>
    <br>
    <button class=" btn btn-outline-success" type="submit">
      Actualizar
    </button>
  </form>
</template>

<script>
import { post } from '@/fetch.js'
import Error from '@/components/inputError'
export default {
  name: 'UpdatePass',
  data () {
    return {
      body: { oldPassword: '', password: '', repetitionPass: '' },
      error: [],
      save: false
    }
  },
  components: {
    Error
  },
  methods: {
    async update () {
      this.$store.state.isLoading = true
      const body = JSON.stringify(this.body)
      const json = await post('/userUpdatePassword', 'PUT', this.$store.state.token, body)
      if (json.error) {
        this.error = json.error
        this.save = false
      } else {
        this.error = []
        this.save = true
      }
      this.$store.state.isLoading = false
    }
  }
}
</script>
