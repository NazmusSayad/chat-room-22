import { TIMEOUT_SEC } from "./CONFIG"
import anchorme from "anchorme"

const timeout = function (seconds = TIMEOUT_SEC) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${seconds} second`))
    }, seconds * 1000)
  })
}

export const getJSON = async function () {
  try {
    const res = await Promise.race([timeout(), fetch(...arguments)])
    const data = await res.json()

    if (!res.ok) throw new Error(data.message + " " + data.status)
    return data
  } catch (error) {
    throw error
  }
}

export const HTML = function (body = "<div></div>") {
  return new DOMParser().parseFromString(body, "text/html").body.firstElementChild
}

export const simpleDate = (date) => {
  date = new Date(date)
  return date.toLocaleString()
}

export const textLinkify = (input) => {
  input = input.replace(/</gim, "&lt;")
  input = input.replace(/\n/gm, "<br/>")

  return anchorme({
    input,
    options: {
      attributes: {
        target: "_blank",
        class: "message-link",
      },
    },
  })
}

export const newMessageNotification = async (user = "Random", body = "") => {
  await Notification.requestPermission()
  if (Notification.permission === "denied") return

  const id = String(Math.random())
  const title = "New message from: " + user
  const notification = new Notification(title, {
    body,
    vibrate: [1],
    tag: id,
  })

  Wait(5000)
  notification.close()
}

export const Wait = function (duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

export const getScrollBottom = (element) => {
  const offset = element.scrollTop + element.clientHeight
  const height = element.scrollHeight
  return height - offset
}
