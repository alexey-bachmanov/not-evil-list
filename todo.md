## To-do

- Major implementations:
  - Implement search functions besides "get all"
  - Implement reviews
- Minor implementation:
  - Admin "review new submissions" functionality
- Look and feel:
  - User feedback during login wait
  - User feedback on signup attempt with duplicate email
  - User feedback on login attempt with incorrect password
  - User feedback on login failure due to no connection with backend
  - Add confirmation dialog on business delete action
  - Add 'zoom to selected pin' functionality
- Responsiveness:
  - Change how drawers animate on mobile to keep everything inside a 100vw x 100vh box
  - Swipeable drawers?
- Accesibility:
  - Audit for keyboard navigation
  - Audit with a screen reader
- Code improvement:
  - Move 'create new business' logic into a redux thunk
  - Refactor redux actions to be declarative instead of imperative?
  - Move authentication and route protection functionality to next.js middleware?
- Testing:
  - Start doing it?
- Bugs:

## Search behaviors to implement

- Searching "X" searches DB by company name and category (e.g. 'restaurant' or 'bar')
- Searching "X near me" searches DB by distance from user location
