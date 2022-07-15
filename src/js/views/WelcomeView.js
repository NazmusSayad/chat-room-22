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

// blank hoye gelo je, welcome page terminal open kore dekho terminal open hoiche? hoiche kam kore?, terminal e to kichu chole na same here

// ja korchi git e push diye vscode insider e astechi, okay
// push korbo kemne?, git add .; git commit "hi"; git push"/////// terminal to nai