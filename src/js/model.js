import { io } from "socket.io-client"
import { API_URL } from "./.config"
import { checkIfYou, getJSON } from "./utils"

export const STATE = {
  user: null,
  auth: null,
}

class ChatWebSocket {
  #socket

  Start() {
    this.#socket = io(API_URL + "/chat", {
      auth: STATE.auth,
    })

    this.onDisconnect()

    return new Promise((resolve, reject) => {
      this.#socket.on("message-initial", (data) => {
        resolve(checkIfYou(data))
      })
    })
  }

  OnReconnect(callback) {
    const defaultReconnect = this.#socket.io.onreconnect
    this.#socket.io.onreconnect = function () {
      defaultReconnect.call(this)
      console.log("Socket reconnected!")
      callback()
    }
  }

  /* 
  OnConnect(callback) {
    if (this.#socket.connected) callback()
    else this.#socket.on("connect", callback)
  }

  WaitForConnection() {
    return new Promise((resolve, reject) => {
      this.OnConnect(resolve)
    })
  }
  
  */

  OnDisconnect(callback) {
    this.#socket.on("disconnect", () => {
      console.log("Socket disconnected!")
      callback()
    })
  }

  onNewMessage(callback) {
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
