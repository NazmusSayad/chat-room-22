import { io } from "socket.io-client"
import { API_URL } from "./.config"
import { getJSON } from "./utils"

export const STATE = {
  user: null,
  auth: null,
}

const checkIfYou = (input) => {
  if (Array.isArray(input)) {
    input.forEach((msg) => {
      msg.you = msg.email === STATE.user.email
    })

    return input
  }

  input.you = input.email === STATE.user.email
  return input
}

class ChatWebSocket {
  #socket

  start() {
    this.#socket = io(API_URL + "/chat", {
      auth: STATE.auth,
    })

    console.log("Socket connected!")

    return new Promise((resolve, reject) => {
      this.#socket.on("message-initial", (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  newMessage(msg) {
    return new Promise((resolve, reject) => {
      this.#socket.emit("message-new", msg, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  lodeMoreMessages(id) {
    return new Promise((resolve, reject) => {
      this.#socket.emit("message-loadmore", id, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  onNewMessage(callback = (data) => console.log(data)) {
    this.#socket.on("message-new", (data) => {
      callback(checkIfYou(data))
    })
  }
}

export const Socket = new ChatWebSocket()

export const login = async (token) => {
  const res = await getJSON(API_URL + "/user", {
    headers: {
      email: token.email,
      password: token.password,
    },
  })

  saveAuthInfo(res.data)
}

export const signUp = async (token) => {
  const res = await getJSON(API_URL + "/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(token),
  })

  saveAuthInfo(res.data)
}

export const logOut = () => {
  localStorage.clear()
  location.reload()
}

const saveAuthInfo = (data) => {
  localStorage.setItem(`auth`, JSON.stringify(data))
  loadAuthInfo()
}

const loadAuthInfo = () => {
  const data = JSON.parse(localStorage.getItem(`auth`))
  if (!data) return

  STATE.user = {
    _id: data?._id,
    name: data?.name,
    email: data?.email,
    dateJoin: data?.dateJoin,
  }
  STATE.auth = { email: data?.email, password: data?.password }
}

// Init
;(() => {
  loadAuthInfo()
})()
