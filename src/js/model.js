import { io } from "socket.io-client"
import { API_URL } from "./.config"
import { getJSON } from "./utils"
import cryptoJs from "./crypto-js"

export const STATE = {
  get user() {
    let data = localStorage.getItem(`token`)
    if (!data) return null

    data = JSON.parse(cryptoJs.decrypt(data))
    return {
      _id: data?._id,
      name: data?.name,
      email: data?.email,
      dateJoin: data?.dateJoin,
    }
  },
  get auth() {
    let data = localStorage.getItem(`token`)
    if (!data) return null

    data = JSON.parse(cryptoJs.decrypt(data))
    return {
      email: data?.email,
      password: data?.password,
    }
  },
}

const saveAuthInfo = (data) => {
  localStorage.setItem(`token`, cryptoJs.encrypt(JSON.stringify(data)))
}

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
  localStorage.removeItem("auth")
  location.reload()
}

const checkIfYou = (data) => {
  if (Array.isArray(data)) {
    data.forEach((msg) => {
      msg.you = msg.email === STATE.user.email
    })

    return data
  }

  data.you = data.email === STATE.user.email
  return data
}

class ChatWebSocket {
  #socket

  Start() {
    this.#socket = io(API_URL + "/chat", {
      auth: STATE.auth,
    })

    this.OnDisconnect()

    return new Promise((resolve, reject) => {
      this.#socket.on("message-initial", (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  OnReconnect(callback = () => {}) {
    const defaultReconnect = this.#socket.io.onreconnect
    this.#socket.io.onreconnect = function () {
      defaultReconnect.call(this)
      console.log("Socket reconnected!")
      callback()
    }
  }

  OnDisconnect(callback = () => {}) {
    this.#socket.on("disconnect", () => {
      console.log("Socket disconnected!")
      callback()
    })
  }

  /* 
  OnConnect(callback = () => {}) {
    if (this.#socket.connected) callback()
    else this.#socket.on("connect", callback)
  }

  WaitForConnection() {
    return new Promise((resolve, reject) => {
      this.OnConnect(resolve)
    })
  }
  
  */

  onNewMessage() {
    this.#socket.on("message-new", (data) => {
      callback(checkIfYou(data))
    })
  }

  sendNewMessage(msg) {
    return new Promise(async (resolve, reject) => {
      this.#socket.volatile.emit("message-new", msg, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  getNewerMessagesThanId(id) {
    return new Promise(async (resolve, reject) => {
      this.#socket.volatile.emit("message-getNewer", id, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  getOlderMessagesThanId(id) {
    return new Promise(async (resolve, reject) => {
      this.#socket.volatile.emit("message-getOlder", id, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }
}

export const Socket = new ChatWebSocket()
