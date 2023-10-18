'use client';
// custom background map component, displays across entire viewport
// on the home page

import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// create custom icon
L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'images/marker-icon.png',
  shadowUrl: 'images/marker-shadow.png',
  iconAnchor: [12, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [0, -36],
});

const Map: React.FC = function () {
  const position: LatLngTuple = [40.002, -75.161];
  const zoom = 13;

  // Don't render this component at all on the server
  if (!window) {
    return (
      <div style={{ backgroundColor: 'red' }}>
        This is being rendered on the server
      </div>
    );
  }

  // Do render it on the client
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
