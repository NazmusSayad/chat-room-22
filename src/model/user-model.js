import { API_URL, SERVER_URL } from '../.config.js'
import { cryptoJs, getJSON } from '../utils/utils.js'

const saveAuthInfo = data => {
  localStorage.setItem(`token`, cryptoJs.encrypt(JSON.stringify(data)))
}

export const pingServer = async () => {
  const res = await fetch(SERVER_URL + '/ping')
  console.log(res)
}

export const login = async token => {
  const res = await getJSON(API_URL + '/user', {
    headers: {
      email: token.email,
      password: token.password,
    },
  })

  saveAuthInfo(res.data)
}

export const signUp = async token => {
  const res = await getJSON(API_URL + '/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(token),
  })

  saveAuthInfo(res.data)
}

export const logOut = () => {
  localStorage.removeItem('token')
  location.reload()
}
