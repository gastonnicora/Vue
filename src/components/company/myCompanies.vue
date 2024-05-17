<template>
  <div class="container">
        <div class="row  justify-content-center  ">
              <div class="container">
                  <div>
                      <p tabindex="0" role="presentation">Mis empresas:</p>
                      <hr>
                      <ul>
                          <div v-if="this.$store.state.session && this.$store.state.session.companies && (!this.$store.state.session.companies.companies || this.$store.state.session.companies.companies.length==0)" tabindex="0" role="presentation">No tenes empresas</div>
                          <div v-else-if="this.$store.state.session && this.$store.state.session.companies && this.$store.state.session.companies.companies && this.$store.state.session.companies.companies.length!=0">
                            <div v-for="(com, index) in this.$store.state.session.companies.companies" :key="index">
                                <div>
                                    <Company role="button" tabindex="0" :company="com" ></Company>
                                </div>
                                <br>
                            </div>
                          </div>
                    </ul>
                  </div>
              </div>
        </div>
    </div>
</template>
<script>
import Company from '@/components/company/company'
export default {
  name: 'MyCompanies',
  components: {
    Company
  },
  data () {
    return {
      error: null,
      companies: '',
      isCollapsed: true
    }
  },
  methods: {
  },
  watch: {
    '$store.state.session': {
      handler () {
        if (!this.$store.state.session) {
          this.$router.push({ name: 'home' })
        } else {
          if (!this.$store.state.session.companies || !this.$store.state.session.companies.companies) {
            this.$router.push({ name: 'createCompany' })
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    if (!this.$store.state.session) {
      this.$router.push({ name: 'home' })
    } else {
      if (!this.$store.state.session.companies || !this.$store.state.session.companies.companies) {
        this.$router.push({ name: 'createCompany' })
      }
    }
  }
}
</script>
