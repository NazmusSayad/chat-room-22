import * as model from "./model.js"
import ChatView from "./views/ChatView.js"
import LoginView from "./views/LoginView.js"
import SignupView from "./views/SignupVIew.js"
import WelcomeView from "./views/WelcomeView.js"

const loginPage = () => LoginView.render()

const signupPage = () => SignupView.render()

const loginSubmit = async (token) => {
  try {
    await model.login(token)
    initChat()
  } catch {}
}

const signupSubmit = async (token) => {
  try {
    await model.signUp(token)
    initChat()
  } catch {}
}

const sendMessage = async (msg) => {
  try {
    console.log(msg)

    ChatView.appendMessage({
      ...model.STATE.user,
      msg,
    })

    await model.postMessage(msg)
    console.log("msg sent!")
  } catch {}
}

const logOut = () => {
  // Log Out
}

// Add handlers
;(() => {
  WelcomeView.addSignupHandler(signupPage)
  LoginView.addSignupHandler(signupPage)
  WelcomeView.addLoginHandler(loginPage)
  SignupView.addLoginHandler(loginPage)

  LoginView.addSubmitHandler(loginSubmit)
  SignupView.addSubmitHandler(signupSubmit)

  // ChatView.addLogoutHandler(logOut)
  ChatView.addMsgSubmitHandler(sendMessage)
})()

const initChat = async () => {
  ChatView.render()
  const res = model.getMessage()

  model.startChatLoop(
    ({ data }) => {
      console.log(data)

      ChatView.appendMessage(data)
    },
    () => {
      location.reload()
    }
  )

  const data = (await res).reverse()
  data.forEach((msg) => {
    ChatView.appendMessage(msg)
  })
}

// Init
;(async () => {
  if (model.STATE.auth) {
    try {
      await model.login({
        email: model.STATE.auth.email,
        password: model.STATE.auth.password,
      })

      initChat()
    } catch {
      // Something went wrong!
    }
  } else {
    WelcomeView.render()
  }
})()
