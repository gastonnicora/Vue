<template>
  <h1 v-if="this.$route.name === 'updateAuction'"> Actualizar Remate</h1>
  <h1 v-else> Crear Remate</h1>
  <hr>
  <form @submit.prevent="createAuction()" id="form">
    <label for="company">Empresa: </label> <br/>
    <select name="comany" v-model="this.auction.company">
      <option v-for="(company , i) in this.$store.state.session.companies.companies" :key="i"  :value="company.uuid">{{company.name}}</option>
    </select>
    <error v-if="error && error.company" :error="this.error.company"></error>
    <br />
    <label for="description">Descripción: </label> <br/>
    <textarea id="description" name="description" v-model="this.auction.description" style="width: 100%;resize: none;"></textarea>
    <error v-if="error && error.description" :error="this.error.description"></error>
    <br />
    <label for="dateStart">Fecha de inicio: </label> <br/>
    <input type="date" v-model="auction.date" @change="date()" name="date" id="date">
    <input value="00:00:00" type="time" step="1" v-model="auction.hour" @change="date()">
    <error v-if="error && error.dateStart" :error="this.error.dateStart"></error>
    <br />
    <label >Tipo de inicio y finalización de los artículos: </label> <br/>
    <select  v-model="this.auction.type">
      <option value="0">Fecha y hora</option>
      <option value="1">Tiempo después de puja</option>
    </select>
    <error v-if="error && error.type" :error="this.error.type"></error>
    <br />
    <div v-if="this.auction.type==1">
      <label >Tiempo en segundo para finalizar subasta de articulo desde ultima puja </label> <br/>
      <input type="number" v-model="this.auction.timeAfterBid" min=10>
      <error v-if="error && error.timeAfterBid" :error="this.error.timeAfterBid"></error>
      <br />
    </div>
    <div v-if="this.auction.type==0">
      <label >Fecha de finalización </label> <br/>
      <input type="date" v-model="auction.dateF" @change="date()" name="dateF" id="dateF">
      <input value="00:00:00" type="time" step="1" v-model="auction.hourF" @change="date()">
      <error v-if="error && error.dateFinish" :error="this.error.dateFinish"></error>
      <br />
    </div>
    <error  v-if="typeof error == 'string'" :error="error"></error>
    <div v-if="this.$route.name === 'updateAuction'"  >
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
  name: 'CreateAuction',
  data () {
    return {
      error: null,
      auction: { company: '', description: '', dateStart: '', date: '2024-04-10', hour: '00:00:00', type: 0, timeAfterBid: 20, dateF: '2024-04-10', hourF: '00:00:00', dateFinish: '', uuid: '' },
      auction2: { company: '', description: '', dateStart: '', date: '2024-04-10', hour: '00:00:00', type: 0, timeAfterBid: 20, dateF: '2024-04-10', hourF: '00:00:00', dateFinish: '', uuid: '' }
    }
  },
  components: {
    Error
  },
  methods: {
    async createAuction () {
      this.$store.state.isLoading = true
      this.auction.type = parseInt(this.auction.type)
      const body = JSON.stringify(this.auction)
      if (this.$route.name === 'updateAuction') {
        const json = await post('/auctionUpdate ', 'PUT', this.$store.state.token, body)
        if (json.error) {
          this.error = json.error
        } else {
          this.error = json.error
          alert('Remate actualizado correctamente')
          this.$router.push({ name: 'myAuction', params: { uuid: json.content.uuid } })
        }
      } else {
        const json = await post('/auctionCreate ', 'POST', this.$store.state.token, body)
        if (json.error) {
          this.error = json.error
        } else {
          this.error = json.error
          alert('Remate creado correctamente')
          this.$router.push({ name: 'myAuction', params: { uuid: json.content.uuid } })
        }
      }
      this.$store.state.isLoading = false
    },
    async getAuction () {
      this.$store.state.isLoading = true
      const json = await get('/auction/' + this.$route.params.uuid, 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        const a = json.content
        this.auction = { company: a.company, description: a.description, dateStart: a.dateStart, date: '2024-04-10', hour: '00:00:00', type: a.type, timeAfterBid: a.timeAfterBid, dateF: '2024-04-10', hourF: '00:00:00', dateFinish: a.dateFinish, uuid: a.uuid }
        this.initializeUpdate()
        this.auction2 = { ...this.auction }
      }
      this.$store.state.isLoading = false
    },
    date () {
      this.auction.dateStart = this.dateFormat(this.auction.date, this.auction.hour)
      this.auction.dateFinish = this.dateFormat(this.auction.dateF, this.auction.hourF)
      const f = document.getElementById('dateF')
      if (f) {
        f.setAttribute('min', document.getElementById('date').value)
        f.value = document.getElementById('date').value
      }
    },
    dateFormat (date, hour) {
      const moment = require('moment')
      return moment(date + 'T' + hour + '-0300', 'YYYY-MM-DDTH:mm:ssZZ').format('DD/MM/YYYYTHH:mm:ssZZ')
    },
    cancel () {
      this.auction = { ...this.auction2 }
    },
    initializeCreate () {
      let today = new Date()
      let dd = today.getDate() + 1
      let mm = today.getMonth() + 1
      const yyyy = today.getFullYear()

      if (dd < 10) {
        dd = '0' + dd
      }

      if (mm < 10) {
        mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd
      document.getElementById('date').setAttribute('min', today)
      document.getElementById('date').value = today
      document.getElementById('dateF').setAttribute('min', document.getElementById('date').value)
      document.getElementById('dateF').value = today
      this.auction.date = today
      this.auction.dateF = today
      this.date()
    },
    initializeUpdate () {
      const moment = require('moment')
      const dateStart = moment(this.auction.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ').format('YYYY-MM-DD')
      const dateFinish = moment(this.auction.dateFinish, 'DD/MM/YYYYTHH:mm:ssZZ').format('YYYY-MM-DD')
      const hourS = moment(this.auction.dateStart, 'DD/MM/YYYYTHH:mm:ssZZ').format('HH:mm:ss')
      const hourF = moment(this.auction.dateFinish, 'DD/MM/YYYYTHH:mm:ssZZ').format('HH:mm:ss')
      let today = new Date()
      let dd = today.getDate() + 1
      let mm = today.getMonth() + 1
      const yyyy = today.getFullYear()

      if (dd < 10) {
        dd = '0' + dd
      }

      if (mm < 10) {
        mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd
      document.getElementById('date').setAttribute('min', today)
      document.getElementById('date').value = dateStart
      document.getElementById('dateF').setAttribute('min', document.getElementById('date').value)
      document.getElementById('dateF').value = dateFinish
      this.auction.date = dateStart
      this.auction.dateF = dateFinish
      this.auction.hour = hourS
      this.auction.hourF = hourF
    }
  },
  mounted () {
    if (this.$route.name === 'updateAuction') {
      this.getAuction()
    } else {
      this.initializeCreate()
    }
  }
}
</script>
