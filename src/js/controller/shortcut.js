// Add Keyboard-Shortcuts
;(() => {
  window.onkeydown = (event) => {
    if (event.key === "t" && event.altKey && !event.ctrlKey && !event.shiftKey) {
      appTheme.toggle()
    }

    if (event.key === "/" && !event.altKey && event.ctrlKey && !event.shiftKey) {
      ChatView._chatForm.querySelector(`textarea`).focus()
    }
  }
})()
