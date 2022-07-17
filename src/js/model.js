import { API_URL } from "./CONFIG"
import { getJSON } from "./HELPER"

export const STATE = {
  user: null,
  auth: null,
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

export const postMessage = async (msg) => {
  const res = await getJSON(API_URL + "/chat", {
    method: "POST",
    headers: {
      ...STATE.auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ msg }),
  })

  return res.data
}

export const getMessage = async () => {
  const res = await getJSON(API_URL + "/chats", {
    headers: STATE.auth,
  })

  return res.data
}

export const getMessageById = async (id) => {
  const res = await getJSON(API_URL + "/chats/" + id, {
    headers: STATE.auth,
  })

  return res.data
}

export const startChatLoop = (
  successCallback = (data) => console.log(data),
  errorCallback = (data) => console.warn(data)
) => {
  const xhr = new XMLHttpRequest()
  xhr.timeout = 25000
  xhr.addEventListener(
    "load",
    (e) => {
      successCallback(JSON.parse(e.target.response))
      startChatLoop(successCallback, errorCallback)
    },
    { once: true }
  )
  xhr.addEventListener(
    "error",
    (e) => {
      errorCallback(e)
    },
    { once: true }
  )
  xhr.addEventListener(
    "timeout",
    () => {
      startChatLoop(successCallback, errorCallback)
    },
    { once: true }
  )

  xhr.open("GET", API_URL + "/chat")
  xhr.setRequestHeader("email", STATE.auth.email)
  xhr.setRequestHeader("password", STATE.auth.password)

  xhr.send()
}

const saveAuthInfo = (data) => {
  localStorage.setItem(`auth`, JSON.stringify(data))
  loadAuthInfo()
}

const loadAuthInfo = () => {
  const data = JSON.parse(localStorage.getItem(`auth`))
  if (!data) return

  STATE.user = { _id: data?._id, name: data?.name, email: data?.email, dateJoin: data?.dateJoin }
  STATE.auth = { email: data?.email, password: data?.password }
}

// Init
;(() => {
  loadAuthInfo()
})()
