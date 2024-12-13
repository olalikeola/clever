import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit"; // Using the same chart library as in Cycle Length Chart

const SymptomChart = () => {
  const [symptomData, setSymptomData] = useState([]);

  useEffect(() => {
    const loadSymptomData = async () => {
      try {
        const data = await AsyncStorage.getItem("symptomsData");
        if (data) {
          const parsedData = JSON.parse(data);
          const formattedData = formatSymptomData(parsedData);
          setSymptomData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching symptom data from AsyncStorage", error);
      }
    };

    loadSymptomData();
  }, []);

  // Format the symptom data for charting
  const formatSymptomData = (data) => {
    return data.map((entry) => ({
      date: entry.date,
      intensity: calculateIntensity(entry), // Calculate a numeric intensity for charting
    }));
  };

  // Convert categorical symptom values to numeric intensity (for chart visualization)
  const calculateIntensity = (entry) => {
    let intensity = 0;

    // Assign numeric intensity values for different symptoms
    if (entry.flow === "Heavy") intensity += 3;
    else if (entry.flow === "Medium") intensity += 2;
    else if (entry.flow === "Light") intensity += 1;

    if (entry.pain === "Severe") intensity += 3;
    else if (entry.pain === "Mild") intensity += 2;
    else if (entry.pain === "None") intensity += 0;

    if (entry.spotting === "Yes") intensity += 1;

    return intensity;
  };

  // Prepare data for the chart
  const chartData = {
    labels: symptomData.map((entry) => entry.date),
    datasets: [
      {
        data: symptomData.map((entry) => entry.intensity),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Symptom Trends</Text>
      <LineChart
        data={chartData}
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

export default SymptomChart;

// // components/SymptomChart.js

// import React from "react";
// import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

// const SymptomChart = ({ symptomsData }) => {
//   const symptomData = symptomsData.map((entry) => ({
//     x: entry.date, // Date of symptom occurrence
//     y: entry.intensity, // Intensity of the symptom (1 to 5 scale)
//   }));

//   return (
//     <VictoryChart theme={VictoryTheme.material}>
//       <VictoryLine
//         data={symptomData}
//         style={{
//           data: { stroke: "#ff6347", strokeWidth: 2 },
//         }}
//       />
//     </VictoryChart>
//   );
// };

// export default SymptomChart;
