import { TIMEOUT_SEC } from "./CONFIG"
import anchorme from "anchorme"
import BadWordList from "../bad-words.json"
import CustomReplaceWords from "../custom-replace-words.json"

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

export const simplifyDate = (date) => {
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

export const newMessageNotification = async (user = "Someone", body = "") => {
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

export const replaceIndividualWords = (text = "") => {
  CustomReplaceWords.forEach(([word, newWord, caseIns]) => {
    const isCaseInsensitive = caseIns ? "i" : ""
    const regex = new RegExp("^" + word + "$", "gm" + isCaseInsensitive)
    text = text.replace(regex, newWord)
  })

  BadWordList.forEach((word) => {
    const regex = new RegExp("^" + word + "$", "igm")
    text = text.replace(regex, new Array(word.length).fill("🛇").join(""))

    const regex2 = new RegExp(word.split("").join("\n"), "igm")
    text = text.replace(regex2, new Array(word.length).fill("🛇").join("\n"))
  })

  return text
}

export const removeDuplicateLinesOrSpaces = (text = "") => {
  while (text.includes("\n\n")) {
    text = text.replace(/\n\n/gim, "\n")
  }

  while (text.includes("  ")) {
    text = text.replace(/  /gim, " ")
  }

  return text
}

export const refactorMessageBeforeSending = (msg = "") => {
  msg = removeDuplicateLinesOrSpaces(msg)
  msg = replaceIndividualWords(msg)
  return msg
}
