import * as Location from "expo-location";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  ToastAndroid,
  Switch,
} from "react-native";
import { io } from "socket.io-client";
import { getUserData, storeUserData } from "../store";
import { handleStatus } from "../apis/api";
import CustomButton from "../components/CustomButton";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import useDistanceTracker, {
  calculateDistance,
} from "../utils/calculateDistance ";

import { NGROK_URL } from "../Keys";

const SOCKET_URL = NGROK_URL;

const Home = ({ navigation }) => {
  const [busData, setBusData] = useState(null);
  const [location, setLocation] = useState(null);
  const [start, setStart] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [busId, setBusId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const [busStatus, setBusStatus] = useState({
    is_delay: false,
    is_breakdown: false,
    today_work: false,
  });
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current.on("connect", () => {
      setSocketStatus("connected");
      console.log("Socket connected");
    });

    socketRef.current.on("disconnect", () => {
      setSocketStatus("disconnected");
      console.log("Socket disconnected");
    });

    socketRef.current.on("connect_error", (error) => {
      setSocketStatus("error");
      console.error("Socket connection error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const stopTrip = async () => {
    try {
      setConnecting(true);

      const { code, msg, data } = await handleStatus(busId, {
        start_trip: false,
      });

      if (code !== 0) {
        Alert.alert("Error", msg || "Failed to end trip");
        setConnecting(false);
        return;
      }

      await storeUserData(data.bus);
      setStart(false);
      setLocation(null);
      setLastUpdate(null);

      // Optional: Emit stop message to server
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("endTrip", { busId });
      }

      ToastAndroid.show("Trip ended successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Failed to stop trip:", error);
      Alert.alert("Error", "Could not stop the trip");
    } finally {
      setConnecting(false);
    }
  };

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
        const { data, code, msg } = await handleStatus(busId, {
          start_trip: true,
        });
        // console.log("Trip start response:", response);
        if (code !== 0) {
          Alert.alert("Error", msg || "Failed to start trip");
          setConnecting(false);
          return null;
        } else {
          await storeUserData(data.bus);
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
          mapRef.current?.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            1000
          );

          // Emit real-time location to the server
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("setLocation", {
              busId,
              latitude,
              longitude,
            });
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
  }, [start, startTrip]);

  const getBusData = async () => {
    try {
      const userData = await getUserData();

      if (userData) {
        setBusData(userData);
        setBusId(userData._id);
        setStart(userData.start_trip);
        setBusStatus({
          ...busStatus,
          is_delay: userData.is_delay,
          is_breakdown: userData.is_breakdown,
          today_work: userData.today_work,
        });
        console.log("busId set to:", userData._id);
      } else {
        console.log("No bus data found.");
        Alert.alert(
          "No Bus Data",
          "No bus information found. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => {
                console.log("User logged out. Redirecting to login screen.");
                navigation.navigate("Login");
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error getting bus data:", error);
      Alert.alert("Error", "Failed to load bus information");
    }
  };

  useEffect(() => {
    getBusData();
  }, []);

  const changeStatus = async (status) => {
    try {
      const { data, msg, code } = await handleStatus(busId, status);
      console.log("Status change response:", data, msg, code);
      if (code === 0) {
        await storeUserData(data.bus);
        setBusStatus((prevStatus) => ({
          ...prevStatus,
          ...status,
        }));
        if (status.is_delay) {
          ToastAndroid.show("Delay reported successfully", ToastAndroid.SHORT);
        } else if (status.is_breakdown) {
          ToastAndroid.show(
            "Breakdown reported successfully",
            ToastAndroid.SHORT
          );
        }

        console.log("Status updated successfully:", status);
        if (!status.today_work && !busStatus.start_trip) {
          navigation.navigate("OffDay", {
            busId: busId,
            totalDistance: totalDistance,
          });
        }
      }
    } catch (error) {
      Alert.alert(
        "Status update failed",
        "There was a problem connecting to the server. Please try again."
      );
    }
  };

  const handleReportDelay = () => {
    Alert.alert(
      busStatus.is_delay ? " Fixed Delay " : "Report Delay",
      busStatus.is_delay
        ? "Do you want to mark the delay as fixed?"
        : "Do you want to report a delay for this route?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () => changeStatus({ is_delay: !busStatus.is_delay }),
        },
      ]
    );
  };

  const handleReportBreakdown = () => {
    Alert.alert(
      busStatus.is_breakdown ? " Fixed Breakdown " : "Report Breakdown",
      busStatus.is_breakdown
        ? "Do you want to mark the bus as fixed?"
        : "Do you want to report a breakdown for this route?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () =>
            changeStatus({ is_breakdown: !busStatus.is_breakdown }),
        },
      ]
    );
  };

  const totalDistance = useDistanceTracker(start, location);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <View style={styles.headerLeftSection}>
            <Text style={styles.headerTitle}>Driver Dashboard</Text>
            {busData && (
              <Text style={styles.busInfo}>
                Bus #{busData.busNumber || "Unknown"}
              </Text>
            )}
            {/* total distance */}
            {totalDistance > 0 && (
              <Text style={styles.busInfo}>
                {totalDistance < 1000
                  ? `${totalDistance.toFixed(0)} m`
                  : `${(totalDistance / 1000).toFixed(2)} km`}
              </Text>
            )}
          </View>

          <View style={styles.headerRightSection}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Today's work</Text>
              <Switch
                trackColor={{ false: "#d1d5db", true: "#81b0ff" }}
                thumbColor={busStatus.today_work ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  setBusStatus((prevStatus) => ({
                    ...prevStatus,
                    today_work: !prevStatus.today_work,
                  }));
                  changeStatus({ today_work: !busStatus.today_work });
                }}
                value={busStatus.today_work}
                disabled={connecting || !busId || start}
              />
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
                        : "#F0B429",
                    },
                  ]}
                />
                <Text style={styles.statusText}>
                  {start ? "Active" : "Inactive"}
                </Text>
              </View>
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
                  if (start) {
                    stopTrip();
                  } else {
                    setStart(true);
                  }
                }}
                type={start ? "secondary" : "primary"}
                disabled={!busId || connecting || !busStatus.today_work}
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
                bgColor={busStatus.is_delay ? "#05944F" : "#E53E3E"}
                disabled={!busId || connecting || !start}
              />
              <CustomButton
                title={busStatus.is_breakdown ? "Fixed " : "Report Breakdown"}
                onPress={handleReportBreakdown}
                type="outline"
                icon={<AntDesign name="warning" size={20} color="#ffffff" />}
                width="48%"
                color={"#ffffff"}
                bgColor={busStatus.is_breakdown ? "#05944F" : "#E53E3E"}
                disabled={!busId || connecting || !start}
              />
            </View>
          </View>

          {/* Map */}
          <View style={[styles.card, styles.mapCard]}>
            <View style={styles.mapHeaderContainer}>
              <Text style={styles.cardTitle}>Live Location</Text>
              {lastUpdate && (
                <Text style={styles.updateText}>Last update: {lastUpdate}</Text>
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
                  showsCompass={true}
                  showsTraffic={true}
                  toolbarEnabled={true}
                  mapType={Platform.OS === "android" ? "terrain" : "standard"}
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
                  <Ionicons name="location-outline" size={48} color="#CCCCCC" />
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
    alignItems: "flex-start",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeftSection: {
    flex: 1,
  },
  headerRightSection: {
    alignItems: "flex-end",
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    marginRight: 8,
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
