import STATE from '../model/STATE.js'
import * as User from '../model/user-model.js'
import * as Chat from '../model/chat-model.js'
import ChatView from '../views/chat/ChatView.js'
import WelcomeView from '../views/welcome/WelcomeView.js'

export const loginPage = () => {
  WelcomeView.showLogin()
}

export const signupPage = () => {
  WelcomeView.showSignUp()
}

export const loginFormSubmit = async token => {
  try {
    await User.login(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

export const signupFormSubmit = async token => {
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
    starterMessages.reverse().forEach(message => ChatView.appendMessage(message))

    ChatView.focusTextArea()
    ChatView.setLoadedClass()
    ChatView.addLoadMoreHandler(loadMoreMessages)
  } catch (err) {
    console.warn(err)
  }
}

export const sendMessage = async msg => {
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
    alert('Unable to send message.\nPlease reload this page.')
  }
}

export const deleteMessage = async id => {
  const status = await Chat.deleteMessage(id)
  if (!status) return
  ChatView.deleteMessage(id)
}

export const loadMoreMessages = async oldestMessage => {
  if (STATE.isLoadMoreMessageReqRunning) return
  STATE.isLoadMoreMessageReqRunning = true

  try {
    const id = oldestMessage.dataset.id
    const data = await Chat.getOlderMessagesThanId(id)

    data.forEach(msg => {
      ChatView.prependMessage(msg)
    })
  } catch (err) {
    console.warn(err.message)
    return true
  }
  STATE.isLoadMoreMessageReqRunning = false
}
