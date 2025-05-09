import { useEffect, useRef, useState } from "react";

// Haversine formula
const deg2rad = (deg) => deg * (Math.PI / 180);
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};

export default function useDistanceTracker(start, initialLocation) {
  const [totalDistance, setTotalDistance] = useState(0);
  const previousLocationRef = useRef(initialLocation);
  const intervalRef = useRef(null);
  const latRef = useRef(initialLocation?.latitude || 0);
  const lonRef = useRef(initialLocation?.longitude || 0);

  useEffect(() => {
    if (start) {
      intervalRef.current = setInterval(() => {
        latRef.current += 0.0001;
        lonRef.current += 0.0001;

        const simulatedLocation = {
          latitude: latRef.current,
          longitude: lonRef.current,
        };

        const prev = previousLocationRef.current;
        if (prev) {
          const dist = calculateDistance(
            prev.latitude,
            prev.longitude,
            simulatedLocation.latitude,
            simulatedLocation.longitude
          );

          if (dist > 1) {
            setTotalDistance((prevDistance) => prevDistance + dist);
            previousLocationRef.current = simulatedLocation;
          }
        } else {
          previousLocationRef.current = simulatedLocation;
        }
      }, 10000);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [start]);

  return totalDistance;
}
