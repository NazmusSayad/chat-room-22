import * as User from "../model/user-model.js"
import * as Chat from "../model/chat-model.js"
import ChatView from "../views/ChatView.js"
import LoginView from "../views/LoginView.js"
import SignupView from "../views/SignupVIew.js"

export const initChat = async () => {
  try {
    await Chat.Start()
    ChatView.render()

    const starterMessages = await Chat.getInitialMessages()
    starterMessages.reverse().forEach((msg) => {
      ChatView.appendMessage(msg)
    })

    ChatView.setLoadedClass()
    ChatView.addLoadMoreHandler(loadMoreMessages)
  } catch (err) {
    console.warn(err)
  }
}

export const loginPage = () => {
  LoginView.render()
}

export const signupPage = () => {
  SignupView.render()
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

export const sendMessage = async (msg) => {
  try {
    const element = ChatView.appendMessage({
      name: User.STATE.user.name,
      email: User.STATE.user.email,
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
  try {
    const id = oldestMessage?.dataset?.id
    const data = await Chat.getOlderMessagesThanId(id)

    data.forEach((msg) => {
      ChatView.prependMessage(msg)
    })
  } catch (err) {
    console.warn(err.message)
    return true
  }
}

export const onReconnect = async () => {
  try {
    await Chat.WaitForConnection()
    const id = ChatView.getOldestSentMessage()?.dataset?.id
    const data = await Chat.getNewerMessagesThanId(id)

    if (typeof data === "number") {
      alert("Too many messages to laod.\nWe are reloading!")
      location.reload()
    }
    data.forEach((msg) => {
      ChatView.appendMessage(msg)
    })

    console.log("Load recent messages done!")

    /*---------------------------*/

    const pendingMessages = ChatView.getPendingMessages()
    console.log({ pendingMessages })
    const messages = pendingMessages.map((element) => element.msg)
    const datalist = await Chat.sendMessages(messages)
    console.log({ datalist })

    pendingMessages.forEach((element, ind) => {
      ChatView.appendMessageSent(element, datalist[ind])
    })
  } catch (err) {
    console.warn(err.message)
    return true
  }
}
