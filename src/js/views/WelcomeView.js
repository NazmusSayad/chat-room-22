import markup from "../../components/welcome.html"
import { HTML } from "../HELPER"
import { Views } from "./Views"

class Welcome extends Views {
  _element = new HTML(markup)

  constructor() {
    super()
  }

  addLoginHandler(callback) {
    this._element.querySelector(`#goto-login-btn`).onclick = (event) => callback(event)
  }

  addSignupHandler(callback) {
    this._element.querySelector(`#goto-signup-btn`).onclick = (event) => callback(event)
  }
}

export default new Welcome()
