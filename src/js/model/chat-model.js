import { io } from "socket.io-client"
import { API_URL } from "../.config"
import { STATE } from "./user-model"

let init = false
let Socket = null

const checkIfYou = function (data) {
  if (!Array.isArray(data)) data = [...arguments]

  data.forEach((msg) => {
    msg.you = msg.email === STATE.user.email
  })

  return data
}

export const Start = () => {
  Socket = io(API_URL + "/chat", {
    auth: STATE.auth,
  })

  return new Promise((resolve, reject) => {
    Socket.on("connect", () => {
      
      if (init) {
        handlers.onReconnection()
      } else {
        console.log("Socket connected!")
        init = true
        receiveMessages()
        resolve()
      }
    })

    Socket.on("disconnect", () => {
      console.log("Socket disconnected!")
    })
  })
}

export const status = () => {
  return Socket.connected
}

export const OnConnect = (callback) => {
  if (Socket.connected) callback()
  else Socket.on("connect", callback)
}

export const WaitForConnection = async () => {
  return new Promise((resolve, reject) => {
    OnConnect(resolve)
  })
}

export const receiveMessages = () => {
  Socket.on("message-new", (data) => {
    console.log({ data })
    handlers.receiveMessages(checkIfYou(data))
  })
}

export const sendMessages = (msgs) => {
  if (!Array.isArray(msgs)) throw new Error("I want an array!")

  return new Promise((resolve, reject) => {
    Socket.volatile.emit("message-new", msgs, (data) => {
      resolve(checkIfYou(data))
    })
  })
}

export const getInitialMessages = () => {
  return new Promise((resolve, reject) => {
    Socket.volatile.emit("message-initial", (data) => {
      resolve(checkIfYou(data))
    })
  })
}

export const getNewerMessagesThanId = (id) => {
  // Fix this
  return new Promise((resolve, reject) => {
    Socket.volatile.emit("message-getNewer", id, (data) => {
      resolve(checkIfYou(data))
    })
  })
}

export const getOlderMessagesThanId = (id) => {
  return new Promise((resolve, reject) => {
    Socket.volatile.emit("message-getOlder", id, (data) => {
      resolve(checkIfYou(data))
    })
  })
}

export const handlers = {
  onReconnection: () => {},
  receiveMessages: (messages) => {},
}
