import { io } from "socket.io-client"
import { API_URL } from "./.config"
import { getJSON, Wait } from "./utils"
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
  localStorage.removeItem("token")
  location.reload()
}

const checkIfYou = function (data) {
  if (!Array.isArray(data)) data = [...arguments]

  data.forEach((msg) => {
    msg.you = msg.email === STATE.user.email
  })

  return data
}

class ChatWebSocket {
  #socket = null

  // Here -------------------------
  async Start() {
    // await Wait(5000)

    const socket = io(API_URL + "/chat", {
      auth: STATE.auth,
    })

    return new Promise((resolve, reject) => {
      socket.on("connect", () => {
        if (this.#socket) {
          this.#socket.destroy()
          this.#socket = null
        }

        this.#socket = socket

        this.#onReconnection()
        this.#receiveMessages()
        resolve()
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected!")
      })
    })
  }

  OnConnect(callback = () => {}) {
    if (this.#socket.connected) callback()
    else this.#socket.on("connect", callback)
  }

  WaitForConnection() {
    return new Promise((resolve, reject) => {
      this.OnConnect(resolve)
    })
  }

  onReconnection() {}
  #onReconnection() {
    const callback = this.onReconnection
    const onConnect = this.OnConnect
    const self = this

    const defaultReconnect = this.#socket.io.onreconnect
    this.#socket.io.onreconnect = function () {
      defaultReconnect.call(this)
      console.log("Socket reconnected!")
      onConnect.call(self, callback)
    }
  }

  receiveMessages() {}
  #receiveMessages() {
    this.#socket.on("message-new", (data) => {
      console.log(data)
      this.receiveMessages(checkIfYou(data))
    })
  }

  sendMessages(msgs) {
    if (!Array.isArray(msgs)) throw new Error("I want an array!")

    return new Promise((resolve, reject) => {
      this.#socket.emit("message-new", msgs, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  getInitialMessages() {
    return new Promise((resolve, reject) => {
      this.#socket.emit("message-initial", (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  getNewerMessagesThanId(id) {
    // Fix this
    return new Promise((resolve, reject) => {
      this.#socket.emit("message-getNewer", id, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  getOlderMessagesThanId(id) {
    return new Promise((resolve, reject) => {
      this.#socket.emit("message-getOlder", id, (data) => {
        resolve(checkIfYou(data))
      })
    })
  }
}

export const Socket = new ChatWebSocket()
