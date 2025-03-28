import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { useEffect, useState, useCallback } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { io } from "socket.io-client";
import { getUserData } from "../store";
import { handleStart } from "../apis/api";

const socket = io(
  "https://fd0e-2402-4000-2300-573-254a-3857-b51-1f50.ngrok-free.app"
);

const Home = () => {
  const [busData, setBusData] = useState(null);
  const [location, setLocation] = useState(null);
  const [start, setStart] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [busId, setBusId] = useState(null);

  const startTrip = useCallback(async () => {
    try {
      console.log("called startTrip");

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission not granted!");
        return;
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
    }
  }, []);

  const stopTrip = useCallback(async (subscription) => {
    console.log("Trip Stopped");

    const { data, msg, code } = await handleStart(busId, {
      start_trip: false,
    });
    if (code === 0) {
      console.log("Trip stopped successfully");
    }
    setLocation(null);
    setLastUpdate(null);
    if (subscription) {
      subscription.remove();
    }
  }, []);

  useEffect(() => {
    let locationSubscription = null;

    if (start) {
      startTrip().then((subscription) => {
        locationSubscription = subscription;
      });
    }

    return () => {
      if (locationSubscription) {
        stopTrip(locationSubscription);
      }
    };
  }, [start, startTrip, stopTrip]);

  const getBusData = async () => {
    const userData = await getUserData();
    if (userData) {
      setBusData(userData);
      setBusId(userData[0]._id);
      console.log("busId", userData[0]._id);
    } else {
      console.log("No bus data found.");
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
      />
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
});

export default Home;
