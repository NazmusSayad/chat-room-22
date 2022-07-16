export class Views {
  _root = document.getElementById(`root`)

  _clear() {
    this._root.innerHTML = ""
  }

  render() {
    this._clear()
    this._root.appendChild(this._element)
  }
}
