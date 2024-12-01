import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

const HistoryScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Scrollable Calendar History</Text>
      {/* Add historical calendar data here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HistoryScreen;
