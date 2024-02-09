## To-do

- Major implementations:
  - Implement search functions besides "get all"
  - implement catagories for businesses
  - Implement reviews
- Minor implementation:
  - Admin "review new submissions" functionality
  - Admin "update" functionality
  - Switch search query from being header-based to url-based (more RESTful)
- Look and feel:
  - Fill out EditsDrawer component
  - Closing a details drawer should deselect its matching map pin
  - User feedback during login wait
- Responsiveness:
  - Change how drawers animate on mobile to keep everything inside a 100vw x 100vh box
  - Swipeable drawers?
- Accesibility:
  - Audit for keyboard navigation
- Bugs:
  - 'Admin mode' state persits on logout

## Search behaviors to implement

- Searching "X" searches DB by company name and category (e.g. 'restaurant' or 'bar')
- Searching "X near me" searches DB by distance from user location
