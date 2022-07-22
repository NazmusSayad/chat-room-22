import * as model from "./model.js"
import { Wait } from "./utils.js"
import ChatView from "./views/ChatView.js"
import LoginView from "./views/LoginView.js"
import SignupView from "./views/SignupVIew.js"
import WelcomeView from "./views/WelcomeView.js"

const loginPage = () => {
  LoginView.render()
}

const signupPage = () => {
  SignupView.render()
}

const loginFormSubmit = async (token) => {
  try {
    await model.login(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const signupFormSubmit = async (token) => {
  try {
    await model.signUp(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const sendMessage = async (msg) => {
  try {
    const element = ChatView.appendMessage({
      name: model.STATE.user.name,
      email: model.STATE.user.email,
      you: true,
      msg,
    })

    const data = await model.Socket.sendNewMessage(msg)
    ChatView.appendMessageSent(element, data)
  } catch (err) {
    console.error(err)
    alert("Unable to send message.\nPlease reload this page.")
  }
}

const loadMoreMessages = async (oldestMessage) => {
  try {
    const id = oldestMessage.dataset.id
    const data = await model.Socket.getOlderMessagesThanId(id)
    data.forEach((msg) => {
      ChatView.prependMessage(msg)
    })
  } catch (err) {
    console.warn(err.message)
    return true
  }
}

const onReconnect = async () => {
  try {
    await model.Socket.WaitForConnection()

    await Wait(1000)
    console.log("Getting data...")

    const id = ChatView.getOldestSentMessage().dataset.id

    const data = await model.Socket.getNewerMessagesThanId(id)
    if (typeof data === "number") {
      alert("Too many messages to laod.\nWe are reloading!")
      location.reload()
    }
    data.forEach((msg) => {
      ChatView.appendMessage(msg)
    })

    /*---------------------------*/

    const pendingMessages = ChatView.getPendingMessages()
    const messages = pendingMessages.map((element) => element.msg)
    const datalist = await model.Socket.sendNewMessages(messages)

    pendingMessages.forEach((element, ind) => {
      ChatView.appendMessageSent(element, datalist[ind])
    })
  } catch (err) {
    console.warn(err.message)
    return true
  }
}

const initChat = async () => {
  try {
    const starterMessages = await model.Socket.Start()

    ChatView.render()
    console.log("Socket connected!")

    model.Socket.OnReconnect(onReconnect)
    model.Socket.onNewMessage((data) => {
      console.log(data)
      ChatView.appendMessage(data)
    })

    starterMessages.reverse().forEach((msg) => {
      ChatView.appendMessage(msg)
    })
    ChatView.setLoadedClass()
    ChatView.addLoadMoreHandler(loadMoreMessages)
  } catch (err) {
    console.warn(err)
  }
}

// Add Event-Handlers
;(() => {
  WelcomeView.addSignupHandler(signupPage)
  WelcomeView.addLoginHandler(loginPage)

  LoginView.addSignupHandler(signupPage)
  LoginView.addSubmitHandler(loginFormSubmit)

  SignupView.addLoginHandler(loginPage)
  SignupView.addSubmitHandler(signupFormSubmit)

  ChatView.addTextAreaHandlers()
  ChatView.addMsgSubmitHandler(sendMessage)
  ChatView.addLogoutHandler(model.logOut)
})()

// Add Keyboard-Shortcuts
;(() => {
  window.onkeydown = (event) => {
    if (event.key === "t" && event.altKey && !event.ctrlKey && !event.shiftKey) {
      appTheme.toggle()
    }

    if (event.key === "/" && !event.altKey && event.ctrlKey && !event.shiftKey) {
      ChatView._chatForm.querySelector(`textarea`).focus()
    }
  }
})()

// Init
;(async () => {
  if (model.STATE.auth) {
    try {
      await model.login({
        email: model.STATE.auth.email,
        password: model.STATE.auth.password,
      })

      initChat()
    } catch (err) {
      console.error(err)
      if (confirm(`Something went wrong!\nTry again after logout?`)) {
        model.logOut()
      }
    }
  } else {
    WelcomeView.render()
  }
})()

// document.onclick = () => {
//   model.Socket.getNewerMessagesThanId("62d9f04ffa93150992cd4606").then((data) => {
//     console.log(data)
//   })
// }
