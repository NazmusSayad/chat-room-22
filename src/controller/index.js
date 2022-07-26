import STATE from '../model/STATE.js'
import * as User from '../model/user-model.js'
import * as Chat from '../model/chat-model.js'
import * as handler from './handler.js'
import * as socketListner from './socket-listner.js'
import ChatView from '../views/chat/ChatView.js'
import WelcomeView from '../views/welcome/WelcomeView.js'

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
  ChatView.deleteMessageListner = handler.deleteMessage

  Chat.handlers.onReconnection = socketListner.onReconnect
  Chat.handlers.onDisconnect = socketListner.onDisconnect
  Chat.handlers.onReceiveMessages = socketListner.onRecieveMessage
  Chat.handlers.onDeleteMessages = socketListner.onDeleteMessage
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
      if (err.name === 'TypeError') return

      if (confirm(`Something went wrong!\nTry again after logout?`)) {
        User.logOut()
      }
    }
  } else {
    WelcomeView.render()
    WelcomeView.showSignUp()
  }
})()
