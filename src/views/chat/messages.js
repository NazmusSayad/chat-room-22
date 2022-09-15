import Chat_Form from './form.js'
import messageMarkup from './chatMessage.html'
import './_chat.scss'
import './_dropdown.scss'
import './_theme-toggle.scss'
import {
  getScrollBottom,
  HTML,
  newMessageNotification,
  simplifyDate,
  makeTextReadyForRender,
} from '../../utils/utils.js'

class Chat_Form_Messages extends Chat_Form {
  constructor() {
    super()
  }

  #loaded = false

  #messageContainer = this._element.querySelector(`#chat-container`)

  getLastSentMessage() {
    const firstPendingMessage = this.#messageContainer.querySelector(
      `[data-status="pending"]`
    )

    if (firstPendingMessage) {
      return firstPendingMessage.previousElementSibling
    }
    return this.#messageContainer.lastElementChild
  }

  getPendingMessages() {
    const elements = this.#messageContainer.querySelectorAll(
      `[data-status="pending"]`
    )
    elements.forEach(element => {
      element.msg = element.querySelector(`.paragraph`).textContent
    })

    return [...elements]
  }

  setLoadedClass() {
    this.#loaded = true
  }

  #generateImagesMarkup(images) {
    return images.map(imgSrc => {
      if (typeof imgSrc !== 'string') imgSrc = URL.createObjectURL(imgSrc)
      const imgElement = document.createElement('img')
      imgElement.src = imgSrc
      return imgElement
    })
  }

  #generateMessageMarkup(data) {
    const element = new HTML(messageMarkup)
    const imageContainer = element.querySelector('.images') // DEV
    const images = this.#generateImagesMarkup(data.files)

    const user = element.querySelector(`.user`)
    const text = element.querySelector(`.paragraph`)
    user.textContent = data.name
    text.innerHTML = makeTextReadyForRender(data.msg)
    imageContainer.append(...images)

    if (data._id) {
      const isMsgAlreadyRendered = this.#messageContainer.querySelector(
        `[data-id="${data._id}"]`
      )
      if (isMsgAlreadyRendered) {
        return false
      }

      element.dataset.id = data._id
      text.title = simplifyDate(data.sent)
    } else {
      element.dataset.status = 'pending'
      text.title = 'Sending...'
    }

    if (data.you) {
      element.dataset.user = 'you'

      // Phone delete feature... turned of bcz of css classes
      /*
      element.addEventListener('click', () => {
        element.classList.toggle(`showDeleteBtn`)
        this._messageContainer.querySelectorAll(`.showDeleteBtn`).forEach(prevElement => {
          if (prevElement.isEqualNode(element)) return

          prevElement.classList.remove(`showDeleteBtn`)
        })
      })
      */

      const deleteButton = element.querySelector(`.delete`)
      deleteButton.addEventListener(
        'click',
        () => {
          this.deleteMessageListner(element.dataset.id)
        },
        { once: true }
      )
    }

    return element
  }

  ifNeedsToScroll() {
    const scrollBottom = getScrollBottom(this.#messageContainer)
    const skipHeight = this.#messageContainer.clientHeight

    return scrollBottom < skipHeight
  }

  scrollToBottom() {
    this.#messageContainer.scrollTo({
      top: this.#messageContainer.scrollHeight,
      left: 0,
      behavior: this.#loaded ? 'smooth' : 'auto',
    })
  }

  appendMessage(data) {
    const element = this.#generateMessageMarkup(data)
    if (!element) return
    const lastSentMessage = this.getLastSentMessage()

    if (data._id && lastSentMessage) {
      lastSentMessage.after(element)
    } else {
      this.#messageContainer.appendChild(element)
    }

    if (this.ifNeedsToScroll() || data.you) {
      this.scrollToBottom()
      if (document.visibilityState === 'hidden' && this.#loaded) {
        newMessageNotification(data.name, data.msg)
      }
    } else {
      newMessageNotification(data.name, data.msg)
    }

    return element
  }

  prependMessage(data) {
    const element = this.#generateMessageMarkup(data)
    if (!element) return

    const scrollBottom = getScrollBottom(this.#messageContainer)
    this.#messageContainer.prepend(element)

    const scrollPos =
      this.#messageContainer.scrollHeight -
      scrollBottom -
      this.#messageContainer.clientHeight
    this.#messageContainer.scrollTo({
      top: scrollPos,
      left: 0,
      behavior: 'auto',
    })
  }

  appendMessageSent(element, data) {
    element.dataset.id = data._id
    element.querySelector('.paragraph').title = simplifyDate(data.sent)
    element.dataset.status = 'sent'
  }

  deleteMessage(id) {
    const element = this.#messageContainer.querySelector(
      `.message[data-id="${id}"]`
    )
    element.addEventListener('animationend', element.remove)
    element.classList.add(`deleteMode`)
  }

  async addLoadMoreHandler(callback) {
    while (this.#messageContainer.scrollTop === 0) {
      const oldestMessage = this.#messageContainer.firstElementChild
      const isNoMessageFound = await callback(oldestMessage)
      if (isNoMessageFound) break
    }

    this.#messageContainer.onscroll = event => {
      if (event.target.scrollTop === 0) {
        const oldestMessage = this.#messageContainer.firstElementChild
        callback(oldestMessage)
      }
    }
  }
}

export default Chat_Form_Messages
