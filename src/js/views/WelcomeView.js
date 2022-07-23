import markup from "../../components/welcome.html"
import loginMarkup from "../../components/login.html"
import signupMarkup from "../../components/signup.html"
import { HTML } from "../utils.js"
import { Views } from "./Views"

class Welcome extends Views {
  constructor() {
    super()
  }

  _element = new HTML(markup)

  _loginForm = new HTML(loginMarkup)

  _signupForm = new HTML(signupMarkup)

  _formContainer = this._element.querySelector(`#form-container`)

  _beforeRender() {
    document.title = "chat-room #22"
    console.log(this._formContainer)
  }

  showSignUp() {
    this._element.setAttribute(`view`, "sign-up")
    this._formContainer.innerHTML = ""
    this._formContainer.appendChild(this._signupForm)
  }
  showLogin() {
    this._element.setAttribute(`view`, "log-in")
    this._formContainer.innerHTML = ""
    this._formContainer.appendChild(this._loginForm)
  }

  addLoginViewHandler(callback) {
    this._element.querySelector(`#goto-login-btn`).onclick = (event) => callback(event)
  }

  addSignupViewHandler(callback) {
    this._element.querySelector(`#goto-signup-btn`).onclick = (event) => callback(event)
  }

  addFormSubmitHandlers() {}

  addFormInputHandlers() {
    console.log(this._loginForm)
  }
}

/* 
  addSignupSubmitHandler(callback) {
    const form = this._element.querySelector(`#signup-form`)
    const { name, email, password } = form

    name.oninput = function () {
      if (this.value === " ") return (this.value = "")
      if (this.value.endsWith("  ")) return (this.value = this.value.slice(0, -1))

      const regEx = new RegExp(this.getAttribute(`pattern`))
      const matchRegEx = this.value.match(regEx)?.length
      if (this.value.length < 3 || this.value.length > 14 || !matchRegEx) {
        this.className = `error`
      } else this.className = ``
    }

    email.oninput = function () {
      const matchRegEx = this.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)?.length
      if (matchRegEx) {
        this.className = ``
      } else this.className = `error`
    }

    password.oninput = function () {
      if (this.value.length < 6 || this.value.length > 24) {
        this.className = `error`
      } else this.className = ``
    }

    form.onsubmit = (event) => {
      event.preventDefault()
      callback({ name: name.value, email: email.value, password: password.value })
    }
  } */

export default new Welcome()
