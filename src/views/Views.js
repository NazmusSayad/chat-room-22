export class Views {
  _root = document.getElementById(`root`)

  _clear() {
    this._root.innerHTML = ''
    this._root.removeAttribute(`view`)
  }

  _beforeRender() {}

  render() {
    this._clear()
    this._beforeRender()
    this._root.setAttribute(`view`, this._element.getAttribute(`-root`) || this._element.id || '')
    this._root.appendChild(this._element)
  }
}
