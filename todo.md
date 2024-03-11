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
  - Integration testing with pages/components/redux, boundary at axios calls to backend
  - Integration testing with routes/models, boundary at mongodb-memory-server
- Bugs:
  - Searching 2-word tags like "fast food" yields 0 results

## Search behaviors to implement

- Searching "X near me" searches DB by distance from user location
