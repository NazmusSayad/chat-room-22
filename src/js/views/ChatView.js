import markup from "../../components/chat.html"
import { HTML } from "../HELPER"
import { Views } from "./Views"

class Chat extends Views {
  constructor() {
    super()
  }

  _element = new HTML(markup)

  #messageContainer = this._element.querySelector(`#chat-container`)

  #generateMessageMarkup(data) {
    const element = new HTML(`
      <div>
        ${data.name}: ${data.msg} 
      </div>
      `)

    if (data._id) {
      element.dataset.id = data._id
      const isMsgAlreadyRendered = this.#messageContainer.querySelector(`[data-id="${data._id}"]`)
      if (isMsgAlreadyRendered) return false
    } else {
      element.dataset.status = "pending"
    }

    if (data.you) {
      element.dataset.user = "you"
    }

    element.title = `<${data.name}>${data.email}`
    return element
  }

  addLoadMoreHandler(callback) {
    // TODO
    // Add an event to fix me...

    const oldestMessage = this.#messageContainer.firstElementChild
    callback(oldestMessage.dataset.id)
  }

  appendMessage(data) {
    const element = this.#generateMessageMarkup(data)

    if (!element) return
    this.#messageContainer.appendChild(element)
    return element
  }

  prependMessage(data) {
    const element = this.#generateMessageMarkup(data)
    if (!element) return
    this.#messageContainer.prepend(element)
  }

  appendMessageSent(element, id) {
    element.dataset.id = id
    element.dataset.status = "sent"
  }

  addMsgSubmitHandler(callback) {
    this._element.querySelector(`#chat-form`).onsubmit = () => {
      event.preventDefault()
      const { msg } = event.target
      callback(msg.value)
      msg.value = ""
    }
  }

  addLogoutHandler(callback) {}
}

export default new Chat()
