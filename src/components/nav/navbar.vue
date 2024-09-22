<template>
  <nav class="nav navbar sticky-top">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <div
          style="padding: 0rem 0.5rem"
          @click="this.$router.go(-1)"
          role="button"
          aria-label="volver"
          tabindex="0"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </div>
      </li>
    </ul>

    <ul class="navbar-nav">
      <li>
        <router-link class="navbar-brand" to="/" aria-label="ir a pagina principal">
          Inicio
        </router-link>
      </li>
    </ul>
    <ul
      class="navbar-nav ml-auto list-group"
      style="right: 0; flex-direction: row"
    >
    <li class="nav-item dropdown" v-if="this.$store.state.session == null">
      <RouterLink :to="'/start'" class="noLink" style="text-decoration: none"> Iniciar Sesión </RouterLink>
    </li>
      <li class="nav-item dropdown " v-if="this.$store.state.session ">
        <RouterLink class="noLink" style="text-decoration: none; margin-right: 1rem" :to="'/'">
          <font-awesome-icon :icon="['fas', 'cart-shopping']" />
        </RouterLink>
        <a
          role="button"
          tabindex="0"
          class="nav-link dropdown-toggle "
          style="padding: 0rem 0.5rem"
          href="#"
          data-bs-toggle="dropdown"
          id="navbarDropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="configuración de usuario"
        >
          <font-awesome-icon :icon="['fas', 'bars']" />
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <div class="dropdown-divider" v-if="this.$store.state.session "></div>
          <RouterLink :to="'/updateUser'" class="dropdown-item"  v-if="this.$store.state.session " ><font-awesome-icon :icon="['fas', 'user-pen']" />Editar Perfil</RouterLink>
          <div class="dropdown-divider" v-if="this.$store.state.session "></div>
          <RouterLink :to="'/updatePass'" class="dropdown-item"  v-if="this.$store.state.session " ><font-awesome-icon :icon="['fas', 'key']" /> Cambiar Contraseña</RouterLink>
          <div class="dropdown-divider" v-if="this.$store.state.session "></div>
          <RouterLink :to="'/createCompany'" class="dropdown-item"  v-if="this.$store.state.session " ><font-awesome-icon :icon="['fas', 'building']" /> Crear empresa </RouterLink>
          <div class="dropdown-divider" v-if="this.$store.state.session  && this.$store.state.session.companies  && this.$store.state.session.companies.companies && this.$store.state.session.companies.companies.length!=0"></div>
          <RouterLink :to="'/myCompanies'" class="dropdown-item"  v-if="this.$store.state.session  && this.$store.state.session.companies  && this.$store.state.session.companies.companies && this.$store.state.session.companies.companies.length!=0" ><font-awesome-icon :icon="['fas', 'building']" /> Tus empresas </RouterLink>
          <div class="dropdown-divider" v-if="this.$store.state.session  && this.$store.state.session.companies  && this.$store.state.session.companies.companies &&  this.$store.state.session.companies.companies.length!=0"></div>
          <RouterLink :to="'/myAuctions'" class="dropdown-item" v-if="this.$store.state.session  && this.$store.state.session.companies  && this.$store.state.session.companies.companies &&  this.$store.state.session.companies.companies.length!=0"  ><font-awesome-icon :icon="['fas', 'dollar-sign']" /> Remates </RouterLink>
          <div class="dropdown-divider" v-if="this.$store.state.session "></div>
          <a
            to="#"
            role="button"
            tabindex="0"
            v-on:keyup.enter="cerrarSesion()"
            class="dropdown-item"
            @click="cerrarSesion()"
            ><font-awesome-icon :icon="['fas', 'door-closed']" /> Cerrar
            Sesión</a
          >
        </div>
      </li>
    </ul>
  </nav>
</template>
<style>
@import '@/assets/navbar.css';
</style>
<script>
import { socket } from '@/socket.js'
import { get } from '@/fetch.js'
export default {
  name: 'Navbar_',
  data () {
    return {
      isLoading: false,
      user: this.$store.state.session
    }
  },
  methods: {
    async cerrarSesion () {
      this.$store.state.isLoading = true
      const user = this.$store.state.session
      socket.emit('borrarUser', { data: 'borrando usuario' })
      await get('/logout', 'GET', this.$store.state.token)
      socket.emit('leave_session', { name: user.name, lastName: user.lastName, uuid: user.uuid, email: user.email })
      this.$store.state.session = null
      localStorage.removeItem('sesion')
      localStorage.removeItem('token')
      this.$store.state.token = null
      this.$store.state.isLoading = false
    }
  },
  mounted () {
  }
}
</script>
