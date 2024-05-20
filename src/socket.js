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
  URL = `${location.origin}/api/`
  console.log(URL)
}

export const socket = io(URL, {
  transports: ['polling']
})
console.log(socket)

socket.on('disconnect', () => {
  console.log('disconnect')
  state.connected = false
})

socket.on('connect', () => {
  console.log('connect')
  console.log('conectado')
})

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`Intento de reconexión número: ${attemptNumber}`)
})
