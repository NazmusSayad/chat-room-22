import { cryptoJs } from "../utils/utils.js"

export default {
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

  isLoadMoreMessageReqRunning: false,
}
