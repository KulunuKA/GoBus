import { View, Text, TextInput, StyleSheet, Animated } from "react-native";
import React, { useState } from "react";

const CustomInput = ({
  label,
  error,
  onChangeText,
  secureTextEntry,
  placeholder,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine the border color based on focus state and errors
  const getBorderColor = () => {
    if (error) return "#E53E3E";
    if (isFocused) return "#4C6EF5";
    return "#D1D5DB";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.helperText}>
          {isFocused ? `Enter your ${label}` : ""}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "80%",
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  helperText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
    height: 16,
  },
});

export default CustomInput;
