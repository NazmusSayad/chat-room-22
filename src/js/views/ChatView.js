import markup from "../../components/chat.html"
import messageMarkup from "../../components/chatMessage.html"
import { getScrollBottom, HTML, newMessageNotification, simpleDate, textLinkify } from "../HELPER"
import { Views } from "./Views"

const iconSend_SVGColor = `#555`
const iconSend_SVG = `<svg viewBox="0 0 24 24" class="crt8y2ji"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" fill="${iconSend_SVGColor}"></path></svg>`
const finalMarkup = markup.replace("${Send}", iconSend_SVG)

class Chat extends Views {
  constructor() {
    super()
  }

  _element = new HTML(finalMarkup)

  #messageContainer = this._element.querySelector(`#chat-container`)

  _beforeRender() {
    document.title = "chat-room #22 | chat"
    Notification.requestPermission()
  }

  setLoadedClass() {
    this.#messageContainer.classList.add(`loaded`)
  }

  #generateMessageMarkup(data) {
    const element = new HTML(messageMarkup)

    const user = element.querySelector(`[user]`)
    const text = element.querySelector(`[text]`)
    user.textContent = data.name
    text.innerHTML = textLinkify(data.msg)

    if (data._id) {
      const isMsgAlreadyRendered = this.#messageContainer.querySelector(`[data-id="${data._id}"]`)
      if (isMsgAlreadyRendered) return false

      element.dataset.id = data._id
      text.title = simpleDate(data.sent)
    } else {
      element.dataset.status = "pending"
      text.title = "Sending"
    }

    if (data.you) {
      element.dataset.user = "you"
    }

    return element
  }

  appendMessage(data) {
    const element = this.#generateMessageMarkup(data)
    if (!element) return

    this.#messageContainer.appendChild(element)
    const scrollBottom = getScrollBottom(this.#messageContainer)
    const msgHeight_x4 = element.clientHeight * 4

    if (scrollBottom < msgHeight_x4 || data.you) {
      this.#messageContainer.scrollTop = this.#messageContainer.scrollHeight

      if (
        document.visibilityState === "hidden" &&
        this.#messageContainer.classList.contains(`loaded`)
      ) {
        newMessageNotification(data.user, data.msg)
      }
    } else {
      newMessageNotification(data.user, data.msg)
    }

    return element
  }

  prependMessage(data) {
    const element = this.#generateMessageMarkup(data)
    if (!element) return

    this.#messageContainer.prepend(element)
    this.#messageContainer.scrollTo(0, 1)
  }

  appendMessageSent(element, data) {
    element.dataset.id = data._id
    element.querySelector("p").title = simpleDate(data.sent)
    element.dataset.status = "sent"
  }

  addLoadMoreHandler(callback) {
    this.#messageContainer.onscroll = (event) => {
      if (event.target.scrollTop === 0) {
        const oldestMessage = this.#messageContainer.firstElementChild
        callback(oldestMessage)
      }
    }
  }

  addMsgSubmitHandler(callback) {
    this._element.querySelector(`#chat-form`).onsubmit = (event) => {
      event.preventDefault()
      const { msg } = event.target
      callback(msg.value)
      msg.value = ""
    }
  }

  addTextAreaHandlers() {
    const textarea = this._element.querySelector(`textarea`)

    textarea.addEventListener("keydown", function (event) {
      if (event.keyCode !== 13 || event.shiftKey || event.ctrlKey) return
      event.preventDefault()
      this.closest(`form`).querySelector(`[type="submit"]`).click()
      this.focus()
    })

    textarea.addEventListener("input", function () {
      let newLineCount = this.value.match(/\n/gim)?.length + 1 || 1
      if (newLineCount > 4) newLineCount = 4
      this.setAttribute(`rows`, newLineCount)
    })
  }

  addLogoutHandler(callback) {}
}

export default new Chat()
