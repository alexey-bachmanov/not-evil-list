import React from 'react';
import { useSelector } from 'react-redux';
import { BusinessDataEntry } from '@/store/resultsSlice';

// leaflet imports
import { Marker, Popup } from 'react-leaflet';

const MapMarkers: React.FC = function () {
  const searchResults: BusinessDataEntry[] = useSelector(
    (state: any) => state.results.results
  );

  // turn array of search results into array of map markers
  const markersJSX = searchResults.map((el) => {
    return (
      <Marker key={String(el.objectID)} position={el.coordinates}>
        <Popup>{el.companyName}</Popup>
      </Marker>
    );
  });

  return <>{markersJSX}</>;
};

export default MapMarkers;
