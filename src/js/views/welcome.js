import markup from "../../components/welcome.html"
import { HTML } from "../HELPER.js"
const element = new HTML(markup)

export const addLoginHandler = (callback) => {}
export const addSignupHandler = (callback) => {}

export const render = () => {
  document.body.append(element)
}
