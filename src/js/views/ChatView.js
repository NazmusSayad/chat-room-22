import markup from "../../components/chat.html"
import { HTML } from "../HELPER"
import { Views } from "./Views"

class Chat extends Views {
  _element = new HTML(markup)

  constructor() {
    super()
  }

  #messageContainer = this._element.querySelector(`#chat-container`)

  appendMessage(data) {
    const element = new HTML(`
    <div>
    ${data.name}: ${data.msg} 
    </div>
    `)

    this.#messageContainer.append(element)
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
