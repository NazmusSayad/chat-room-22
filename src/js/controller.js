import { login, STATE } from "./model.js"
import LoginView from "./views/LoginView.js";
import WelcomeView from "./views/WelcomeView.js"

const loginClick = () => {
  // Render Login Page
}

const signupClick = () => {
  // Render Signup page
}

// Add handlers
;(() => {
  WelcomeView.addLoginHandler(loginClick)
  WelcomeView.addSignupHandler(signupClick)
  LoginView.addSubmitHandler(loginSubmit)
  LoginView.addGoToSignupHandler(signupClick)
})()

// Init
;(async () => {
  if (STATE.auth) {
    try {
      await login({
        email: STATE.auth.email,
        password: STATE.auth.password,
      })

      // Render Chat
      console.log(`Render Chat!`)
    } catch {
      // Something went wrong!
    }
  } else {
    // Render Welcome Page
    WelcomeView.render()
  }
})()

/* login({
  email: "247sayad@gmail.com",
  password: "hello",
})
 */
