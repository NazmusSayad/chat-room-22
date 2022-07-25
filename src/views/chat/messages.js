import Chat_Form from "./form.js"
import messageMarkup from "./chatMessage.html"
import "./_chat.scss"
import "./_dropdown.scss"
import "./_theme-toggle.scss"
import {
  getScrollBottom,
  HTML,
  newMessageNotification,
  simplifyDate,
  makeTextReadyForRender,
} from "../../utils/utils.js"

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

  _generateMessageMarkup(data, deleteHandler) {
    const element = new HTML(messageMarkup)
    const user = element.querySelector(`[user]`)
    const text = element.querySelector(`[text]`)
    user.textContent = data.name
    text.innerHTML = makeTextReadyForRender(data.msg)

    if (data._id) {
      const isMsgAlreadyRendered = this._messageContainer.querySelector(`[data-id="${data._id}"]`)
      if (isMsgAlreadyRendered) {
        return false
      }

      element.dataset.id = data._id
      text.title = simplifyDate(data.sent)
    } else {
      element.dataset.status = "pending"
      text.title = "Sending..."
    }

    if (data.you) {
      element.addEventListener("click", () => {
        this.deleteMessageListner(element.dataset.id)
      })
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

  appendMessage(data, deleteHandler) {
    const element = this._generateMessageMarkup(data, deleteHandler)
    if (!element) return
    const lastSentMessage = this.getLastSentMessage()

    if (data._id && lastSentMessage) {
      lastSentMessage.after(element)
    } else {
      this._messageContainer.appendChild(element)
    }

    if (this.ifNeedsToScroll() || data.you) {
      this.scrollToBottom()
      if (document.visibilityState === "hidden" && this._loaded) {
        newMessageNotification(data.name, data.msg)
      }
    } else {
      newMessageNotification(data.name, data.msg)
    }

    return element
  }

  prependMessage(data, deleteHandler) {
    const element = this._generateMessageMarkup(data, deleteHandler)
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

  deleteMessage(id) {
    const element = this._messageContainer.querySelector(`.message[data-id="${id}"]`)
    element.remove()
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

export default Chat_Form_Messages
