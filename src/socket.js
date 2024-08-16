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
}

export const socket = io(URL, {
  transports: ['polling'],
  reconnectionAttempts: 5, // Intentos de reconexión
  reconnectionDelay: 1000, // Tiempo de espera entre intent
  timeout: 20000 // Timeout de conexión
})

socket.on('disconnect', () => {
  console.log('disconnect')
  state.connected = false
})

socket.on('connect', (data) => {
  console.log('connect')
  console.log('conectado')
  state.connected = true
})

// socket.on('reconnect_attempt', (attemptNumber) => {
//   console.log(`Intento de reconexión número: ${attemptNumber}`)
// })
