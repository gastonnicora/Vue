import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const state = reactive({
  connected: false,
  notificaciones: []
})

let URL
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  URL = 'http://localhost:4000/'
} else {
  URL = 'api/'
  console.log(url)
}

export const socket = io(URL, {
  transports: ['websocket', 'polling']
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('connect', () => {
  console.log('conectado')
})
