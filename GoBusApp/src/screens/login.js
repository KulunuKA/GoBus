import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { loginUser } from "../apis/api";
import { getUserData, removeUserData, storeUserData } from "../store";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import logo from "../../assets/logo.png";

const LoginScreen = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    busNumber: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getBusData = async () => {
    try {
      const userData = await getUserData();
      console.log(userData)
    } catch (error) {
      console.error("Error getting bus data:", error);
      Alert.alert("Error", "Failed to load bus information");
    }
  };

  useEffect(() => {
    // removeUserData()
    getBusData();
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();

    try {
      // Form validation
      let newErrors = {};

      if (!credentials.busNumber) {
        newErrors.busNumber = "Enter bus number";
      }

      if (!credentials.password) {
        newErrors.password = "Enter password";
      }

      if (Object.keys(newErrors).length > 0) {
        setError(newErrors);
        return;
      }

      // Clear previous errors
      setError({});
      setIsLoading(true);

      const response = await loginUser(credentials);
      const { data, msg, code } = response;
      console.log("Login response:", response);
      if (code === 0) {
        await storeUserData(data);
        navigation.navigate("Home", { busData: data });
      } else {
        Alert.alert("Login Failed", msg);
      }
    } catch (error) {
      console.error("Login error:", error?.response?.data || error?.message);
      Alert.alert(
        "Login Failed",
        "There was a problem connecting to the server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.appTitle}>Driver Control Panel</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              <View style={styles.inputsContainer}>
                <CustomInput
                  label="Bus Number"
                  placeholder="Enter Bus Number"
                  secureTextEntry={false}
                  value={credentials.busNumber}
                  onChangeText={(text) => {
                    setError({ ...error, busData: "" });
                    setCredentials({ ...credentials, busNumber: text });
                  }}
                  error={error.busNumber}
                />

                <CustomInput
                  label="Password"
                  placeholder="Enter password"
                  value={credentials.password}
                  secureTextEntry={true}
                  onChangeText={(text) => {
                    setError({ ...error, password: "" });
                    setCredentials({ ...credentials, password: text });
                  }}
                  error={error.password}
                />

                <View style={styles.buttonContainer}>
                  <CustomButton
                    onPress={handleLogin}
                    title="Login"
                    loading={isLoading}
                  />
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2025 GoBus</Text>
            </View>
          </View>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#05944F",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
  },
  inputsContainer: {
    marginTop: 8,
    width: "100%",
  },
  buttonContainer: {
    marginTop: 16,
    width: "100%",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999999",
  },
});

export default LoginScreen;
