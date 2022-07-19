## Tasks for you:

### Theme Swithicng

Let me tell you how it works first. When html has no attribute, the system theme is inherited. And when html does have the "theme" attribute, the value of that attribute is prioritized.

<b>What you need to do:</b>

- Have no "theme" attribute when loaded untill user has a value in the local storage
- When clicked on the toggler, check

```javascript
// pseudo code
const theme = html.getAttribute('theme')
if (theme === 'dark' || matchMedia('(prefers-color-scheme: dark)')) {
  // switch to light mode
  // change value to 'light' in local storage
}
if (theme === 'light' || matchMedia('(prefers-color-scheme: light)')) {
  // switch to dark mode
  // change value to 'dark' in local storage
}
```

### Menu

- Clicking on "Use System Theme" should remove the "theme" attribute from html and clear local storage theme settings.
- Use javascript to open and close the menu.
- Add animations if you want to.

### others

- Fix auto height adjust of the text field
