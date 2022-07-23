import * as User from "../model/user-model.js"
import * as Chat from "../model/chat-model.js"
import * as handler from "./handler.js"
import ChatView from "../views/ChatView.js"
import LoginView from "../views/LoginView.js"
import SignupView from "../views/SignupVIew.js"
import WelcomeView from "../views/WelcomeView.js"

// Add Event-Handlers
;(() => {
  WelcomeView.addSignupHandler(handler.signupPage)
  WelcomeView.addLoginHandler(handler.loginPage)
  WelcomeView.addSignupSubmitHandler(handler.signupFormSubmit)

  LoginView.addSignupHandler(handler.signupPage)
  LoginView.addSubmitHandler(handler.loginFormSubmit)

  SignupView.addLoginHandler(handler.loginPage)
  SignupView.addSubmitHandler(handler.signupFormSubmit)

  ChatView.addTextAreaHandlers()
  ChatView.addMsgSubmitHandler(handler.sendMessage)
  ChatView.addLogoutHandler(User.logOut)

  Chat.handlers.onReconnection = handler.onReconnect
  Chat.handlers.receiveMessages = handler.recieveMessage
})()

// Init
;(async () => {
  if (User.STATE.auth) {
    try {
      await User.login({
        email: User.STATE.auth.email,
        password: User.STATE.auth.password,
      })

      handler.initChat()
    } catch (err) {
      console.error(err)
      if (confirm(`Something went wrong!\nTry again after logout?`)) {
        User.logOut()
      }
    }
  } else {
    WelcomeView.render()
  }
})()
