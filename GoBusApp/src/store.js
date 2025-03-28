import AsyncStorage from "@react-native-async-storage/async-storage";

// Save user data
export const storeUserData = async (data) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

// Remove user data (Logout)
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};
