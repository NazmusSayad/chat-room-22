import "./sass/base/index.scss"
import "./controller/index.js"

// stucture this in your way

const passIcon = document.querySelector("input[name='password'] ~ .icon")

passIcon.addEventListener("click", function () {
  this.classList.toggle("fa-eye")
  this.classList.toggle("fa-eye-slash")

  const passInput = document.querySelector('input[name="password"]')

  const passAttr = passInput.getAttribute("type")

  passInput.setAttribute("type", passAttr === "password" ? "text" : "password")
})
