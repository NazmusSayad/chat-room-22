import cryptoJs from "crypto-js"

cryptoJs.encrypt = (text) => {
  return cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(text))
}
cryptoJs.decrypt = (data) => {
  return cryptoJs.enc.Base64.parse(data).toString(cryptoJs.enc.Utf8)
}

export default cryptoJs
