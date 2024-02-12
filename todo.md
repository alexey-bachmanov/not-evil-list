## To-do

- Major implementations:
  - Implement search functions besides "get all"
  - Implement reviews
- Minor implementation:
- Look and feel:
  - User feedback during login wait
  - User feedback on signup attempt with duplicate email
  - User feedback on login attempt with incorrect password
  - User feedback on login failure due to no connection with backend
  - Add confirmation dialog on business delete action
  - Add 'zoom to selected pin' functionality
  - Add front-end validation to 'new business' form
- Responsiveness:
  - Change how drawers animate on mobile to keep everything inside a 100vw x 100vh box
  - Swipeable drawers?
- Accesibility:
  - Audit for keyboard navigation
  - Audit with a screen reader
  - More semantic html (e.g. nav)
  - More aria roles
- Code improvement:
  - Move 'create new business' logic into a redux thunk
  - Refactor redux actions to be declarative instead of imperative?
  - Move authentication and route protection functionality to next.js middleware?
  - Refactor Drawer component to use MUI theming and breakpoints instead of module-scoped css
  - Split out api access class (e.g. Api.getBusinessDetails(...))
- DB and front-end validation:
  - Make sure phone # is a valid phone #
  - Make sure website is a valid website
- Testing:
  - Start doing it?
- Bugs:

## Search behaviors to implement

- Searching "X" searches DB by company name and category (e.g. 'restaurant' or 'bar')
- Searching "X near me" searches DB by distance from user location
