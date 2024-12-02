// InsightsScreen.js
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CycleLengthChart from "../components/CycleLengthChart"; // Ensure this path is correct

const InsightsScreen = ({ cycleData, symptomsData, moodData }) => {
  console.log("HERE");
  console.log("Cycle Data", cycleData);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cycle Insights</Text>

      {/* Cycle Length Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Cycle Length Trend</Text>
        <CycleLengthChart cycleData={cycleData} />{" "}
        {/* Make sure cycleData is valid */}
      </View>

      {/* Ovulation Prediction Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Ovulation Prediction</Text>
        {/* <OvulationPredictionChart cycleData={cycleData} /> */}
      </View>

      {/* Symptom Trends Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Symptom Trends</Text>
        {/* <SymptomChart symptomsData={symptomsData} /> */}
      </View>

      {/* Mood Trends Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Mood Trends</Text>
        {/* <MoodTrendsChart moodData={moodData} /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
  },
  chartContainer: {
    marginBottom: 20,
  },
});

export default InsightsScreen;
