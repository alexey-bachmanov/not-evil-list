## To-do

- Minor implementation:
  - XSS security middleware
- Look and feel:
  - Add confirmation dialog on business delete action
  - Add 'zoom to selected pin' functionality
  - Add validation to edits drawer
- Responsiveness:
  - Swipeable drawers?
- Accesibility:
  - Audit for keyboard navigation
  - Audit with a screen reader
  - More semantic html (e.g. nav)
  - More aria roles
- Code improvement:
  - Refactor redux actions to be declarative instead of imperative?
    - create 'coordinate action' thunks that call imperative thunks
  - Move authentication and route protection functionality to next.js middleware?
  - Refactor Drawer component to use MUI theming and breakpoints instead of module-scoped css
- Testing:
  - integration testing with pages/components/redux, boundary at axios calls to backend
  - integration testing with routes/models, boundary at mongodb-memory-server
  - unit testing of models (check middleware, crud operations, etc.)
- Bugs:

## Search behaviors to implement

- Searching "X near me" searches DB by distance from user location
