<script setup>

const messages = ref([])
const wsConnectionStatus = ref('Отключено')
const connection = ref(null)

const reversedMessages = computed(() => {
   return [...messages.value].reverse()
})

findWebSocketAndConnect()

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
            messages.value.push('Получено:      ' + event.data)
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
      messages.value.push('Ошибка: соединение не установлено')
      return
   }

   connection.value.send(message)
   messages.value.push(`Отправлено:  ${message}`)
}
</script>

<template>
   <div class="p-2 h-screen flex flex-col gap-2">

      <header class="border p-2 rounded-md">WebSocket статус: {{ wsConnectionStatus }}</header>

      <main class="border p-2 rounded-md flex-1 overflow-auto">
         <h4>Сообщения:</h4>
         <div>
            <ul>
               <li v-for="(msg, index) in reversedMessages"
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

      <footer class=" p-2  w-full flex gap-4 justify-between">
         <div class="flex gap-4">
            <BaseButton @mousedown="sendMessage('LEFT')"
                        @mouseup="sendMessage('STOP')"
                        @mouseleave="sendMessage('STOP')"
                        @touchstart="sendMessage('LEFT')"
                        @touchend="sendMessage('STOP')"
                        @touchcancel="sendMessage('STOP')">
               LEFT
            </BaseButton>

            <BaseButton @mousedown="sendMessage('RIGHT')"
                        @mouseup="sendMessage('STOP')"
                        @mouseleave="sendMessage('STOP')"
                        @touchstart="sendMessage('RIGHT')"
                        @touchend="sendMessage('STOP')"
                        @touchcancel="sendMessage('STOP')">
               RIGHT
            </BaseButton>
         </div>

         <div class="flex  gap-4">
            <BaseButton @mousedown="sendMessage('BACKWARD')"
                        @mouseup="sendMessage('STOP')"
                        @mouseleave="sendMessage('STOP')"
                        @touchstart="sendMessage('BACKWARD')"
                        @touchend="sendMessage('STOP')"
                        @touchcancel="sendMessage('STOP')">
               BACK
            </BaseButton>

            <BaseButton @mousedown="sendMessage('FORWARD')"
                        @mouseup="sendMessage('STOP')"
                        @mouseleave="sendMessage('STOP')"
                        @touchstart="sendMessage('FORWARD')"
                        @touchend="sendMessage('STOP')"
                        @touchcancel="sendMessage('STOP')">
               FRONT
            </BaseButton>
         </div>
      </footer>

   </div>
</template>