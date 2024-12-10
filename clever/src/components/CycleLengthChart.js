import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const CycleLengthChart = () => {
  const [cycleData, setCycleData] = useState([]);

  useEffect(() => {
    const loadCycleData = async () => {
      const data = await AsyncStorage.getItem("cycleData");
      if (data) {
        const parsedData = JSON.parse(data);
        const formattedData = formatCycleData(parsedData);
        setCycleData(formattedData);
      }
    };

    loadCycleData();
  }, []);

  const formatCycleData = (cycleData) => {
    return Object.keys(cycleData).map((date) => ({
      date,
      cycleLength: cycleData[date].cycleLength || 28,
    }));
  };

  const data = {
    labels: cycleData.map(
      (cycle) => new Date(cycle.date).toISOString().split("T")[0]
    ),
    datasets: [
      {
        data: cycleData.map((cycle) => cycle.cycleLength),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cycle Length Trend</Text>
      <LineChart
        data={data}
        width={320} // from react-native
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default CycleLengthChart;
