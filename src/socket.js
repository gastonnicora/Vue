import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const state = reactive({
  connected: false,
  notificaciones: []
})

let URL
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  URL = 'http://localhost:4000'
} else {
  URL = `${location.origin}`
}
console.log(URL)
export const socket = io(URL, {
  transports: ['websocket', 'polling'],
  pingTimeout: 60000, // Tiempo de espera
  pingInterval: 25000 // Intervalo de PING
})

socket.on('connect', () => {
  console.log('conectado')
  state.connected = true
})
socket.on('disconnect', () => {
  console.log('disconnect')
  state.connected = false
})
socket.on('error', (err) => console.log('Error:', err))

socket.on('connect_error', (err) => {
  console.error('Connect Error:', err)
})

socket.on('reconnect_attempt', (attempt) => {
  console.log(`Reconnect Attempt: ${attempt}`)
})
