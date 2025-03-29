import * as Location from "expo-location";
import { useEffect, useState, useCallback } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { io } from "socket.io-client";
import { getUserData } from "../store";
import { handleStart } from "../apis/api";

const socket = io(
  "https://6a8d-2402-4000-2300-573-859e-6069-56a5-e7e4.ngrok-free.app"
);

const Home = () => {
  const [busData, setBusData] = useState(null);
  const [location, setLocation] = useState(null);
  const [start, setStart] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [busId, setBusId] = useState(null);

  const startTrip = useCallback(async () => {
    try {
      console.log("called startTrip with busId:", busId);

      if (!busId) {
        console.error("Cannot start trip: busId is null");
        return null;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission not granted!");
        return null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 1000, // Update every second
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation({ latitude, longitude });
          setLastUpdate(new Date().toLocaleTimeString());

          // Emit real-time location to the server
          socket.emit("setLocation", { busId, latitude, longitude });
        }
      );

      return subscription;
    } catch (error) {
      console.error("Error starting trip:", error);
      return null;
    }
  }, [busId]);

  const stopTrip = useCallback(async (subscription) => {
    console.log("Trip Stopped with busId:", busId);

    if (busId) {
      try {
        const { data, msg, code } = await handleStart(busId, {
          start_trip: false,
        });
        if (code === 0) {
          console.log("Trip stopped successfully");
        } else {
          console.error("Failed to stop trip in database:", msg);
        }
      } catch (error) {
        console.error("Error stopping trip:", error);
      }
    } else {
      console.error("Cannot stop trip: busId is null");
    }
    
    setLocation(null);
    setLastUpdate(null);
    if (subscription) {
      subscription.remove();
    }
  }, [busId]);

  useEffect(() => {
    let locationSubscription = null;

    if (start) {
      startTrip().then((subscription) => {
        locationSubscription = subscription;
      });
    } else if (locationSubscription) {
      stopTrip(locationSubscription);
    }

    return () => {
      if (locationSubscription) {
        stopTrip(locationSubscription);
      }
    };
  }, [start, startTrip, stopTrip]);

  const getBusData = async () => {
    try {
      const userData = await getUserData();
      if (userData && userData.length > 0) {
        setBusData(userData[0]);
        setBusId(userData[0]._id);
        console.log("busId set to:", userData[0]._id);
      } else {
        console.log("No bus data found.");
      }
    } catch (error) {
      console.error("Error getting bus data:", error);
    }
  };

  useEffect(() => {
    getBusData();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={start ? "Stop Trip" : "Start Trip"}
        onPress={() => setStart(!start)}
        disabled={!busId}
      />
      {!busId && (
        <Text style={styles.errorText}>
          Waiting for bus data to load...
        </Text>
      )}
      {location && (
        <View style={styles.infoContainer}>
          <Text style={styles.locationText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
          {lastUpdate && (
            <Text style={styles.updateText}>Last Update: {lastUpdate}</Text>
          )}
        </View>
      )}

      <Text>{busData ? busData.name : "Loading..."}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: "100%",
  },
  locationText: {
    fontSize: 16,
    marginVertical: 5,
  },
  updateText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  }
});

export default Home;