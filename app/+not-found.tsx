import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import React from "react";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <div style={styles.container}>
        <h1>404: Not Found</h1>
        <p>
          <Link href="/" style={styles.link}>
            Go to the home screen
          </Link>
        </p>
      </div>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
