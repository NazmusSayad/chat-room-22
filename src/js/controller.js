import * as model from "./model.js"
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

    const data = await model.Socket.newMessage(msg)
    ChatView.appendMessageSent(element, data)
  } catch (err) {
    console.error(err)
    alert("Unable to send message.\nPlease reload this page.")
  }
}

const loadMoreMessages = async (oldestMessage) => {
  try {
    const id = oldestMessage.dataset.id
    const data = await model.Socket.lodeMoreMessages(id)
    data.forEach((msg) => {
      ChatView.prependMessage(msg)
    })
  } catch (err) {
    console.warn(err.message)
    return true
  }
}

const initChat = async () => {
  try {
    ChatView.render()

    const starterMessages = await model.Socket.start()
    starterMessages.reverse().forEach((msg) => {
      ChatView.appendMessage(msg)
    })

    model.Socket.onNewMessage((data) => {
      ChatView.appendMessage(data)
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
      alert(`Something went wrong!`)
    }
  } else {
    WelcomeView.render()
  }
})()
