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
      timeOfEnd: 0
    }
  },
  methods: {
    leaveRoom () {
      socket.emit('leave', { room: this.art.uuid })
      socket.off('joinToRoom/' + this.art.uuid)
      socket.off('bidRoom/' + this.art.uuid)
      socket.off('countdown/' + this.art.uuid)
    },
    socket (uuid) {
      socket.emit('join', { room: uuid })
      socket.on('joinToRoom/' + uuid, (room) => {
        this.users = room.users
      })
      socket.on('startRoom/' + uuid, (room) => {
        this.art.started = 1
      })
      socket.on('countdown/' + uuid, (room) => {
        this.timeOfEnd = room.time
      })
      socket.on('finishRoom/' + uuid, (room) => {
        this.art.finished = 1
      })
    }
  },
  mounted () {
    this.socket(this.art.uuid)

    window.addEventListener('beforeunload', this.leaveRoom)
  },
  beforeUnmount () {
    this.leaveRoom()
    window.removeEventListener('beforeunload', this.leaveRoom)
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('beforeunload', this.leaveRoom)
    this.leaveRoom()
    next()
  },
  beforeRouteUpdate (to, from, next) {
    window.removeEventListener('beforeunload', this.leaveRoom)
    this.leaveRoom()
    this.socket(this.art.uuid)
    next()
  }
}
</script>
