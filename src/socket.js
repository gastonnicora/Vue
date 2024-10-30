import { reactive } from 'vue'

export const state = reactive({
  connected: false,
  notificaciones: []
})

let URL
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  URL = 'http://localhost:4001'
} else {
  URL = `${location.origin}`
}
const io = window.io

export const socket = io(URL, {
  transports: ['polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
})

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('error', (err) => console.log('Error:', err))
socket.on('connect_error', (err) => console.error('Error de conexión:', err))
socket.on('reconnect_attempt', (attempt) => {
  console.log(`Intento de reconexión: ${attempt}`)
})
