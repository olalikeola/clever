import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
//import CycleLengthInsights from "../components/CycleLengthInsights";
//import CycleInsightsScreen from "../components/CycleLengthChart";
import { SafeAreaView } from "react-native-safe-area-context";
import CycleLengthChart from "../components/CycleLengthChart";
const InsightsScreen = () => {
  // print in insights screen
  console.log("InsightsScreen");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("cycleData"); // Replace 'your_key' with the actual key
        if (data !== null) {
          //console.log("AsyncStorage Data:", JSON.parse(data));
          console.log("AsyncStorage has data");
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
    <SafeAreaView style={styles.safecontainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.sectionTitle}>Cycle Length Trend</Text> */}
        <CycleLengthChart />
      </ScrollView>
    </SafeAreaView>
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
