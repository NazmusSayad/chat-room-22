export class Views {
  _root = document.getElementById(`root`)

  _clear() {
    this._root.innerHTML = ""
  }

  _beforeRender() {}

  render() {
    this._clear()
    this._beforeRender()
    this._root.appendChild(this._element)
  }
}
