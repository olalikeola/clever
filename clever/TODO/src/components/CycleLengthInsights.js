// CycleInsightsScreen.js
import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

const CycleInsightsScreen = ({ cycleData }) => {
  // Function to calculate the average cycle length
  const calculateAverageCycleLength = () => {
    const cycleLengths = [];

    Object.values(cycleData).forEach((entry) => {
      if (entry.cycleLength && entry.cycleLength !== null) {
        cycleLengths.push(entry.cycleLength);
      }
    });

    const totalCycleLength = cycleLengths.reduce((acc, len) => acc + len, 0);
    return cycleLengths.length ? totalCycleLength / cycleLengths.length : 28; // Default to 28 if no cycles recorded
  };

  // Function to predict the next period date based on last entry and average cycle length
  const predictNextPeriod = () => {
    const lastEntryDate = cycleData[Object.keys(cycleData).pop()].date;
    const avgCycleLength = calculateAverageCycleLength();

    const lastDateObj = new Date(lastEntryDate);
    const predictedNextPeriodDate = new Date(lastDateObj);
    predictedNextPeriodDate.setDate(lastDateObj.getDate() + avgCycleLength); // Add average cycle length to last date

    return predictedNextPeriodDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get average cycle length and predicted next period date
  const avgCycleLength = calculateAverageCycleLength();
  const predictedNextPeriod = predictNextPeriod();

  // Get the last recorded flow and pain
  const lastEntry = cycleData[Object.keys(cycleData).pop()]; // Get the latest entry
  const flow = lastEntry.flow || "Unknown";
  const pain = lastEntry.pain || "Unknown";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cycle Insights</Text>
      <Text style={styles.text}>
        Average Cycle Length: {avgCycleLength} days
      </Text>
      <Text style={styles.text}>
        Predicted Next Period: {predictedNextPeriod}
      </Text>
      <Text style={styles.text}>Last Recorded Flow: {flow}</Text>
      <Text style={styles.text}>Last Recorded Pain Level: {pain}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default CycleInsightsScreen;
