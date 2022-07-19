class Theme {
  #conf
  constructor({
    root = document.querySelector(`html`),
    rootAtt = "theme",
    dataKey = "theme",
  } = {}) {
    this.#conf = { root, rootAtt, dataKey }
  }

  #selected = () => localStorage.getItem(this.#conf.dataKey)
  #current = () => this.#conf.root.getAttribute(this.#conf.rootAtt)

  #save(theme = null) {
    localStorage.setItem(this.#conf.dataKey, theme)
  }

  #set() {
    const current = this.#selected()

    if (current === "dark") {
      this.dark()
    } else if (current === "light") {
      this.light()
    } else {
      this.default()
    }
  }

  #watch() {
    const media = matchMedia("(prefers-color-scheme: dark)")
    media.onchange = () => {
      this.#set()
    }
  }

  light(save = true) {
    this.#conf.root.setAttribute(this.#conf.rootAtt, "light")
    if (save) this.#save("light")
  }

  dark(save = true) {
    this.#conf.root.setAttribute(this.#conf.rootAtt, "dark")
    if (save) this.#save("dark")
  }

  toggle() {
    const current = this.#current()

    if (current === "dark") {
      this.light()
    } else if (current === "light") {
      this.dark()
    } else {
      this.default()
    }
  }

  default() {
    const media = matchMedia("(prefers-color-scheme: dark)")
    if (media.matches) {
      this.dark(false)
    } else {
      this.light(false)
    }
    localStorage.removeItem(this.#conf.dataKey)
  }

  start() {
    this.#set()
    this.#watch()
  }
}

export default Theme
