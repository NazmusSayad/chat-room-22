import { io } from "socket.io-client"
import { API_URL } from "../.config"
import STATE from "./STATE"

let init = false
let Socket = null

const checkIfYou = function (data) {
  if (!Array.isArray(data)) data = [...arguments]

  data.forEach(msg => {
    msg.you = msg.email === STATE.user.email
  })

  return data
}

export const Start = () => {
  Socket = io(API_URL + "/chat", {
    auth: STATE.auth,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500,
    reconnectionAttempts: Infinity,
  })

  return new Promise((resolve, reject) => {
    Socket.on("disconnect", () => {
      handlers.onDisconnect()
    })

    Socket.on("connect", () => {
      if (init) {
        handlers.onReconnection()
      } else {
        init = true
        onDeleteMessage()
        onReceiveMessages()
        setTimeout(resolve, 50)
      }
    })
  })
}

export const status = () => {
  return Socket.connected
}

export const OnConnect = callback => {
  if (Socket.connected) callback()
  else Socket.on("connect", callback)
}

export const WaitForConnection = async () => {
  return new Promise(resolve => {
    OnConnect(resolve)
  })
}

const onDeleteMessage = () => {
  Socket.on("message-delete", id => {
    handlers.onDeleteMessages(id)
  })
}

const onReceiveMessages = () => {
  Socket.on("message-new", data => {
    handlers.onReceiveMessages(checkIfYou(data))
  })
}

export const sendMessages = msgs => {
  if (!Array.isArray(msgs)) throw new Error("I want an array!")

  return new Promise(resolve => {
    Socket.volatile.emit("message-new", msgs, data => {
      resolve(checkIfYou(data))
    })
  })
}

export const deleteMessage = id => {
  return new Promise(resolve => {
    Socket.volatile.emit("message-delete", id, data => {
      resolve(data)
    })
  })
}

export const getInitialMessages = () => {
  return new Promise(resolve => {
    Socket.volatile.emit("message-initial", data => {
      resolve(checkIfYou(data))
    })
  })
}

export const getNewerMessagesThanId = id => {
  return new Promise(resolve => {
    Socket.volatile.emit("message-getNewer", id, data => {
      resolve(checkIfYou(data))
    })
  })
}

export const getOlderMessagesThanId = id => {
  return new Promise(resolve => {
    Socket.volatile.emit("message-getOlder", id, data => {
      resolve(checkIfYou(data))
    })
  })
}

export const handlers = {
  onReconnection: () => {},
  onDisconnect: () => {},
  onReceiveMessages: messages => {},
  onDeleteMessages: id => {},
}
