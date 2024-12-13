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

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView, StyleSheet, Text, View } from "react-native";
// import { ProgressCircle } from "react-native-svg-charts";

// const CycleLengthInsights = () => {
//   const [averageCycleLength, setAverageCycleLength] = useState(0);
//   const [cyclePhases, setCyclePhases] = useState({
//     follicular: 0,
//     luteal: 0,
//     proliferative: 0,
//     menstruation: 0,
//   });

//   // Load data from AsyncStorage and calculate averages
//   useEffect(() => {
//     const loadCycleData = async () => {
//       try {
//         const data = await AsyncStorage.getItem("cycleData");
//         if (data) {
//           const parsedData = JSON.parse(data);
//           calculateCycleAverages(parsedData);
//         } else {
//           console.log("No cycle data found in AsyncStorage.");
//         }
//       } catch (error) {
//         console.error("Error fetching data from AsyncStorage", error);
//       }
//     };

//     loadCycleData();
//   }, []);

//   const calculateCycleAverages = (cycleData) => {
//     const cycleLengths = Object.keys(cycleData)
//       .map((date) => {
//         const cycle = cycleData[date];
//         const startDate = new Date(date);

//         // Ensure 'endDate' exists, else log a warning and skip
//         if (!cycle.endDate) {
//           console.warn(
//             `No endDate found for cycle starting on ${date}. Skipping this cycle.`
//           );
//           return 0; // Skip this cycle if 'endDate' is missing
//         }

//         const endDate = new Date(cycle.endDate);

//         // Calculate cycle length as the difference in days
//         const cycleLength = Math.ceil(
//           (endDate - startDate) / (1000 * 3600 * 24)
//         );
//         return cycleLength;
//       })
//       .filter((length) => length > 0); // Filter out cycles with missing endDate

//     // If no valid cycles, return early
//     if (cycleLengths.length === 0) {
//       console.log("No valid cycles found for average calculation.");
//       return;
//     }

//     // Calculate average cycle length
//     const avgCycleLength =
//       cycleLengths.reduce((sum, length) => sum + length, 0) /
//       cycleLengths.length;

//     setAverageCycleLength(avgCycleLength);

//     // Calculate phase lengths based on average cycle length
//     const lutealPhaseLength = 14; // Luteal phase is generally around 14 days
//     const follicularPhaseLength = avgCycleLength - lutealPhaseLength; // The rest of the cycle is the follicular phase

//     // Phases breakdown
//     setCyclePhases({
//       follicular: follicularPhaseLength * 0.5, // Estimate as half of follicular phase
//       luteal: lutealPhaseLength,
//       proliferative: follicularPhaseLength * 0.5, // Proliferative phase is part of the follicular phase
//       menstruation: 5, // Average menstruation phase (5 days)
//     });
//   };

//   // Donut chart data based on cycle phases
//   const chartData = [
//     {
//       key: 1,
//       value: cyclePhases.menstruation,
//       svg: { fill: "#ff6347" },
//     },
//     {
//       key: 2,
//       value: cyclePhases.proliferative,
//       svg: { fill: "#ff8c00" },
//     },
//     {
//       key: 3,
//       value: cyclePhases.follicular,
//       svg: { fill: "#ffcc00" },
//     },
//     {
//       key: 4,
//       value: cyclePhases.luteal,
//       svg: { fill: "#4682b4" },
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Your Cycle Insights</Text>

//       <View style={styles.chartContainer}>
//         <ProgressCircle
//           style={{ height: 200 }}
//           progress={1}
//           progressDomain={[0, 100]}
//           strokeWidth={30}
//           backgroundColor="lightgray"
//           data={chartData}
//         />
//         <Text style={styles.averageText}>
//           Avg Cycle Length: {averageCycleLength} days
//         </Text>
//       </View>

//       <View style={styles.phasesContainer}>
//         <Text style={styles.phaseText}>
//           Menstruation: {cyclePhases.menstruation} days
//         </Text>
//         <Text style={styles.phaseText}>
//           Proliferative Phase: {cyclePhases.proliferative} days
//         </Text>
//         <Text style={styles.phaseText}>
//           Follicular Phase: {cyclePhases.follicular} days
//         </Text>
//         <Text style={styles.phaseText}>
//           Luteal Phase: {cyclePhases.luteal} days
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     alignItems: "center",
//     backgroundColor: "#fdfdfd",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   chartContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   averageText: {
//     fontSize: 16,
//     fontStyle: "italic",
//     color: "#555",
//   },
//   phasesContainer: {
//     marginTop: 20,
//   },
//   phaseText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
// });

// export default CycleLengthInsights;

// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import React, { useEffect, useState } from "react";
// // import { SafeAreaView, StyleSheet, Text, View } from "react-native";
// // import { ProgressCircle } from "react-native-svg-charts";

