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
  } catch (err) {
    console.error(err)
    alert("Wrong email or password.")
  }
}

const signupSubmit = async (token) => {
  try {
    await model.signUp(token)
    initChat()
  } catch (err) {
    console.error(err)
    alert("Invalid email or email already exixts!")
  }
}

const sendMessage = async (msg) => {
  try {
    while (msg.includes("\n\n")) {
      msg = msg.replace(/\n\n/gim, "\n")
    }

    model.STATE.badWords.forEach((word) => {
      const regex = new RegExp(word, "igm")
      msg = msg.replace(regex, new Array(word.length).fill("*").join(""))

      const regex2 = new RegExp(word.split("").join("\n"), "igm")
      msg = msg.replace(regex2, new Array(word.length).fill("*").join("\n"))
    })

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
    somethingWentWrong()
  }
}

const loadMoreMessages = async (oldestMessage) => {
  try {
    const id = oldestMessage.dataset.id
    const data = await model.getMessageById(id)
    data.forEach((msg) => {
      msg.you = msg.email === model.STATE.user.email
      ChatView.prependMessage(msg, oldestMessage)
    })
  } catch (err) {
    console.error(err)
    somethingWentWrong()
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
    data.reverse().forEach((msg) => {
      msg.you = msg.email === model.STATE.user.email
      ChatView.appendMessage(msg)
    })

    ChatView.addLoadMoreHandler(loadMoreMessages)
  } catch (err) {
    console.error(err)
    somethingWentWrong()
  }
}

const somethingWentWrong = () => {
  alert(`Something went wrong!`)
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
      somethingWentWrong()
    }
  } else {
    WelcomeView.render()
  }
})()
