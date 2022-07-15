import { login, STATE } from "./model.js"
import * as welcome from "./views/welcome.js"

// Add handlers
;(async () => {})()

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
    welcome.render()
  }
})()

/* login({
  email: "247sayad@gmail.com",
  password: "hello",
})
 */
