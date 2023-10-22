# Not Evil List

Under construction...

This is a full-stack application showcasing and allowing a detailed search of Philadelphia's lawful-good businesses. Find the next business you feel good about supporting.

## Technologies used

- React.js
- Next.js
- Redux.js
- Material UI Components
- Leaflet map library

## Techniques used

- Next.js Server-side rendering
- Geospatial data modelling

## To-do

- Pages
  - Main landing page
    - Details drawer
    - Login modal
    - Different SearchButtonGroup states (logged out vs admin vs user)
  - Admin "review new submissions" page
  - Admin "create/update/delete" page
- Implement search functions
- Implement reviews
- implement geolocaation stuff to convert address to coordinates
- Make SearchResult component look better
- Make scrollbars look better
- Mobile devices
  - make drawer anchor to bottom on small screens

## Behaviors to implement

- Clicking on a marker selects that business and brings up its details drawer, changes marker color
- Clicking in search results selects that business and brings up its detail drawer, changes marker color
- Searching "X" searches DB by company name
- Searching "X near me" searches DB by distance from user location
