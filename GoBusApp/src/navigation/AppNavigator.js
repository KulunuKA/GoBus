import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import HomeScreen from "../screens/home";
import OffDayScreen from "../screens/OffDay";

const Stack = createStackNavigator();

export default function AppNavigator() {
  useEffect(() => {
    // removeUserData()
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={"Home"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="OffDay" component={OffDayScreen} />
    </Stack.Navigator>
  );
}
