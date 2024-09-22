import { reactive } from 'vue'

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
const io = window.io

export const socket = io(URL, {
  transports: ['polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
})

socket.on('connect', () => {
  console.log('Conectado')
  state.connected = true
})

socket.on('disconnect', () => {
  console.log('Desconectado')
  state.connected = false
})

socket.on('error', (err) => console.log('Error:', err))
socket.on('connect_error', (err) => console.error('Error de conexión:', err))
socket.on('reconnect_attempt', (attempt) => {
  console.log(`Intento de reconexión: ${attempt}`)
})
