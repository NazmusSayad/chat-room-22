import Chat from './chat.js'
import './_chat.scss'
import './_dropdown.scss'
import './_theme-toggle.scss'
import { refactorMessageBeforeSending } from '../../utils/utils.js'

class Chat_Form extends Chat {
  constructor() {
    super()
  }

  _chatForm = this._element.querySelector(`form`)

  _textArea = this._chatForm.querySelector(`textarea`)

  _textareaResizer() {
    this._textArea.style.height = 'auto'
    const scrollHeight = this._textArea.scrollHeight
    this._textArea.style.height =
      scrollHeight > 120 ? '120px' : scrollHeight + 'px'
  }

  addMsgSubmitHandler(callback) {
    this._chatForm.onsubmit = event => {
      event.preventDefault()
      const { msg, files } = event.target
      const value = refactorMessageBeforeSending(msg.value)
      if (!value) return

      callback({ msg: value, files: files.files })
      event.target.reset()
      this._textareaResizer(msg)
    }
  }

  focusTextArea() {
    this._textArea.focus()
  }

  addTextAreaHandlers() {
    const form = this._chatForm
    const button = this._chatForm.querySelector(`button`)

    form.onclick = this.focusTextArea()

    this._textArea.addEventListener('keydown', event => {
      if (event.keyCode !== 13 || event.shiftKey || event.ctrlKey) return
      event.preventDefault()
      button.click()
    })

    this._textArea.addEventListener('input', () => {
      this._textareaResizer()

      if (this._textArea.value) {
        button.removeAttribute(`disabled`)
      } else {
        button.setAttribute(`disabled`, '')
      }
    })
  }
}

export default Chat_Form
