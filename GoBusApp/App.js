import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";

export default function App() {
  const [location, setLocation] = useState(null);

  const startTrip = async () => {
    console.log("called startTrip");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission not granted!");
      return;
    }

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (location) => {
        const { latitude, longitude } = location.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        setLocation({ latitude, longitude });
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Start Trip" onPress={startTrip} />
      {location && (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
    </View>
  );
}
