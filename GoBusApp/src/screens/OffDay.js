import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useRoute } from "@react-navigation/native";
import { addIncome, handleStatus } from "../apis/api";
import { getUserData } from "../store";

const OffDayScreen = ({ navigation }) => {
  const { busId, totalDistance } = useRoute().params || {};
  const [incomeData, setIncomeData] = useState({
    income: 0,
    date: new Date().toISOString().split("T")[0],
    distance: totalDistance,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [busData, setBusData] = useState({});
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const [currentFuel, setCurrentFuel] = useState(0);

  const handleSubmit = async () => {
    setError({});

    let newErrors = {};

    if (!incomeData.income) {
      newErrors.income = "Please enter a valid income";
    } else if (isNaN(incomeData.income)) {
      newErrors.income = "Income must be a number";
    } else if (incomeData.income <= 0) {
      newErrors.income = "Income must be greater than zero";
    }

    // If we have errors, show them and don't proceed
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      const { data, msg, code } = await addIncome(busId, incomeData);

      const res = await handleStatus(busId, {
        current_fuel_level: updateCurrentFuel(),
      });
      // Show success message
      if (code == 0) {
        navigation.navigate("Home");
        Alert.alert(
          "Success",
          "Your off day income has been recorded successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form after successful submission
                setIncomeData({
                  income: "",
                  date: new Date().toISOString().split("T")[0],
                  totalDistance: totalDistance,
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error saving off day income:", error);
      Alert.alert(
        "Error",
        "Failed to save your off day income. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getBusData = async () => {
    try {
      const userData = await getUserData();
      console.log(userData);
      if (userData) {
        setBusData(userData);
        setIncomeHistory(userData.daily_income);
        setFuelConsumption(busData.fuel_consumption);
        setCurrentFuel(busData.current_fuel_level);
      }
    } catch (error) {
      console.error("Error getting bus data:", error);
      Alert.alert("Error", "Failed to load bus information");
    }
  };

  const updateCurrentFuel = () => {
    return currentFuel - totalDistance / fuelConsumption;
  };

  useEffect(() => {
    // removeUserData()
    getBusData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#05944F" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Off Day Income</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Main Content */}
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="calendar-alt" size={24} color="#05944F" />
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Daily Income Details</Text>

                <CustomInput
                  label="Income Amount"
                  placeholder="Enter income"
                  value={incomeData.income}
                  onChangeText={(text) =>
                    setIncomeData({
                      ...incomeData,
                      income: parseInt(text),
                    })
                  }
                  error={error.income}
                  keyboardType="decimal-pad"
                />

                <Text style={styles.sectionTitle}>
                  Distance Traveled: {totalDistance} km
                </Text>

                <View style={styles.infoContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#6B7280"
                  />
                  <Text style={styles.infoText}>
                    Record your income for your off day. This helps track your
                    earnings when you're not on regular duty.
                  </Text>
                </View>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                  <CustomButton
                    title="Save Income"
                    onPress={handleSubmit}
                    loading={isLoading}
                    icon={
                      <MaterialIcons name="save" size={20} color="#FFFFFF" />
                    }
                  />
                </View>
              </View>
            </View>

            {/* Income History Preview */}
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Recent Income History</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#05944F"
                  />
                </TouchableOpacity>
              </View>

              {incomeHistory.length > 0 ? (
                incomeHistory.map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyDate}>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </Text>
                      <Text style={styles.historyNotes}>
                        {item.distance || "No notes"}
                      </Text>
                    </View>
                    <Text style={styles.historyAmount}>
                      LKR {item.income.toFixed(2)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No income history available</Text>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
  },
  placeholder: {
    width: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#05944F",
  },
  formContainer: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#05944F",
    fontWeight: "500",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  historyItemLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  historyNotes: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#05944F",
  },
});

export default OffDayScreen;
