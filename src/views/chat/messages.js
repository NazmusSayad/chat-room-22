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

    this.#imageModal.onclick = ({ target, currentTarget }) => {
      target.closest('.content') || currentTarget.classList.remove('show')
    }
  }

  #loaded = false

  #messageContainer = this._element.querySelector(`#chat-container`)

  #imageModal = this._element.querySelector('#image-modal')

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

  #showImageModal(imgSrc) {
    const modalImg = this.#imageModal.querySelector('img')
    this.#imageModal.classList.add('show')
    modalImg.src = imgSrc
  }

  #generateImagesMarkup(data) {
    return data.files.map(imgSrc => {
      if (typeof imgSrc !== 'string') imgSrc = URL.createObjectURL(imgSrc)
      const imgElement = document.createElement('img')

      imgElement.src = imgSrc
      imgElement.alt = 'Download failed!'

      imgElement.onclick = event => {
        this.#showImageModal(event.currentTarget.src)
      }

      imgElement.onload = () => {
        if (this.ifNeedsToScroll() || !data._id) this.scrollToBottom()
      }

      return imgElement
    })
  }

  #generateMessageMarkup(data) {
    const element = new HTML(messageMarkup)
    const imageContainer = element.querySelector('.images') // DEV
    const images = this.#generateImagesMarkup(data)

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
        console.warn('// Duplicate:', isMsgAlreadyRendered)
        return false
      }

      element.dataset.id = data._id
      text.title = simplifyDate(data.sent)
    } else {
      element.dataset.status = 'pending'
      text.title = 'Sending...'
    }

    if (data.files.length) {
      element.dataset.image = ''
    }

    if (data.you) {
      element.dataset.user = 'you'

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

  scrollIfNeeds() {
    this.ifNeedsToScroll() && this.scrollToBottom()
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
