import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CycleLengthChart from "../components/CycleLengthChart"; // No need to pass cycleData anymore
import MoodTrendsChart from "../components/MoodTrendsChart"; // No need to pass moodData anymore
import OvulationPredictionChart from "../components/OvulationPredictionChart"; // No need to pass cycleData anymore
import SymptomChart from "../components/SymptomChart"; // No need to pass symptomData anymore

const InsightsScreen = () => {
  // print in insights screen
  console.log("InsightsScreen");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem(cycleData); // Replace 'your_key' with the actual key
        if (data !== null) {
          console.log("AsyncStorage Data:", JSON.parse(data));
        } else {
          console.log("No data found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cycle Insights</Text>

      {/* Cycle Length Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Cycle Length Trend</Text>
        <CycleLengthChart />
      </View>

      {/* Ovulation Prediction Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Ovulation Prediction</Text>
        <OvulationPredictionChart />
      </View>

      {/* Symptom Trends Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Symptom Trends</Text>
        <SymptomChart />
      </View>

      {/* Mood Trends Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Mood Trends</Text>
        <MoodTrendsChart />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chartContainer: {
    marginBottom: 32,
  },
});

export default InsightsScreen;
