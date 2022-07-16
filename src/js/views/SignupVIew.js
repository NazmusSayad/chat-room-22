import markup from "../../components/signup.html"
import { HTML } from "../HELPER"
import { Views } from "./Views"

class Welcome extends Views {
  constructor() {
    super()
  }

  _element = new HTML(markup)

  addSubmitHandler(callback) {
    this._element.querySelector(`#signup-form`).onsubmit = (event) => {
      event.preventDefault()

      const { name, email, password } = event.target
      callback({ name: name.value, email: email.value, password: password.value })
    }
  }

  addLoginHandler(callback) {
    this._element.querySelector(`#goto-login-btn`).onclick = (event) => callback(event)
  }
}

export default new Welcome()
