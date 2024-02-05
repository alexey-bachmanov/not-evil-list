'use client';
// custom background map component, displays across entire viewport
// on the home page
import React from 'react';

// leaflet imports
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapMarkers from './MapMarkers';

// create custom icon
// L.Marker.prototype.options.icon = L.icon({
//   iconUrl: 'images/marker-icon.png',
//   shadowUrl: 'images/marker-shadow.png',
//   iconAnchor: [12, 41],
//   shadowAnchor: [12, 41],
//   popupAnchor: [0, -36],
// });

const Map: React.FC = function () {
  const position: LatLngTuple = [40.002, -75.161];
  const zoom = 13;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapMarkers />
    </MapContainer>
  );
};

export default Map;