// // const CycleLengthInsights = () => {
// //   const [averageCycleLength, setAverageCycleLength] = useState(0);
// //   const [cyclePhases, setCyclePhases] = useState({
// //     follicular: 0,
// //     luteal: 0,
// //     proliferative: 0,
// //     menstruation: 0,
// //   });

// //   // Load data from AsyncStorage and calculate averages
// //   useEffect(() => {
// //     const loadCycleData = async () => {
// //       try {
// //         const data = await AsyncStorage.getItem("cycleData");
// //         if (data) {
// //           const parsedData = JSON.parse(data);
// //           calculateCycleAverages(parsedData);
// //         } else {
// //           console.log("No cycle data found in AsyncStorage.");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching data from AsyncStorage", error);
// //       }
// //     };

// //     loadCycleData();
// //   }, []);

// //   const calculateCycleAverages = (cycleData) => {
// //     const cycleLengths = Object.keys(cycleData).map((date) => {
// //       // Convert the date key to a Date object if needed
// //       const cycleStartDate = new Date(date);

// //       // Format to 'YYYY-MM-DD' if the date isn't already in the required format
// //       const formattedDate = cycleStartDate.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'

// //       // Get the cycle object for the corresponding date
// //       const cycle = cycleData[formattedDate];
// //       const startDate = new Date(formattedDate);
// //       const endDate = new Date(cycle.endDate); // Assuming 'endDate' is available in your data

// //       // Cycle length is the difference in days
// //       const cycleLength = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
// //       return cycleLength;
// //     });

// //     // Calculate average cycle length
// //     const avgCycleLength =
// //       cycleLengths.reduce((sum, length) => sum + length, 0) /
// //       cycleLengths.length;

// //     setAverageCycleLength(avgCycleLength);

// //     // Calculate phase lengths based on average cycle length
// //     const lutealPhaseLength = 14; // Luteal phase is generally around 14 days
// //     const follicularPhaseLength = avgCycleLength - lutealPhaseLength; // The rest of the cycle is the follicular phase

// //     // Phases breakdown
// //     setCyclePhases({
// //       follicular: follicularPhaseLength * 0.5, // Estimate as half of follicular phase
// //       luteal: lutealPhaseLength,
// //       proliferative: follicularPhaseLength * 0.5, // Proliferative phase is part of the follicular phase
// //       menstruation: 5, // Average menstruation phase (5 days)
// //     });
// //   };

// //   // Donut chart data based on cycle phases
// //   const chartData = [
// //     {
// //       key: 1,
// //       value: cyclePhases.menstruation,
// //       svg: { fill: "#ff6347" },
// //     },
// //     {
// //       key: 2,
// //       value: cyclePhases.proliferative,
// //       svg: { fill: "#ff8c00" },
// //     },
// //     {
// //       key: 3,
// //       value: cyclePhases.follicular,
// //       svg: { fill: "#ffcc00" },
// //     },
// //     {
// //       key: 4,
// //       value: cyclePhases.luteal,
// //       svg: { fill: "#4682b4" },
// //     },
// //   ];

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Text style={styles.title}>Your Cycle Insights</Text>

// //       <View style={styles.chartContainer}>
// //         <ProgressCircle
// //           style={{ height: 200 }}
// //           progress={1}
// //           progressDomain={[0, 100]}
// //           strokeWidth={30}
// //           backgroundColor="lightgray"
// //           data={chartData}
// //         />
// //         <Text style={styles.averageText}>
// //           Avg Cycle Length: {averageCycleLength} days
// //         </Text>
// //       </View>

// //       <View style={styles.phasesContainer}>
// //         <Text style={styles.phaseText}>
// //           Menstruation: {cyclePhases.menstruation} days
// //         </Text>
// //         <Text style={styles.phaseText}>
// //           Proliferative Phase: {cyclePhases.proliferative} days
// //         </Text>
// //         <Text style={styles.phaseText}>
// //           Follicular Phase: {cyclePhases.follicular} days
// //         </Text>
// //         <Text style={styles.phaseText}>
// //           Luteal Phase: {cyclePhases.luteal} days
// //         </Text>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     paddingTop: 40,
// //     alignItems: "center",
// //     backgroundColor: "#fdfdfd",
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     marginBottom: 20,
// //   },
// //   chartContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginBottom: 30,
// //   },
// //   averageText: {
// //     fontSize: 16,
// //     fontStyle: "italic",
// //     color: "#555",
// //   },
// //   phasesContainer: {
// //     marginTop: 20,
// //   },
// //   phaseText: {
// //     fontSize: 16,
// //     marginBottom: 10,
// //   },
// // });

// // export default CycleLengthInsights;
