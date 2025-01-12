import React, { useEffect, useState } from "react";

export default function LiveLocationTracker() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");

  useEffect(() => {
    // Request location permission on mount
    requestLocationPermission();

    return () => {
      // Cleanup
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  let watchId = null;

  const requestLocationPermission = async () => {
    try {
      if (!("geolocation" in navigator)) {
        setError("Geolocation is not supported by your device");
        return;
      }

      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      setPermissionStatus(permission.state);

      permission.addEventListener("change", () => {
        setPermissionStatus(permission.state);
      });

      if (permission.state === "granted") {
        trackLocation();
      } else if (permission.state === "denied") {
        setError(
          "Location permission was denied. Please enable it in your browser settings."
        );
      }
    } catch (err) {
      setError("Error requesting location permission");
      console.error(err);
    }
  };

  const trackLocation = () => {
    watchId = navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
//https://www.google.com/maps/@6.8559,79.863,7z?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D
        let map = document.getElementById("map");
        map.innerHTML =
          '<iframe width="700" height="300" src="https://www.google.com/maps/@' +
          latitude +
          "," +
          longitude +
          ',7z?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D"></iframe>';
        // map.innerHTML =
        //   '<iframe width="700" height="300" src="https://maps.google.com/ maps?q=' +
        //   latitude +
        //   ", " +
        //   longitude +
        //   '&amp; z = 158amp ;output=embed"></iframe>';
        setError(null);
      },
      (err) => {
        setError(err.message);
        console.error(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div>
      <h1>Live Location Tracker</h1>
      <button onClick={requestLocationPermission}>
        Request Location Permission
      </button>
      <div>
        <h2>Permission Status: {permissionStatus}</h2>
        <h2>Location:</h2>
        {location ? (
          <div>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <p>Accuracy: {location.accuracy} meters</p>
            <p>Timestamp: {new Date(location.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <p>No location data</p>
        )}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </div>

      <div id="map"></div>
    </div>
  );
}
