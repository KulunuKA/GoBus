import * as Location from "expo-location";
import { useEffect, useState, useCallback } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { io } from "socket.io-client";

const socket = io("https://f290-123-231-127-98.ngrok-free.app");

const Home = () => {
  const [location, setLocation] = useState(null);
  const [start, setStart] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const busId = "1";

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

  const stopTrip = useCallback((subscription) => {
    console.log("Trip Stopped");
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
