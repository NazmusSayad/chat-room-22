import Chat from './chat.js'
import './_chat.scss'
import './_dropdown.scss'
import './_theme-toggle.scss'
import { refactorMessageBeforeSending } from '../../utils/utils.js'

class Chat_Form extends Chat {
  constructor() {
    super()

    const enableDisableSendButton = () => {
      if (this.#textArea.value || fileInput.files.length > 0) {
        button.removeAttribute(`disabled`)
      } else {
        button.setAttribute(`disabled`, '')
      }
    }

    const form = this.#chatForm
    const button = this.#chatForm.querySelector(`button`)
    const fileInput = this.#chatForm.querySelector(`input[type="file"]`)

    form.onclick = this.focusTextArea()

    fileInput.onchange = () => {
      fileInput.parentElement.dataset.files = fileInput.files.length || ''
      enableDisableSendButton()
      this.focusTextArea()
    }

    form.onreset = () => {
      fileInput.parentElement.dataset.files = ''
      enableDisableSendButton()
    }

    this.#textArea.addEventListener('keydown', event => {
      if (event.keyCode !== 13 || event.shiftKey || event.ctrlKey) return
      event.preventDefault()
      button.click()
    })

    this.#textArea.addEventListener('input', () => {
      this.#textareaResizer()
      enableDisableSendButton()
    })
  }

  #chatForm = this._element.querySelector(`form`)

  #textArea = this.#chatForm.querySelector(`textarea`)

  #textareaResizer() {
    this.#textArea.style.height = 'auto'
    const scrollHeight = this.#textArea.scrollHeight
    this.#textArea.style.height =
      scrollHeight > 120 ? '120px' : scrollHeight + 'px'
  }

  addMsgSubmitHandler(callback) {
    this.#chatForm.onsubmit = event => {
      event.preventDefault()
      const { msg, files } = event.target
      const value = refactorMessageBeforeSending(msg.value)

      callback({ msg: value, files: [...files.files] })
      event.target.reset()
      this.#textareaResizer(msg)
    }
  }

  focusTextArea() {
    this.#textArea.focus()
  }
}

export default Chat_Form
