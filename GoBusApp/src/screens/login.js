import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { loginUser } from "../apis/api"; // API Call
import { storeUserData } from "../store"; // AsyncStorage functions

const LoginScreen = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    busNumber: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      if (!credentials.busNumber || !credentials.password) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      const response = await loginUser(credentials);
      const { data, msg, code } = response;

      if (code === 0) {
        await storeUserData(data); // Save user data
        navigation.navigate("Home", { busData: data });
      } else {
        Alert.alert("Login Failed", msg);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      Alert.alert("Login failed", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bus Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Bus Number"
        value={credentials.busNumber}
        onChangeText={(text) => setCredentials({ ...credentials, busNumber: text })}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={credentials.password}
        secureTextEntry
        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default LoginScreen;
