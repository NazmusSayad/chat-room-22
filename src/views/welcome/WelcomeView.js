import markup from './welcome.html'
import loginMarkup from './login.html'
import signupMarkup from './signup.html'
import './_welcome.scss'
import { HTML } from '../../utils/utils.js'
import { Views } from '../Views.js'

class Welcome extends Views {
  constructor() {
    super()

    // TODO: Need Refactor!!

    const name = this.#signupForm.name
    const emails = [this.#signupForm.email, this.#loginForm.email]
    const passwords = [this.#signupForm.password, this.#loginForm.password]

    passwords.forEach(password => {
      password.nextElementSibling.addEventListener('click', function () {
        this.classList.toggle('fa-eye')
        this.classList.toggle('fa-eye-slash')

        const passAttr = password.getAttribute('type')
        password.setAttribute(
          'type',
          passAttr === 'password' ? 'text' : 'password'
        )
      })
    })

    name.onchange = () => {
      name.oninput = function () {
        if (this.value === ' ') return (this.value = '')
        if (this.value.endsWith('  '))
          return (this.value = this.value.slice(0, -1))

        const regEx = new RegExp(this.getAttribute(`pattern`))
        const matchRegEx = this.value.match(regEx)?.length
        if (this.value.length < 3 || this.value.length > 14 || !matchRegEx) {
          this.className = `error`
        } else this.className = ``
      }
    }

    for (let email of emails) {
      email.onchange = () => {
        email.oninput = function () {
          const matchRegEx = this.value.match(
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          )?.length
          if (matchRegEx) {
            this.className = ``
          } else this.className = `error`
        }
      }
    }

    for (let password of passwords) {
      password.onchange = () => {
        password.oninput = function () {
          if (this.value.length < 6 || this.value.length > 24) {
            this.className = `error`
          } else this.className = ``
        }
      }
    }
  }

  _element = new HTML(markup)

  #loginForm = new HTML(loginMarkup)

  #signupForm = new HTML(signupMarkup)

  #formContainer = this._element.querySelector(`#form-container`)

  _beforeRender() {
    document.title = 'chat-room #22'
  }

  showSignUp() {
    document.title = 'chat-room #22 | SignUp'
    this._element.setAttribute(`view`, 'sign-up')
    this.#formContainer.innerHTML = ''
    this.#formContainer.appendChild(this.#signupForm)
  }

  showLogin() {
    document.title = 'chat-room #22 | Login'
    this._element.setAttribute(`view`, 'log-in')
    this.#formContainer.innerHTML = ''
    this.#formContainer.appendChild(this.#loginForm)
  }

  addLoginViewHandler(callback) {
    const buttons = [
      this._element.querySelector(`#goto-login-btn`),
      this.#signupForm.querySelector(`#goto-login-btn-2`),
    ]

    buttons.forEach(button => {
      button.onclick = event => callback(event)
    })
  }

  addSignupViewHandler(callback) {
    const buttons = [
      this._element.querySelector(`#goto-signup-btn`),
      this.#loginForm.querySelector(`#goto-signup-btn-2`),
    ]

    buttons.forEach(button => {
      button.onclick = event => callback(event)
    })
  }

  #disabledButtons = []

  disableButtons() {
    const allButtons = document.querySelectorAll('button')
    this.#disabledButtons = allButtons

    allButtons.forEach(button => button.setAttribute('disabled', ''))
  }

  enableButtons() {
    this.#disabledButtons.forEach(button => button.removeAttribute('disabled'))
  }

  addLoginSubmitHandlers(callback) {
    this.#loginForm.onsubmit = event => {
      event.preventDefault()
      const { email, password } = event.target
      this.disableButtons()

      callback({
        email: email.value,
        password: password.value,
      })
    }
  }

  addSignupSubmitHandlers(callback) {
    this.#signupForm.onsubmit = event => {
      event.preventDefault()
      const { name, email, password } = event.target
      this.disableButtons()

      callback({
        name: name.value,
        email: email.value,
        password: password.value,
      })
    }
  }
}

export default new Welcome()
