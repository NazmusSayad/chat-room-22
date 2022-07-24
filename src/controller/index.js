import * as User from "../model/user-model.js"
import * as Chat from "../model/chat-model.js"
import STATE from "../model/STATE.js"
import * as handler from "./handler.js"
import ChatView from "../views/chat/ChatView.js"
import WelcomeView from "../views/welcome/WelcomeView.js"

// Add Event-Handlers
;(() => {
  WelcomeView.addFormInputHandlers()
  WelcomeView.addSignupViewHandler(handler.signupPage)
  WelcomeView.addLoginViewHandler(handler.loginPage)
  WelcomeView.addSignupSubmitHandlers(handler.signupFormSubmit)
  WelcomeView.addLoginSubmitHandlers(handler.loginFormSubmit)

  ChatView.addTextAreaHandlers()
  ChatView.addMsgSubmitHandler(handler.sendMessage)
  ChatView.addLogoutHandler(User.logOut)

  Chat.handlers.onReconnection = handler.onReconnect
  Chat.handlers.onDisconnect = handler.onDisconnect
  Chat.handlers.receiveMessages = handler.recieveMessage
})()

// Init
;(async () => {
  if (STATE.auth) {
    try {
      await User.login({
        email: STATE.auth.email,
        password: STATE.auth.password,
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
    WelcomeView.showSignUp()
  }
})()
