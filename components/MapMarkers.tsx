import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, uiActions, searchActions } from '@/store';

// leaflet imports
import { Icon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

// create a 'normal' icon and 'activated' icon
const iconNormal = new Icon({
  iconUrl: 'images/marker-icon-green.png',
  shadowUrl: 'images/marker-shadow.png',
  iconAnchor: [12, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [0, -36],
});
const iconActivated = new Icon({
  iconUrl: 'images/marker-icon-red.png',
  shadowUrl: 'images/marker-shadow.png',
  iconAnchor: [12, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [0, -36],
});

const MapMarkers: React.FC = function () {
  const searchResults = useSelector((state: RootState) => state.search.results);
  const selectedBusinessID = useSelector(
    (state: RootState) => state.ui.selectedBusinessID
  );
  const dispatch = useDispatch<AppDispatch>();

  // turn array of search results into array of map markers
  const markersJSX = searchResults.map((el) => (
    <Marker
      key={el._id}
      // GeoJSON has format [ lng, lat ]
      // Marker expects [ lat, lng ]
      position={[el.location.coordinates[1], el.location.coordinates[0]]}
      icon={el._id === selectedBusinessID ? iconActivated : iconNormal}
      eventHandlers={{
        click: () => {
          // open the detail drawer and start loading
          dispatch(uiActions.setSelectedBusinessId(el._id));
          dispatch(uiActions.setDetailsDrawerOpen(true));
          dispatch(searchActions.getDetails(el._id));
        },
      }}
    ></Marker>
  ));
  return <>{markersJSX}</>;
};

export default MapMarkers;
