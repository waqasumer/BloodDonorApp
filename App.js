import "react-native-gesture-handler";

import React from "react";
import { StyleSheet } from "react-native";
import BloodDonorApp from "./BloodDonorApp/BloodDonorApp.js";

export default function App() {
  return <BloodDonorApp />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
