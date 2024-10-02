<template>
  <h1 v-if="this.$route.name === 'updateArticle'"> Actualizar Articulo</h1>
  <h1 v-else> Crear Articulo</h1>
  <hr>
  <form @submit.prevent="createArticle()" id="form">
    <label for="description">Descripción: </label> <br/>
    <textarea id="description" name="description" v-model="this.article.description" style="width: 100%;resize: none;"></textarea>
    <error  v-if="error && error.description" :error="this.error.description"></error>
    <br />
    <label >Base: </label> <br/>
    <input v-model="this.article.minValue" type="number" min="1">
    <error  v-if="error && error.minValue" :error="this.error.minValue"></error>
    <br />
    <label >Diferencia con la ultima puja: </label> <br/>
    <input v-model="this.article.minStepValue" type="number" min="1">
    <error  v-if="error && error.minStepValue" :error="this.error.minStepValue"></error>
    <br />
    <label >Pegue la url de la imagen del articulo: </label> <br/>
    <input v-model="this.article.urlPhoto" maxlength="255" >
    <error  v-if="error && error.urlPhoto" :error="this.error.urlPhoto"></error>
    <br>
    <label>Vista del articulo</label><br>
    <img v-if="article.urlPhoto===''" src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png" alt="imagen de muestra" style="max-width: 10rem;
    height: auto" >
    <img :src="article.urlPhoto" :alt="article.description" style="max-width: 10rem;
    height: auto" @error="imagenNoEncontrada()">
    <br /> <br />
    <error  v-if="typeof error == 'string'" :error="error"></error>
    <div v-if="this.$route.name === 'updateArticle'"  >
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
      article: {
        auction: this.$route.params.uuid,
        before: '',
        description: '',
        dateOfStart: '',
        dateOfFinish: '',
        timeAfterBid: '',
        type: '',
        minValue: 0,
        minStepValue: 0,
        urlPhoto: ''
      },
      article2: {
        auction: this.$route.params.uuid,
        before: '',
        description: '',
        dateOfStart: '',
        dateOfFinish: '',
        timeAfterBid: '',
        type: '',
        minValue: 0,
        minStepValue: 0,
        urlPhoto: ''
      }
    }
  },
  components: {
    Error
  },
  methods: {
    async createArticle () {
      this.$store.state.isLoading = true
      const body = JSON.stringify(this.article)
      if (this.$route.name === 'updateArticle') {
        const json = await post('/articleUpdate ', 'PUT', this.$store.state.token, body)
        if (json.error) {
          this.error = json.error
        } else {
          this.error = json.error
          alert('Articulo actualizado correctamente')
          this.$router.push({ name: 'myAuction', params: { uuid: this.$route.params.uuid } })
        }
      } else {
        const json = await post('/articleCreate ', 'POST', this.$store.state.token, body)
        if (json.error) {
          this.error = json.error
        } else {
          this.error = json.error
          const aceptar = confirm('El articulo se creo correctamente. ¿Desea seguir creando artículos?')
          if (aceptar) {
            this.article = { ...this.article2 }
          } else {
            this.$router.push({ name: 'myAuction', params: { uuid: this.$route.params.uuid } })
          }
        }
      }
      this.$store.state.isLoading = false
    },
    async auction () {
      this.$store.state.isLoading = true
      const json = await get('/auction/' + this.$route.params.uuid, 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        this.article.type = json.content.type
        this.article.timeAfterBid = json.content.timeAfterBid
        this.article.dateOfFinish = json.content.dateFinish
        this.article.dateOfStart = json.content.dateStart
        this.article2 = { ...this.article }
      }
      this.$store.state.isLoading = false
    },
    async getArticle () {
      this.$store.state.isLoading = true
      const json = await get('/article/' + this.$route.params.article, 'GET', this.$store.state.token)
      if (json.error) {
        this.error = json.error
      } else {
        this.article = json.content
        this.article2.description = json.content.description
        this.article2.minValue = json.content.minValue
        this.article2.minStepValue = json.content.minStepValue
        this.article2.urlPhoto = json.content.urlPhoto
      }
      this.$store.state.isLoading = false
    },
    imagenNoEncontrada () {
      if (this.article.urlPhoto !== '') {
        alert('La imagen no se pudo cargar. La URL no fue encontrada.')
        this.article.urlPhoto = ''
      }
    },
    cancel () {
      this.article.description = this.article2.description
      this.article.minValue = this.article2.minValue
      this.article.minStepValue = this.article2.minStepValue
      this.article.urlPhoto = this.article2.urlPhoto
    }
  },
  mounted () {
    this.auction()
    if (this.$route.name === 'updateArticle') {
      this.getArticle()
    }
  }
}
</script>
