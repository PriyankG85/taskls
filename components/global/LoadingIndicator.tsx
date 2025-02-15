import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const LoadingIndicator = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#a3baf1" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;
