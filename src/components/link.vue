<template>
  <div class="links">
    <ul class="ul-nombre ">
      <li><div class="d-flex justify-content-start align-items-center"><font-awesome-icon :icon="['fas', 'user']" /> Usuario</div>
        <ul class="ul-link">
      <li>
        <div class="d-flex justify-content-start align-items-center">
          <router-link class="router" to="/updateUser" v-if="this.$route.path != '/updateUser'">
            <font-awesome-icon :icon="['fas', 'user-pen']" /> Editar perfil
          </router-link>
          <div  v-if="this.$route.path == '/updateUser'">
            <font-awesome-icon :icon="['fas', 'user-pen']" /> Editar perfil <font-awesome-icon :icon="['fas', 'caret-right']" />
          </div>
        </div>
      </li>
      <li >
        <div class="d-flex justify-content-start align-items-center">
          <router-link class="router" to="/updatePass" v-if="this.$route.path != '/updatePass'">
            <font-awesome-icon :icon="['fas', 'key']" /> Cambiar contraseña
          </router-link>
          <div v-if="this.$route.path == '/updatePass'">
            <font-awesome-icon :icon="['fas', 'key']" /> Cambiar contraseña <font-awesome-icon :icon="['fas', 'caret-right']" />
          </div>
        </div>
      </li>
    </ul>
  </li>
      <li><div class="d-flex justify-content-start align-items-center"><font-awesome-icon :icon="['fas', 'building']" /> Empresa</div>
        <ul class="ul-link">
          <li class="d-flex justify-content-start align-items-center">
            <router-link class="router" to="/createCompany" v-if="this.$route.path != '/createCompany'">
              Crear empresa
            </router-link>
            <div v-if="this.$route.path == '/createCompany'">
              Crear empresa <font-awesome-icon :icon="['fas', 'caret-right']" />
            </div>
          </li>
          <li class="d-flex justify-content-start align-items-center" v-if="this.$store.state.session != null && this.$store.state.session.companies != null && this.$store.state.session.companies.companies && this.$store.state.session.companies.companies.length!=0">
            <router-link class="router" to="/myCompanies" v-if="this.$route.path != '/myCompanies'">
              Mis empresas
            </router-link>
            <div v-if="this.$route.path == '/myCompanies'">
              Mis empresas <font-awesome-icon :icon="['fas', 'caret-right']" />
            </div>
          </li>
        </ul>
      </li>
      <li  v-if="this.$store.state.session != null && this.$store.state.session.companies != null && this.$store.state.session.companies.companies && this.$store.state.session.companies.companies.length!=0"><div class="d-flex justify-content-start align-items-center"><font-awesome-icon :icon="['fas', 'dollar-sign']"/> Remates</div>
        <ul class="ul-link">
          <li class="d-flex justify-content-start align-items-center">
            <router-link class="router" to="/createAuction" v-if="this.$route.path != '/createAuction'">
              Crear remates
            </router-link>
            <div v-if="this.$route.path == '/createAuction'">
              Crear remates <font-awesome-icon :icon="['fas', 'caret-right']" />
            </div>
          </li>
          <li class="d-flex justify-content-start align-items-center">
            <router-link class="router" to="/myAuctions" v-if="this.$route.path != '/myAuctions'">
              Mis remates
            </router-link>
            <div v-if="this.$route.path == '/myAuctions'">
              Mis remates <font-awesome-icon :icon="['fas', 'caret-right']" />
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<style >
@import '@/assets/links.css';
</style>
<script>
export default {
  name: 'LinkComponent'
}
</script>
