import Chat from './chat.js'
import './_chat.scss'
import './_dropdown.scss'
import './_theme-toggle.scss'
import { refactorMessageBeforeSending } from '../../utils/utils.js'

class Chat_Form extends Chat {
  constructor() {
    super()
  }

  #chatForm = this._element.querySelector(`form`)

  #textArea = this.#chatForm.querySelector(`textarea`)

  #imageQueue = []

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
      if (!value) return

      callback({ msg: value, files: [...files.files] })
      event.target.reset()
      this.#textareaResizer(msg)
    }
  }

  focusTextArea() {
    this.#textArea.focus()
  }

  addTextAreaHandlers() {
    const form = this.#chatForm
    const button = this.#chatForm.querySelector(`button`)
    const file = this.#chatForm.querySelector('input[type=file]')

    form.onclick = this.focusTextArea()

    file.onchange = event => {
      this.#imageQueue.push(...event.target.files)
      event.target.value = ''
      console.log(this.#imageQueue)
    }

    this.#textArea.addEventListener('keydown', event => {
      if (event.keyCode !== 13 || event.shiftKey || event.ctrlKey) return
      event.preventDefault()
      button.click()
    })

    this.#textArea.addEventListener('input', () => {
      this.#textareaResizer()

      if (this.#textArea.value) {
        button.removeAttribute(`disabled`)
      } else {
        button.setAttribute(`disabled`, '')
      }
    })
  }
}

export default Chat_Form
