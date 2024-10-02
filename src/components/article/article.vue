<template>
  <RouterLink v-if="this.$route.name=== 'myAuction'" :to="this.$route.path + '/myArticle/' + art.uuid" class="noLink" style="text-decoration: none">
    <div class="marco">
      <div class="center">
        <div v-if="art.started === 1 && art.finished === 0" class="started">Comenzó</div>
        <div v-if="art.started === 1 && art.finished === 0 && timeOfEnd != 0" class="started">Finaliza en {{timeOfEnd}}</div>
        <div v-if="art.started === 1 && art.finished === 1" class="finished">Finalizó</div>
        <img class="imgAuction" :src="art.urlPhoto" :alt="art.description">
      </div>
    </div>
  </RouterLink>
  <RouterLink v-if="this.$route.path == '/myArticlesBought'" :to="'/myArticle/' + art.uuid" class="noLink" style="text-decoration: none">
    <div class="marco">
      <div class="center">
        <img class="imgAuction" :src="art.urlPhoto" :alt="art.description">
      </div>
    </div>
  </RouterLink>
  <RouterLink v-if="this.$route.name == 'auction'" :to="'/article/' + art.uuid" class="noLink" style="text-decoration: none">
    <div class="marco">
      <div class="center">
        <div v-if="art.started === 1 && art.finished === 0" class="started">Comenzó</div>
        <div v-if="art.started === 1 && art.finished === 0 && timeOfEnd != 0" class="started">Finaliza en {{timeOfEnd}}</div>
        <div v-if="art.started === 1 && art.finished === 1" class="finished">Finalizó</div>
        <img class="imgAuction" :src="art.urlPhoto" :alt="art.description">
      </div>
    </div>
  </RouterLink>
</template>

<script>
import { socket } from '@/socket.js'
export default {
  name: 'Article_',
  props: ['article'],
  data () {
    return {
      art: this.article,
      timeOfEnd: 0,
      join: false
    }
  },
  methods: {
    leaveRoom () {
      socket.emit('leave', { room: this.art.uuid })
      socket.off('countdown/' + this.art.uuid)
      socket.off('startRoom/' + this.$route.params.uuid)
      socket.off('finishRoom/' + this.$route.params.uuid)
    }
  },
  watch: {
    'art.started' (newVal) {
      if (newVal === 1) {
        const uuid = this.art.uuid
        if (this.art.type === 1 && this.art.started === 1 && this.art.finished === 0) {
          if (this.art.next) {
            console.log('next ' + this.art.next)
            socket.emit('join', { room: this.art.next })
          }
          socket.on('finishRoom/' + uuid, (room) => {
            this.art.finished = 1
            this.leaveRoom()
          })
          console.log('aca')
          socket.on('countdown/' + uuid, (room) => {
            this.timeOfEnd = room.time
          })
        }
      }
    }
  },
  mounted () {
    const uuid = this.art.uuid
    if (this.art.type === 1 && this.art.started === 0) {
      this.join = true
      console.log(uuid)
      socket.on('startRoom/' + uuid, (room) => {
        console.log('start' + uuid)
        this.art.started = 1
      })
    }
    if (this.art.type === 1 && this.art.started === 1 && this.art.finished === 0) {
      if (!this.join) {
        this.join = true
        socket.emit('join', { room: uuid })
      }
      socket.on('finishRoom/' + uuid, (room) => {
        this.art.finished = 1
        this.leaveRoom()
      })
      if (this.art.next) {
        console.log('next ' + this.art.next)
        socket.emit('join', { room: this.art.next })
      }
      console.log('aca')
      socket.on('countdown/' + uuid, (room) => {
        this.timeOfEnd = room.time
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    window.removeEventListener('beforeunload', this.leaveRoom)
    this.leaveRoom()
    next()
  }
}
</script>
