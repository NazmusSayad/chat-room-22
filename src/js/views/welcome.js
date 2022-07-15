import markup from "../../components/welcome.html"
import { HTML } from "../HELPER"
import { Views } from "./Views"

class Welcome extends Views {
  constructor() {
    super()
    this.element = new HTML(markup)
  }

  addLoginHandler(callback) {}

  addSignupHandler(callback) {}
}

export default new Welcome()
