import { TIMEOUT_SEC } from "./CONFIG"

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${seconds} second`))
    }, seconds * 1000)
  })
}

export const getJSON = async function () {
  try {
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(...arguments)])
    const data = await res.json()

    if (!res.ok) throw new Error(data.message + " " + data.status)
    return data
  } catch (error) {
    throw error
  }
}

export const HTML = function (body = "<div></div>") {
  // return new DOMParser().parseFromString(body, "text/html").body.firstElementChild

  const element = document.createElement("div")
  element.innerHTML = body
  return element.firstElementChild
}

export const simpleDate = (date) => {
  date = new Date(date)
  return date.toLocaleString()
}


