import { TIMEOUT_SEC } from '../config.js'
import anchorme from 'anchorme'
import BadWordList from '../bad-words.json'
import CustomReplaceWords from '../custom-replace-words.json'
import CryptoJs from 'crypto-js'
import { decode as shortNameToEmoji } from 'emoji-to-short-name'
import Twemoji from 'twemoji'

CryptoJs.encrypt = text => {
  return CryptoJs.enc.Base64.stringify(CryptoJs.enc.Utf8.parse(text))
}
CryptoJs.decrypt = data => {
  return CryptoJs.enc.Base64.parse(data).toString(CryptoJs.enc.Utf8)
}

export const cryptoJs = CryptoJs

const timeout = function (seconds = TIMEOUT_SEC) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      )
    }, seconds * 1000)
  })
}

export const getJSON = async function () {
  try {
    const res = await Promise.race([fetch(...arguments), timeout()])
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
  } catch (error) {
    throw error
  }
}

export const HTML = function (body = '<div></div>') {
  return new DOMParser().parseFromString(body, 'text/html').body
    .firstElementChild
}

export const newMessageNotification = async (user, body) => {
  await Notification.requestPermission()
  if (Notification.permission === 'denied') return

  const id = String(Math.random())
  const title = 'New message from: ' + user
  const notification = new Notification(title, {
    body,
    vibrate: [1],
    tag: id,
  })

  Wait(5000)
  notification.close()
}

export const Wait = function (duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

export const getScrollBottom = element => {
  const offset = element.scrollTop + element.clientHeight
  const height = element.scrollHeight
  return height - offset
}

export const simplifyDate = date => {
  date = new Date(date)
  return date.toLocaleString()
}

export const makeTextReadyForRender = input => {
  input = input.replace(/</gim, '&lt;')
  input = input.replace(/\n/gm, '<br/>')
  input = replaceIndividualWords(input)
  input = anchorme({
    input,
    options: {
      attributes: {
        target: '_blank',
        class: 'message-link',
      },
    },
  })

  return Twemoji.parse(input)
}

export const replaceIndividualWords = text => {
  CustomReplaceWords.forEach(([word, newWord, caseIns]) => {
    const isCaseInsensitive = caseIns ? 'i' : ''
    const regex = new RegExp('^' + word + '$', 'gm' + isCaseInsensitive)
    text = text.replace(regex, newWord)
  })

  return text
}

export const replaceIndividualBadWords = text => {
  BadWordList.forEach(word => {
    const regex = RegExp('\\b' + word + '\\b', 'igm')
    text = text.replace(regex, new Array(word.length).fill('🛇').join(''))

    const regex2 = new RegExp(word.split('').join('\n'), 'igm')
    text = text.replace(regex2, new Array(word.length).fill('🛇').join('\n'))
  })

  return text
}

export const removeDuplicateLinesOrSpaces = text => {
  while (text.includes('\n\n')) {
    text = text.replace(/\n\n/gim, '\n')
  }
  while (text.includes('  ')) {
    text = text.replace(/  /gim, ' ')
  }
  return text
}

export const refactorMessageBeforeSending = msg => {
  msg = removeDuplicateLinesOrSpaces(msg)
  msg = replaceIndividualBadWords(msg)

  return shortNameToEmoji(msg.trim())
}
