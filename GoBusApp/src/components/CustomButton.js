import {
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useState } from "react";

const CustomButton = ({
  onPress,
  width = "40%",
  title = "Login",
  type = "primary",
  loading = false,
  disabled = false,
  icon = null,
  color,
  bgColor
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonTypes = {
    primary: {
      backgroundColor: bgColor || "#05944F",
      textColor:  color || "#FFFFFF",
      pressedColor: "#047E43",
      disabledColor: "#82C4A5",
    },
    secondary: {
      backgroundColor: "#E6F7EF",
      textColor: "#05944F",
      pressedColor: "#D1EFDF",
      disabledColor: "#F5FAF8",
    },
  };

  const selectedType = buttonTypes[type] || buttonTypes.primary;

  const buttonStyle = {
    ...styles.buttonContainer,
    width: width,
    backgroundColor: disabled
      ? selectedType.disabledColor
      : isPressed
      ? selectedType.pressedColor
      : selectedType.backgroundColor,
    borderColor: selectedType.borderColor,
    borderWidth: selectedType.borderWidth,
  };

  const textStyle = {
    ...styles.text,
    color: disabled ? "#9CA3AF" : selectedType.textColor,
    marginLeft: icon ? 8 : 0,
  };

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      android_ripple={{ color: selectedType.pressedColor }}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={selectedType.textColor}
            style={styles.spinner}
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={textStyle}>{title}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  iconContainer: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    marginRight: 8,
  },
});
