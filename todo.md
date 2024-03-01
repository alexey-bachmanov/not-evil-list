## To-do

- Major implementations:
  - Implement search functions besides "get all"
- Minor implementation:
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
  - Move 'create new business' logic into a redux thunk
  - Refactor redux actions to be declarative instead of imperative?
    - create 'coordinate action' thunks that call imperative thunks
  - Move authentication and route protection functionality to next.js middleware?
  - Refactor Drawer component to use MUI theming and breakpoints instead of module-scoped css
  - Split out api access class (e.g. Api.getBusinessDetails(...))
  - Type safety on addressToGeoData function
- DB and front-end validation:
  - Make sure phone # is a valid phone #
- Testing:
  - Start doing it?
  - Set up mock mongoDB server
- Bugs:

## Search behaviors to implement

- Searching "X" searches DB by company name and category (e.g. 'restaurant' or 'bar')
- Searching "X near me" searches DB by distance from user location
