import markup from "../../components/login.html"
import { HTML } from "../HELPER"
import { Views } from "./Views"

class Welcome extends Views {
  constructor() {
    super()
    this.element = new HTML(markup)
  }

  addSubmitHandler(callback) {}

  addSignupHandler(callback) {}
}

export default new Welcome()

// focus me
// tumi kichu korbana?