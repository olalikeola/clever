import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const OvulationPredictionChart = () => {
  const [cycleData, setCycleData] = useState([]);
  const [ovulationPrediction, setOvulationPrediction] = useState(null);

  useEffect(() => {
    const loadCycleData = async () => {
      const data = await AsyncStorage.getItem("cycleData");
      if (data) {
        const parsedData = JSON.parse(data);
        const formattedData = formatCycleData(parsedData);
        setCycleData(formattedData);
        calculateOvulationPrediction(formattedData);
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

  const calculateOvulationPrediction = (cycleData) => {
    // Ensure there is data to predict ovulation
    if (cycleData.length === 0) return;

    const lastCycle = cycleData[cycleData.length - 1];
    const ovulationDate = new Date(lastCycle.date);
    ovulationDate.setDate(ovulationDate.getDate() + lastCycle.cycleLength - 14); // Ovulation is typically 14 days before the next period

    setOvulationPrediction({
      x: ovulationDate.toISOString().split("T")[0], // Format the date as 'YYYY-MM-DD'
      y: 1, // Ovulation event
    });
  };

  // Prepare the data for the chart
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
      <Text style={styles.title}>Ovulation Prediction</Text>

      {ovulationPrediction ? (
        <>
          <Text style={styles.ovulationText}>
            Predicted Ovulation Date: {ovulationPrediction.x}
          </Text>
          <LineChart
            data={{
              labels: [...data.labels, ovulationPrediction.x],
              datasets: [
                {
                  data: [...data.datasets[0].data, 1], // Add the ovulation prediction point at y = 1
                },
              ],
            }}
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
        </>
      ) : (
        <Text>No cycle data available</Text>
      )}
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
  ovulationText: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default OvulationPredictionChart;

// import React from "react";
// import { Text } from "react-native";
// import {
//   VictoryAxis,
//   VictoryChart,
//   VictoryLine,
//   VictoryScatter,
//   VictoryTheme,
// } from "victory-native";

// // Define the OvulationPredictionChart component
// const OvulationPredictionChart = ({ cycleData }) => {
//   // Ensure there's cycle data to work with
//   if (!cycleData || cycleData.length === 0) {
//     return <Text>No cycle data available</Text>;
//   }

//   // Assume the most recent cycle is the one we're predicting ovulation from
//   const lastCycle = cycleData[cycleData.length - 1];

//   // Calculate the ovulation date: 14 days before the start of the next period
//   const ovulationDate = new Date(lastCycle.date);
//   ovulationDate.setDate(ovulationDate.getDate() + lastCycle.cycleLength - 14); // Ovulation is typically 14 days before the next period

//   const ovulationPrediction = {
//     x: ovulationDate.toISOString().split("T")[0], // Format the date as 'YYYY-MM-DD'
//     y: 1, // Fixed y-axis value for ovulation event
//   };

//   // Prepare the data for VictoryChart
//   const data = [
//     { x: lastCycle.date, y: 0 }, // Start of the cycle
//     { x: ovulationPrediction.x, y: 1 }, // Ovulation point
//   ];

//   return (
//     <VictoryChart theme={VictoryTheme.material}>
//       <VictoryAxis />
//       <VictoryLine
//         data={data}
//         style={{
//           data: { stroke: "blue", strokeWidth: 3 },
//         }}
//       />
//       <VictoryScatter
//         data={[ovulationPrediction]}
//         size={5}
//         style={{
//           data: { fill: "blue" },
//         }}
//       />
//     </VictoryChart>
//   );
// };

// export default OvulationPredictionChart;

// // // components/OvulationPredictionChart.js

// // import React from "react";
// // import {
// //   VictoryChart,
// //   VictoryLine,
// //   VictoryScatter,
// //   VictoryTheme,
// // } from "victory-native";

// // const OvulationPredictionChart = ({ cycleData }) => {
// //   // Assume the most recent cycle is the one we're predicting ovulation from
// //   const lastCycle = cycleData[cycleData.length - 1];
// //   const ovulationDate = new Date(lastCycle.date);
// //   ovulationDate.setDate(ovulationDate.getDate() + lastCycle.cycleLength - 14); // Ovulation is typically 14 days before the next period

// //   const ovulationPrediction = {
// //     x: ovulationDate.toISOString().split("T")[0], // Format the date in 'YYYY-MM-DD'
// //     y: 1, // Fixed y-axis value, as we're just marking the ovulation event
// //   };

// //   return (
// //     <VictoryChart theme={VictoryTheme.material}>
// //       <VictoryLine
// //         data={[
// //           { x: lastCycle.date, y: 0 },
// //           { x: ovulationPrediction.x, y: 1 },
// //         ]}
// //         style={{
// //           data: { stroke: "blue", strokeWidth: 3 },
// //         }}
// //       />
// //       <VictoryScatter
// //         data={[ovulationPrediction]}
// //         size={5}
// //         style={{
// //           data: { fill: "blue" },
// //         }}
// //       />
// //     </VictoryChart>
// //   );
// // };

// // export default OvulationPredictionChart;
