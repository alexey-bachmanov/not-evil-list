## To-do

- Major implementations:
  - Implement search functions besides "get all"
  - implement catagories for businesses
  - Implement reviews
- Minor implementation:
  - Admin "review new submissions" functionality
  - Admin "update/delete" functionality
  - Close on background click functionality for drawers
  - User feedback and navigate away on new business submission
  - Switch search query from being header-based to url-based (more RESTful)
- Look and feel:
  - Make SearchResult component look better
  - Fill out DetailsDrawer component
  - Fill out EditsDrawer component
- Typescript:
  - Make interfaces for User, Business, and Review
  - Make types for hydrated documents and export them
  - Enforce types on fetch requests and responses
- Responsiveness:
  - Change how drawers animate on mobile to keep everything inside a 100vw x 100vh box
- Accesibility:
  - Audit for keyboard navigation

## Search behaviors to implement

- Searching "X" searches DB by company name and category (e.g. 'restaurant' or 'bar')
- Searching "X near me" searches DB by distance from user location
