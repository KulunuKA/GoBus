import "react-native-gesture-handler";
import React from "react";
import Navigation from "./navigation";
import { View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}
