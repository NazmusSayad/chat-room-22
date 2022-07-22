import markup from "../../components/chat.html"
import messageMarkup from "../../components/chatMessage.html"
import {
  getScrollBottom,
  HTML,
  newMessageNotification,
  refactorMessageBeforeSending,
  simplifyDate,
  textLinkify,
} from "../utils.js"
import { Views } from "./Views"

class Chat extends Views {
  constructor() {
    super()
  }

  _element = (() => {
    const iconSend_SVGColor = `#555`
    const iconSend_SVG = `<svg viewBox="0 0 24 24" class="crt8y2ji"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" fill="${iconSend_SVGColor}"></path></svg>`
    const finalMarkup = markup.replace("${Send}", iconSend_SVG)

    return new HTML(finalMarkup)
  })()

  _beforeRender() {
    document.title = "chat-room #22 | chat"
    Notification.requestPermission()
  }

  addEditProfileHandler(callback) {
    const target = this._element.querySelector(`#edit-profile`)

    target.onclick = () => {
      callback()
    }
  }

  addLogoutHandler(callback) {
    const target = this._element.querySelector(`#logout`)
    target.onclick = () => {
      callback()
    }
  }
}

class Chat_Form extends Chat {
  constructor() {
    super()
  }

  _chatForm = this._element.querySelector(`form`)

  _textareaResizer(textarea) {
    textarea.style.height = "auto"
    const scrollHeight = textarea.scrollHeight
    textarea.style.height = scrollHeight > 120 ? "120px" : scrollHeight + "px"
  }

  addMsgSubmitHandler(callback) {
    this._chatForm.onsubmit = (event) => {
      event.preventDefault()
      const { msg } = event.target
      const value = refactorMessageBeforeSending(msg.value)
      if (value === " ") return
      callback(value)
      msg.value = ""
      this._textareaResizer(msg)
    }
  }

  addTextAreaHandlers() {
    const form = this._chatForm
    const button = this._chatForm.querySelector(`button`)
    const textarea = this._chatForm.querySelector(`textarea`)

    form.onclick = () => {
      textarea.focus()
    }

    textarea.addEventListener("keydown", (event) => {
      if (event.keyCode !== 13 || event.shiftKey || event.ctrlKey) return
      event.preventDefault()
      button.click()
    })

    textarea.addEventListener("input", () => {
      this._textareaResizer(textarea)

      if (textarea.value) {
        // form.removeAttribute(`hideButton`)
        button.removeAttribute(`disabled`)
      } else {
        // form.setAttribute(`hideButton`, "")
        button.setAttribute(`disabled`, "")
      }
    })
  }
}

class Chat_Form_Messages extends Chat_Form {
  constructor() {
    super()
  }

  _loaded = false

  _messageContainer = this._element.querySelector(`#chat-container`)

  getLastSentMessage() {
    const firstPendingMessage = this._messageContainer.querySelector(`[data-status="pending"]`)
    if (firstPendingMessage) {
      return firstPendingMessage.previousElementSibling
    }
    return this._messageContainer.lastElementChild
  }

  getPendingMessages() {
    const elements = this._messageContainer.querySelectorAll(`[data-status="pending"]`)
    elements.forEach((element) => {
      element.msg = element.querySelector(`[text]`).textContent
    })
    return [...elements]
  }

  setLoadedClass() {
    this._loaded = true
  }

  _generateMessageMarkup(data) {
    const element = new HTML(messageMarkup)

    const user = element.querySelector(`[user]`)
    const text = element.querySelector(`[text]`)
    user.textContent = data.name
    text.innerHTML = textLinkify(data.msg)

    if (data._id) {
      const isMsgAlreadyRendered = this._messageContainer.querySelector(`[data-id="${data._id}"]`)
      if (isMsgAlreadyRendered) {
        console.log(data)
        return false
      }

      element.dataset.id = data._id
      text.title = simplifyDate(data.sent)
    } else {
      element.dataset.status = "pending"
      text.title = "Sending"
    }

    if (data.you) {
      element.dataset.user = "you"
    }

    return element
  }

  ifNeedsToScroll() {
    const scrollBottom = getScrollBottom(this._messageContainer)
    const skipHeight = this._messageContainer.clientHeight

    return scrollBottom < skipHeight
  }

  scrollToBottom() {
    this._messageContainer.scrollTo({
      top: this._messageContainer.scrollHeight,
      left: 0,
      behavior: this._loaded ? "smooth" : "auto",
    })
  }

  appendMessage(data) {
    const element = this._generateMessageMarkup(data)
    if (!element) return
    const lastSentMessage = this.getLastSentMessage()

    if (data._id && lastSentMessage) {
      console.log(lastSentMessage)
      lastSentMessage.after(element)
    } else {
      this._messageContainer.appendChild(element)
    }

    if (this.ifNeedsToScroll() || data.you) {
      this.scrollToBottom()
      if (document.visibilityState === "hidden" && this._loaded) {
        newMessageNotification(data.user, data.msg)
      }
    } else {
      newMessageNotification(data.user, data.msg)
    }

    return element
  }

  prependMessage(data) {
    const element = this._generateMessageMarkup(data)
    if (!element) return

    const scrollBottom = getScrollBottom(this._messageContainer)
    this._messageContainer.prepend(element)

    const scp =
      this._messageContainer.scrollHeight - scrollBottom - this._messageContainer.clientHeight
    this._messageContainer.scrollTo({
      top: scp,
      left: 0,
      behavior: "auto",
    })
  }

  appendMessageSent(element, data) {
    element.dataset.id = data._id
    element.querySelector("[text]").title = simplifyDate(data.sent)
    element.dataset.status = "sent"
  }

  async addLoadMoreHandler(callback) {
    while (this._messageContainer.scrollTop === 0) {
      const oldestMessage = this._messageContainer.firstElementChild
      const isNoMessageFound = await callback(oldestMessage)
      if (isNoMessageFound) break
    }

    this._messageContainer.onscroll = (event) => {
      if (event.target.scrollTop === 0) {
        const oldestMessage = this._messageContainer.firstElementChild
        callback(oldestMessage)
      }
    }
  }
}

export default new Chat_Form_Messages()
