<template>
  <div class="row" v-if="this.$store.state.session == null">
    <div class="col-md-6">
      <div >
        <p>Esto es una version de prueba. Ya se inicializan algunos usuarios, remates, artículos y pujas.</p>
        <p>Usuario de prueba:
          <ul>
            <li >Email:<div class="li-copy" @click="copy('email')"> <copy id="emailc">usuario@example.com</copy><font-awesome-icon id="icon_emailc" class="icon-copy" :icon="['far', 'copy']" /><font-awesome-icon id="check_emailc" class="icon-copy" :icon="['fas', 'check']" style="display:none ; color:#3a3" /> </div></li>
            <li >Contraseña:<div class="li-copy" @click="copy('pass')"> <copy id="passc">12345678</copy><font-awesome-icon id="icon_passc" class="icon-copy" :icon="['far', 'copy']" /><font-awesome-icon id="check_passc" class="icon-copy" :icon="['fas', 'check']" style="display:none ; color:#3a3" /> </div></li>
          </ul>
        </p>
      </div>
    </div>
    <div class="col-md-6">
      <login ref="login" v-if="this.$store.state.session == null && login" :login="l"></login>
      <checkIn v-if="this.$store.state.session == null && !login" :login="l"  ></checkIn>
    </div>
  </div>
</template>

<script>
import Login from '@/components/user/login'
import CheckIn from '@/components/user/checkin'
export default {
  name: 'LoginBasic',
  components: {
    Login,
    CheckIn
  },
  data () {
    return {
      login: true
    }
  },
  methods: {
    l (state) {
      this.login = state
    },
    copy (id) {
      const copyText = document.getElementById(id + 'c')
      const icon = document.getElementById('icon_' + id + 'c')
      const check = document.getElementById('check_' + id + 'c')
      icon.style.display = 'none'
      check.style.display = 'block'
      const value = copyText.innerHTML
      this.$refs.login.handleCopy({ id, value })
      setTimeout(() => {
        icon.style.display = 'block'
        check.style.display = 'none'
      }, '1000')
    }
  },
  mounted () {
    if (this.$store.state.session != null) {
      this.$router.push('/')
    }
  }
}
</script>
