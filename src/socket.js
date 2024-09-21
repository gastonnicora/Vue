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
  URL = `${location.origin}/socket.io/`
}
console.log(URL)
export const socket = io(URL, {
})

socket.on('disconnect', () => {
  console.log('disconnect')
  state.connected = false
})

socket.on('connect', () => {
  console.log('connect')
  console.log('conectado')
  state.connected = true
})
socket.on('error', (err) => console.log('Error:', err))
