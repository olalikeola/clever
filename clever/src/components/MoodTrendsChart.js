import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit"; // Using the same chart library

const MoodTrendsChart = () => {
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    const loadMoodData = async () => {
      try {
        // Fetch mood data from AsyncStorage
        const data = await AsyncStorage.getItem("moodData");
        if (data) {
          const parsedData = JSON.parse(data);
          const formattedData = formatMoodData(parsedData);
          setMoodData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching mood data from AsyncStorage", error);
      }
    };

    loadMoodData();
  }, []);

  // Format the mood data for charting
  const formatMoodData = (data) => {
    return data.map((entry) => ({
      date: entry.date, // Date of mood entry
      moodScore: entry.moodScore, // Mood score (1-5)
    }));
  };

  // Prepare the data for the chart
  const chartData = {
    labels: moodData.map((entry) => entry.date), // Dates
    datasets: [
      {
        data: moodData.map((entry) => entry.moodScore), // Mood scores (1-5 scale)
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mood Trends</Text>
      <LineChart
        data={chartData}
        width={320} // from react-native
        height={220}
        chartConfig={{
          backgroundColor: "#32a852", // Green background for mood trend
          backgroundGradientFrom: "#66bb6a",
          backgroundGradientTo: "#43a047",
          decimalPlaces: 0, // Optional, set to 0 for mood scores (1-5)
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

export default MoodTrendsChart;

// // components/MoodTrendsChart.js

// import React from "react";
// import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

// const MoodTrendsChart = ({ moodData }) => {
//   const moodTrend = moodData.map((entry) => ({
//     x: entry.date, // Date of mood tracking
//     y: entry.moodScore, // Mood score (1 to 5 scale)
//   }));

//   return (
//     <VictoryChart theme={VictoryTheme.material}>
//       <VictoryLine
//         data={moodTrend}
//         style={{
//           data: { stroke: "#32a852", strokeWidth: 2 },
//         }}
//       />
//     </VictoryChart>
//   );
// };

// export default MoodTrendsChart;
