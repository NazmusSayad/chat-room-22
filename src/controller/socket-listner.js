import * as Chat from '../model/chat-model.js'
import ChatView from '../views/chat/ChatView.js'

const loadLeftMessagesOnReconnect = async () => {
  const id = ChatView.getLastSentMessage()?.dataset?.id
  if (!id) return

  const data = await Chat.getNewerMessagesThanId(id)
  if (typeof data === 'number') {
    alert('Too many messages to laod.\nWe are reloading!')
    location.reload()
  }

  const ifNeedsToScroll = ChatView.ifNeedsToScroll()
  data.forEach(message => ChatView.appendMessage(message))
  if (ifNeedsToScroll) ChatView.scrollToBottom()
}

const sendPendingMessagesOnReconnect = async () => {
  const pendingMessages = ChatView.getPendingMessages()
  if (!pendingMessages.length) return

  const messages = pendingMessages.map(element => element.msg)
  const datalist = await Chat.sendMessages(messages)
  pendingMessages.forEach((element, ind) => {
    ChatView.appendMessageSent(element, datalist[ind])
  })
}

export const onDisconnect = () => {
  ChatView.showConncetionStatusOffline()
}

export const onReconnect = async () => {
  ChatView.showConncetionStatusOnline()
  try {
    await loadLeftMessagesOnReconnect()
    await sendPendingMessagesOnReconnect()
  } catch (err) {
    console.warn(err.message)
    return true
  }
}

export const onRecieveMessage = messages => {
  messages.forEach(message => ChatView.appendMessage(message))
}

export const onDeleteMessage = id => {
  ChatView.deleteMessage(id)
}
