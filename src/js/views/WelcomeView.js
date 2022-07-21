import markup from "../../components/welcome.html"
import { HTML } from "../utils.js"
import { Views } from "./Views"

class Welcome extends Views {
  constructor() {
    super()
  }

  _element = new HTML(markup)

  _beforeRender() {
    document.title = "chat-room #22"
  }

  addLoginHandler(callback) {
    this._element.querySelector(`#goto-login-btn`).onclick = (event) => callback(event)
  }

  addSignupHandler(callback) {
    this._element.querySelector(`#goto-signup-btn`).onclick = (event) => callback(event)
  }
}

export default new Welcome()
