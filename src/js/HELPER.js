import { TIMEOUT_SEC } from "./CONFIG"

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${seconds} second`))
    }, seconds * 1000)
  })
}

export const getJSON = async (url) => {
  try {
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)])
    const data = await res.json()

    if (!res.ok) throw new Error(data.message + " " + data.status)
    return data
  } catch (error) {
    throw error
  }
}