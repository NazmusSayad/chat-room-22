const PROD_SERVER_URL = 'https://chat-room-22.onrender.com'
const DEV_SERVER_URL = 'http://localhost:8080'

const CURRENT_SERVER_URL = PROD_SERVER_URL
// const CURRENT_SERVER_URL = DEV_SERVER_URL

export let SERVER_URL =
  location.host === 'localhost' || location.host === '127.0.0.1'
    ? CURRENT_SERVER_URL
    : PROD_SERVER_URL
export const API_URL = SERVER_URL + '/v1/api'
export const TIMEOUT_SEC = 20
export const CLD_PRESET = 'nyvecbqo'
export const CLD_URL =
  'https://api.cloudinary.com/v1_1/nazmussayad/image/upload'
