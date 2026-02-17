<script setup>

const messages = ref([])
const MESSAGES_MAX_LENGTH = 50
const wsConnectionStatus = ref('Отключено')
const connection = ref(null)
const ipAddress = ref('192.168.1.103')

function addMessage(newMessage) {
   messages.value.unshift(newMessage)
   if (messages.value.length > MESSAGES_MAX_LENGTH) {
      messages.value.splice(MESSAGES_MAX_LENGTH)
   }
}

function connectToIP() {
   const ws = new WebSocket(`ws://${ipAddress.value}:81`)

   ws.onopen = () => {
      wsConnectionStatus.value = `WebSocket сервер подключен по адресу: ws://${ipAddress.value}:81`

      ws.onmessage = (event) => {
         addMessage('Получено:      ' + event.data)
      }

      ws.onclose = () => {
         wsConnectionStatus.value = 'Отключено'
      }

      ws.onerror = () => {
         wsConnectionStatus.value = 'Ошибка'
      }

      connection.value = ws
   }
}

// findWebSocketAndConnect()

function findWebSocketAndConnect() {
   const subnet = '192.168.1.'
   wsConnectionStatus.value = 'Ищу IP адрес устройства...'
   const sockets = []

   for (let i = 1; i < 255; i++) {
      const wsUrl = `ws://${subnet + i}:81`
      const ws = new WebSocket(wsUrl)
      sockets.push(ws)

      ws.onopen = () => {
         sockets.forEach(socket => {
            if (socket != ws) socket.close()
         })

         wsConnectionStatus.value = `WebSocket сервер подключен по адресу: ${wsUrl}`

         ws.onmessage = (event) => {
            addMessage('Получено:      ' + event.data)
         }

         ws.onclose = () => {
            wsConnectionStatus.value = 'Отключено'
         }

         ws.onerror = () => {
            wsConnectionStatus.value = 'Ошибка'
         }

         connection.value = ws
      }
   }
}

function sendMessage(message) {
   if (!connection.value || connection.value.readyState !== WebSocket.OPEN) {
      addMessage('Ошибка: соединение не установлено')
      return
   }
   connection.value.send(message)
   addMessage(`Отправлено:  ${message}`)
}
</script>

<template>

   <header class="border m-2 p-2 rounded-md">
      <input type="text"
             v-model="ipAddress"
             class="border p-1 rounded">
      <BaseButton class="ml-2"
                  @click="connectToIP">
         Подключить
      </BaseButton>
      <div>WebSocket статус: {{ wsConnectionStatus }}</div>
   </header>

   <main class="m-2">
      <h4>Сообщения:</h4>
      <div class="text-sm border p-2 min-h-50 max-h-50 rounded-md overflow-auto">
         <ul>
            <li v-for="(msg, index) in messages"
                :key="index"
                class="whitespace-pre-wrap"
                :class="{
                  'text-green-600': msg.includes('Получено'),
                  'text-blue-600': msg.includes('Отправлено')
               }">
               {{ msg }}
            </li>
         </ul>
      </div>
   </main>

   <footer class="fixed bottom-0 p-2 w-full flex gap-4 justify-between">
      <div class="flex gap-3 items-center">
         <BaseButton class="w-20 h-20"
                     @mousedown="sendMessage('LEFT')"
                     @mouseup="sendMessage('STOP')"
                     @mouseleave="sendMessage('STOP')"
                     @touchstart.prevent="sendMessage('LEFT')"
                     @touchend.prevent="sendMessage('STOP')"
                     @touchcancel.prevent="sendMessage('STOP')">
            LEFT
         </BaseButton>

         <BaseButton class="w-20 h-20"
                     @mousedown="sendMessage('RIGHT')"
                     @mouseup="sendMessage('STOP')"
                     @mouseleave="sendMessage('STOP')"
                     @touchstart.prevent="sendMessage('RIGHT')"
                     @touchend.prevent="sendMessage('STOP')"
                     @touchcancel.prevent="sendMessage('STOP')">
            RIGHT
         </BaseButton>
      </div>

      <div class="flex flex-col gap-3">
         <BaseButton class="w-20 h-20"
                     @mousedown="sendMessage('FORWARD')"
                     @mouseup="sendMessage('STOP')"
                     @mouseleave="sendMessage('STOP')"
                     @touchstart.prevent="sendMessage('FORWARD')"
                     @touchend.prevent="sendMessage('STOP')"
                     @touchcancel.prevent="sendMessage('STOP')">
            FRONT
         </BaseButton>

         <BaseButton class="w-20 h-20"
                     @mousedown="sendMessage('BACKWARD')"
                     @mouseup="sendMessage('STOP')"
                     @mouseleave="sendMessage('STOP')"
                     @touchstart.prevent="sendMessage('BACKWARD')"
                     @touchend.prevent="sendMessage('STOP')"
                     @touchcancel.prevent="sendMessage('STOP')">
            BACK
         </BaseButton>
      </div>
   </footer>

</template>