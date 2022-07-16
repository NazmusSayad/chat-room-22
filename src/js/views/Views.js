export class Views {
  root = document.getElementById(`root`)

  clear() {
    this.root.innerHTML = ""
  }

  render() {
    this.clear()
    this.root.appendChild(this._element)
  }
}
