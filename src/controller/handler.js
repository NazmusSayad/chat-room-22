import * as User from "../model/user-model.js"
import * as Chat from "../model/chat-model.js"
import STATE from "../model/STATE.js"
import ChatView from "../views/chat/ChatView.js"
import WelcomeView from "../views/welcome/WelcomeView.js"

export const loginPage = () => {
  WelcomeView.showLogin()
}

export const signupPage = () => {
  WelcomeView.showSignUp()
}

export const loginFormSubmit = async (token) => {
  try {
    await User.login(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

export const signupFormSubmit = async (token) => {
  try {
    await User.signUp(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

export const initChat = async () => {
  try {
    await Chat.Start()
    ChatView.render()
    const starterMessages = await Chat.getInitialMessages()
    starterMessages.reverse().forEach((msg) => {
      ChatView.appendMessage(msg)
    })

    ChatView.focusTextArea()
    ChatView.setLoadedClass()
    ChatView.addLoadMoreHandler(loadMoreMessages)
  } catch (err) {
    console.warn(err)
  }
}

export const sendMessage = async (msg) => {
  try {
    const element = ChatView.appendMessage({
      name: STATE.user.name,
      email: STATE.user.email,
      you: true,
      msg,
    })

    const [data] = await Chat.sendMessages([msg])
    ChatView.appendMessageSent(element, data)
  } catch (err) {
    console.error(err)
    alert("Unable to send message.\nPlease reload this page.")
  }
}

export const recieveMessage = (messages) => {
  messages.forEach((message) => ChatView.appendMessage(message))
}

export const loadMoreMessages = async (oldestMessage) => {
  if (STATE.isLoadMoreMessageReqRunning) return
  STATE.isLoadMoreMessageReqRunning = true

  try {
    const id = oldestMessage.dataset.id
    const data = await Chat.getOlderMessagesThanId(id)

    data.forEach((msg) => {
      ChatView.prependMessage(msg)
    })
  } catch (err) {
    console.warn(err.message)
    return true
  }
  STATE.isLoadMoreMessageReqRunning = false
}

const loadLeftMessagesOnReconnect = async () => {
  const id = ChatView.getLastSentMessage()?.dataset?.id
  if (!id) return

  const data = await Chat.getNewerMessagesThanId(id)
  if (typeof data === "number") {
    alert("Too many messages to laod.\nWe are reloading!")
    location.reload()
  }

  const ifNeedsToScroll = ChatView.ifNeedsToScroll()
  data.forEach((msg) => {
    ChatView.appendMessage(msg)
  })
  if (ifNeedsToScroll) ChatView.scrollToBottom()
}

const sendPendingMessagesOnReconnect = async () => {
  const pendingMessages = ChatView.getPendingMessages()
  if (!pendingMessages.length) return

  const messages = pendingMessages.map((element) => element.msg)
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
