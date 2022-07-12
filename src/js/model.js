import { API_URL } from "./CONFIG"

const startChatLoop = (
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
      console.log("Started...")
      startChatLoop(successCallback, errorCallback)
    },
    { once: true }
  )

  xhr.open("GET", API_URL + "/chat/")
  xhr.setRequestHeader("email", "online2sayad@gmail.com")
  xhr.setRequestHeader("password", "hello")

  xhr.send()
}

startChatLoop(
  ({ data }) => {
    console.log(data)
    document.body.innerHTML += data.name + ": " + data.msg + "<br/>"
  },
  (e) => {
    console.log(e)
    document.body.innerHTML += "<br/>OPS Network gone!<br/>"
  }
)
