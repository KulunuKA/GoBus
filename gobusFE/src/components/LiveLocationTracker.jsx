import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socket from "../services/socket"; // Adjust this path if needed

export default function PassengerMap() {
  useEffect(() => {
    // Define bounds for Sri Lanka
    const sriLankaBounds = [
      [5.722969, 79.695169], // Southwest corner
      [10.085988, 82.189919], // Northeast corner
    ];

    // Initialize the map centered in Sri Lanka
    const map = L.map("map", {
      minZoom: 6,
      maxZoom: 18,
    }).setView([7.8731, 80.7718], 7); // Center of Sri Lanka with zoom level 7

    // Add OpenStreetMap tiles
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          '&copy; <a href="https://www.esri.com/">Esri</a> contributors',
      }
    ).addTo(map);

    // Restrict map panning to Sri Lanka's bounds
    map.setMaxBounds(sriLankaBounds);

    // Add a listener to snap back to bounds when the user pans outside
    map.on("drag", function () {
      map.panInsideBounds(sriLankaBounds, { animate: true });
    });

    // Object to store markers for buses
    const markers = {};

    // Socket listener for location updates
    const handleLocationUpdate = ({ busId, latitude, longitude }) => {
      console.log(`Bus ${busId}: Latitude ${latitude}, Longitude ${longitude}`);

      if (!markers[busId]) {
        // Add a new marker for the bus if it doesn't exist
        markers[busId] = L.marker([latitude, longitude]).addTo(map);
      } else {
        // Update marker position if it already exists
        markers[busId].setLatLng([latitude, longitude]);
      }

      map.setView([latitude, longitude], 45);
    };

    socket.on("getLocation", handleLocationUpdate);

    // Cleanup function to remove map and listeners
    return () => {
      map.remove();
      socket.off("getLocation", handleLocationUpdate);
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: "500px",
        width: "100%",
      }}
    ></div>
  );
}
