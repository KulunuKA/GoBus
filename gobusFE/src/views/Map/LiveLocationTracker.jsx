import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socket from "../../services/socket"; // Adjust this path if needed
import { useParams } from "react-router-dom";

export default function PassengerMap() {
  const params = useParams();
  const Id = params.busId;

  useEffect(() => {
    const sriLankaBounds = [
      [5.722969, 79.695169],
      [10.085988, 82.189919],
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

    map.setMaxBounds(sriLankaBounds);

    // Add a listener to snap back to bounds when the user pans outside
    map.on("drag", function () {
      map.panInsideBounds(sriLankaBounds, { animate: true });
    });

    // Object to store markers for buses
    const markers = {};

    // Handle initial locations when connecting
    socket.on("initialLocations", (locations) => {
      console.log("Initial locations received:", locations);

      // Check if our specific bus is in the initial locations
      if (locations[Id]) {
        const { latitude, longitude } = locations[Id];

        // Create marker for our bus
        markers[Id] = L.marker([latitude, longitude]).addTo(map);

        // Center map on this bus location
        map.setView([latitude, longitude], 25);
      }
    });

    // Socket listener for location updates
    const handleLocationUpdate = ({ busId, latitude, longitude }) => {
      console.log("Location update:", busId, latitude, longitude);

      if (busId === Id) {
        if (!markers[busId]) {
          // Add a new marker for the bus if it doesn't exist
          markers[busId] = L.marker([latitude, longitude]).addTo(map);
        } else {
          // Update marker position if it already exists
          markers[busId].setLatLng([latitude, longitude]);
        }

        map.setView([latitude, longitude], 25); 
      }
    };

    // Request initial locations when component mounts
    socket.emit("getInitialLocation", { busId: Id });

    socket.on("getLocation", handleLocationUpdate);

    // Cleanup function to remove map and listeners
    return () => {
      map.remove();
      socket.off("initialLocations");
      socket.off("getLocation", handleLocationUpdate);
    };
  }, [Id]);
  return (
    <div
      id="map"
      style={{
        height: "100vh",
        width: "100%",
        marginTop: "60px",
      }}
    ></div>
  );
}
