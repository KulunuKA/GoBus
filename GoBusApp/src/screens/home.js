import * as Location from "expo-location";
import { useEffect, useState, useCallback, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Alert
} from "react-native";
import { io } from "socket.io-client";
import { getUserData } from "../store";
import { handleStart } from "../apis/api";
import CustomButton from "../components/CustomButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const SOCKET_URL = "https://abe0-2402-4000-2082-4858-f569-ffe5-e5d9-5ae7.ngrok-free.app";

const Home = ({ navigation }) => {
  const [busData, setBusData] = useState(null);
  const [location, setLocation] = useState(null);
  const [start, setStart] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [busId, setBusId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // socketRef.current = io(SOCKET_URL, {
    //   reconnectionAttempts: 5,
    //   reconnectionDelay: 1000,
    //   timeout: 10000,
    // });

    // socketRef.current.on("connect", () => {
    //   setSocketStatus("connected");
    //   console.log("Socket connected");
    // });

    // socketRef.current.on("disconnect", () => {
    //   setSocketStatus("disconnected");
    //   console.log("Socket disconnected");
    // });

    // socketRef.current.on("connect_error", (error) => {
    //   setSocketStatus("error");
    //   console.error("Socket connection error:", error);
    // });

    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //   }
    // };
  }, []);

  const startTrip = useCallback(async () => {
    try {
      setConnecting(true);
      console.log("Starting trip with busId:", busId);

      if (!busId) {
        Alert.alert("Error", "Bus ID not found. Please restart the app.");
        setConnecting(false);
        return null;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required", 
          "Location permission is needed to track your bus route."
        );
        setConnecting(false);
        return null;
      }

      // Update trip status in database
      try {
        const response = await handleStart(busId, { start_trip: true });
        if (response.code !== 0) {
          Alert.alert("Error", response.msg || "Failed to start trip");
          setConnecting(false);
          return null;
        }
      } catch (error) {
        console.error("API Error:", error);
        Alert.alert("Error", "Failed to connect to server");
        setConnecting(false);
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
          setConnecting(false);

          // Center map on current location
          mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);

          // Emit real-time location to the server
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("setLocation", { busId, latitude, longitude });
          }
        }
      );

      return subscription;
    } catch (error) {
      console.error("Error starting trip:", error);
      setConnecting(false);
      Alert.alert("Error", "Failed to start location tracking");
      return null;
    }
  }, [busId]);

  const stopTrip = useCallback(
    async (subscription) => {
      console.log("Stopping trip with busId:", busId);

      if (busId) {
        try {
          const { data, msg, code } = await handleStart(busId, {
            start_trip: false,
          });
          if (code === 0) {
            console.log("Trip stopped successfully");
          } else {
            console.error("Failed to stop trip in database:", msg);
            Alert.alert("Warning", "Trip stopped but server update failed");
          }
        } catch (error) {
          console.error("Error stopping trip:", error);
          Alert.alert("Warning", "Trip stopped but server update failed");
        }
      } 

      setLocation(null);
      setLastUpdate(null);
      if (subscription) {
        subscription.remove();
      }
    },
    [busId]
  );

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
        locationSubscription?.remove();
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
        Alert.alert(
          "No Bus Data", 
          "No bus information found. Please log in again.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      }
    } catch (error) {
      console.error("Error getting bus data:", error);
      Alert.alert("Error", "Failed to load bus information");
    }
  };

  useEffect(() => {
    // getBusData();
  }, []);

  const handleReportDelay = () => {
    Alert.alert(
      "Report Delay",
      "Do you want to report a delay for this route?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Report", 
          style: "default",
          onPress: () => console.log("Delay reported") 
        }
      ]
    );
  };

  const handleReportBreakdown = () => {
    Alert.alert(
      "Report Breakdown",
      "Do you want to report a vehicle breakdown?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Report", 
          style: "destructive",
          onPress: () => console.log("Breakdown reported") 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Driver Dashboard</Text>
            {busData && (
              <Text style={styles.busInfo}>
                Bus #{busData.busNumber || "Unknown"}
              </Text>
            )}
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={styles.statusIndicator}>
              <View 
                style={[
                  styles.statusDot, 
                  {
                    backgroundColor: start 
                      ? "#05944F" 
                      : socketStatus === "error" 
                        ? "#E53E3E" 
                        : "#F0B429"
                  }
                ]} 
              />
              <Text style={styles.statusText}>
                {start ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Primary Action */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trip Control</Text>
            <View style={styles.tripControlContainer}>
              <CustomButton
                title={start ? "End Trip" : "Start Trip"}
                onPress={() => {
                  if (connecting) return;
                  setStart(!start);
                }}
                type={start ? "secondary" : "primary"}
                disabled={!busId || connecting}
                loading={connecting}
                icon={
                  start ? (
                    <FontAwesome name="stop" size={20} color="#05944F" />
                  ) : (
                    <AntDesign name="caretright" size={20} color="#FFFFFF" />
                  )
                }
                width="100%"
              />
              {socketStatus === "error" && (
                <Text style={styles.errorText}>
                  Connection error. Check your internet connection.
                </Text>
              )}
            </View>
          </View>

          {/* Reporting Options */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Report Issues</Text>
            <View style={styles.reportButtonsContainer}>
              <CustomButton
                title="Report Delay"
                onPress={handleReportDelay}
                type="outline"
                icon={
                  <MaterialCommunityIcons
                    name="clock-alert-outline"
                    size={20}
                    color="#ffffff"
                  />
                }
                width="48%"
              />
              <CustomButton
                title="Report Breakdown"
                onPress={handleReportBreakdown}
                type="outline"
                icon={<AntDesign name="warning" size={20} color="#ffffff" />}
                width="48%"
              />
            </View>
          </View>

          {/* Map */}
          <View style={[styles.card, styles.mapCard]}>
            <View style={styles.mapHeaderContainer}>
              <Text style={styles.cardTitle}>Live Location</Text>
              {lastUpdate && (
                <Text style={styles.updateText}>
                  Last update: {lastUpdate}
                </Text>
              )}
            </View>
            <View style={styles.mapContainer}>
              {location ? (
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    longitude: location.longitude,
                    latitude: location.latitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                >
                  <Marker
                    coordinate={{
                      longitude: location.longitude,
                      latitude: location.latitude,
                    }}
                    title="Current Location"
                    description="Your bus is here"
                  >
                    <View style={styles.markerContainer}>
                      <Ionicons name="bus" size={24} color="#05944F" />
                    </View>
                  </Marker>
                </MapView>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons 
                    name="location-outline" 
                    size={48} 
                    color="#CCCCCC" 
                  />
                  <Text style={styles.placeholderText}>
                    Start trip to view live location
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },
  busInfo: {
    fontSize: 16,
    color: "#05944F",
    fontWeight: "600",
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#666666",
    marginRight: 6,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  content: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  tripControlContainer: {
    width: "100%",
  },
  reportButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  mapCard: {
    flex: 1,
  },
  mapHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#05944F",
  },
  updateText: {
    fontSize: 12,
    color: "#666666",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  placeholderText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
  },
});

export default Home;