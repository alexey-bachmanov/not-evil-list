import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { BusinessDataEntry } from '@/types';

// leaflet imports
import { Marker, Popup } from 'react-leaflet';

const MapMarkers: React.FC = function () {
  const searchResults: BusinessDataEntry[] = useSelector(
    (state: RootState) => state.search.results
  );

  // turn array of search results into array of map markers
  const markersJSX = searchResults.map((el) => {
    return (
      // GeoJSON has format [ lng, lat ]
      // Marker expects [ lat, lng ]
      <Marker
        key={el._id}
        position={[el.location.coordinates[1], el.location.coordinates[0]]}
      >
        <Popup>{el.companyName}</Popup>
      </Marker>
    );
  });

  return <>{markersJSX}</>;
};

export default MapMarkers;
