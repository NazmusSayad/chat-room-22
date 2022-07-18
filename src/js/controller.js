import { blockBadWords, deleteDuplicateNewLines } from './HELPER.js'
import * as model from './model.js'
import ChatView from './views/ChatView.js'
import LoginView from './views/LoginView.js'
import SignupView from './views/SignupVIew.js'
import WelcomeView from './views/WelcomeView.js'

const loginPage = () => LoginView.render()

const signupPage = () => SignupView.render()

const loginSubmit = async token => {
  try {
    await model.login(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const signupSubmit = async token => {
  try {
    await model.signUp(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const sendMessage = async msg => {
  try {
    msg = deleteDuplicateNewLines(msg)
    msg = blockBadWords(msg)

    const element = ChatView.appendMessage({
      name: model.STATE.user.name,
      email: model.STATE.user.email,
      you: true,
      msg,
    })

    const data = await model.postMessage(msg)
    ChatView.appendMessageSent(element, data)
  } catch (err) {
    console.error(err)
    alert('Unable to send message.\nPlease reload this page.')
  }
}

const loadMoreMessages = async oldestMessage => {
  try {
    const id = oldestMessage.dataset.id
    const data = await model.getMessageById(id)
    data.forEach(msg => {
      msg.you = msg.email === model.STATE.user.email
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

    model.startChatLoop(
      ({ data }) => {
        ChatView.appendMessage(data)
      },
      () => {
        location.reload()
      }
    )

    const data = await model.getMessage()
    data.reverse().forEach(msg => {
      msg.you = msg.email === model.STATE.user.email
      ChatView.appendMessage(msg)
    })

    ChatView.setLoadedClass()
    ChatView.addLoadMoreHandler(loadMoreMessages)
  } catch (err) {
    console.warn(err)
  }
}

// Add handlers
;(() => {
  WelcomeView.addSignupHandler(signupPage)
  WelcomeView.addLoginHandler(loginPage)

  LoginView.addSignupHandler(signupPage)
  LoginView.addSubmitHandler(loginSubmit)

  SignupView.addLoginHandler(loginPage)
  SignupView.addSubmitHandler(signupSubmit)

  // ChatView.addLogoutHandler(model.logOut)
  ChatView.addMsgSubmitHandler(sendMessage)
  ChatView.addTextAreaHandlers()

  // don't kill me
  const toggleTheme = () => {
    const html = document.querySelector('html')
    const theme = html.getAttribute('theme')
    if (theme == 'dark') {
      html.setAttribute('theme', 'light')
    } else {
      html.setAttribute('theme', 'dark')
    }
  }

  window.onkeydown = event => {
    if (event.key === 't' && event.altKey && !event.ctrlKey && !event.shiftKey) {
      // appTheme.toggle() // eita kaj kore na, so amar ta add korte hoiteche. fix it later
      toggleTheme()
    }

    if (event.key === '/' && !event.altKey && event.ctrlKey && !event.shiftKey) {
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
