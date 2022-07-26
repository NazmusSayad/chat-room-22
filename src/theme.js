class Theme {
  #conf

  constructor({
    root = document.querySelector(`:root`),
    rootAtt = 'theme',
    dataKey = 'theme',
  } = {}) {
    this.#conf = { root, rootAtt, dataKey }
  }

  #selected = () => localStorage.getItem(this.#conf.dataKey)
  #current = () => this.#conf.root.getAttribute(this.#conf.rootAtt)

  #save(theme = null) {
    localStorage.setItem(this.#conf.dataKey, theme)
  }

  #init() {
    const current = this.#selected()

    if (current === 'dark') {
      this.dark()
    } else if (current === 'light') {
      this.light()
    } else {
      this.auto()
    }
  }

  #watch() {
    const media = matchMedia('(prefers-color-scheme: dark)')
    media.onchange = () => {
      this.#init()
    }
  }

  #set(theme) {
    if (theme) {
      return this.#conf.root.setAttribute(this.#conf.rootAtt, theme)
    }
    this.#conf.root.removeAttribute(this.#conf.rootAtt, theme)
  }

  run() {
    this.#init()
    this.#watch()
  }

  auto() {
    const media = matchMedia('(prefers-color-scheme: dark)')
    if (media.matches) {
      this.#set('auto-dark')
    } else {
      this.#set('auto-light')
    }
    localStorage.removeItem(this.#conf.dataKey)
  }

  light() {
    this.#set('light')
    this.#save('light')
  }

  dark() {
    this.#set('dark')
    this.#save('dark')
  }

  toggle() {
    const current = this.#current()

    if (current.includes('dark')) {
      this.light()
    } else if (current.includes('light')) {
      this.dark()
    } else {
      this.auto()
    }
  }

  toggle3() {
    const current = this.#current()

    if (current.includes('auto')) {
      this.light()
    } else if (current.includes('light')) {
      this.dark()
    } else {
      this.auto()
    }
  }
}

const appTheme = new Theme()
appTheme.run()
