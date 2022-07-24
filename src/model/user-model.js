import { API_URL } from "../.config.js"
import { cryptoJs, getJSON } from "../utils/utils.js"

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
