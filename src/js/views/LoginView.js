import markup from "../../components/login.html"
import { HTML } from "../HELPER"
import { Views } from "./Views"

class Login extends Views {
  constructor() {
    super()
  }

  _element = new HTML(markup)

  addSubmitHandler(callback) {
    this._element.querySelector(`#login-form`).onsubmit = (event) => {
      event.preventDefault()
      const { email, password } = event.target

      callback({ email: email.value, password: password.value })
    }
  }

  addSignupHandler(callback) {
    this._element.querySelector(`#goto-signup-btn`).onclick = (event) => callback(event)
  }
}

export default new Login()
