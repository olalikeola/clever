import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit"; // Corrected import for PieChart

// Function to calculate the phases based on cycle data
const calculateCyclePhases = (cycleData) => {
  const phases = {
    preOvulation: {
      uterine: {
        menstruation: 0,
        proliferative: 0,
      },
      ovarian: {
        follicular: 0,
        ovulation: 0,
      },
    },
    postOvulation: {
      uterine: {
        secretory: 0,
      },
      ovarian: {
        luteal: 0,
      },
    },
  };

  cycleData.forEach((cycle) => {
    const cycleLength = cycle.cycleLength;
    const ovulationDay = cycle.ovulationDay;

    // Pre-Ovulation Phases
    phases.preOvulation.uterine.menstruation = cycle.menstruationDuration;
    phases.preOvulation.uterine.proliferative =
      ovulationDay - cycle.menstruationDuration;

    phases.preOvulation.ovarian.follicular = ovulationDay;
    phases.preOvulation.ovarian.ovulation = 1; // Ovulation is one day

    // Post-Ovulation Phases
    phases.postOvulation.uterine.secretory = cycleLength - ovulationDay;
    phases.postOvulation.ovarian.luteal = cycleLength - ovulationDay;
  });

  return phases;
};

const CycleLengthChart = () => {
  const [cycleData, setCycleData] = useState([]);
  const [phases, setPhases] = useState(null);

  useEffect(() => {
    const loadCycleData = async () => {
      const data = await AsyncStorage.getItem("cycleData");
      if (data) {
        const parsedData = JSON.parse(data);
        const formattedData = formatCycleData(parsedData);
        const filteredData = filterLast6Months(formattedData);
        setCycleData(filteredData);

        // Calculate phases for the pie chart
        const calculatedPhases = calculateCyclePhases(filteredData);
        setPhases(calculatedPhases);
      }
    };

    loadCycleData();
  }, []);

  // Format cycle data to only include date, cycleLength, and ovulationDay
  const formatCycleData = (cycleData) => {
    return Object.keys(cycleData).map((date) => ({
      date,
      cycleLength: cycleData[date].cycleLength || 28,
      ovulationDay: cycleData[date].ovulationDay || 14, // Default ovulation on day 14
      menstruationDuration: cycleData[date].menstruationDuration || 5, // Default menstruation duration
    }));
  };

  // Filter the data to include only the last 6 months
  const filterLast6Months = (data) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return data.filter((cycle) => {
      const cycleDate = new Date(cycle.date);
      return cycleDate >= sixMonthsAgo;
    });
  };

  // Pie Chart Data
  const pieChartData = [
    {
      name: "Menstruation",
      population: phases?.preOvulation.uterine.menstruation || 0,
      color: "#FF6347", // Menstruation
      legendFontColor: "#000",
      legendFontSize: 12,
    },
    {
      name: "Proliferative",
      population: phases?.preOvulation.uterine.proliferative || 0,
      color: "#FFD700", // Proliferative
      legendFontColor: "#000",
      legendFontSize: 12,
    },
    {
      name: "Follicular",
      population: phases?.preOvulation.ovarian.follicular || 0,
      color: "#90EE90", // Follicular
      legendFontColor: "#000",
      legendFontSize: 12,
    },
    {
      name: "Ovulation",
      population: phases?.preOvulation.ovarian.ovulation || 0,
      color: "#FF1493", // Ovulation
      legendFontColor: "#000",
      legendFontSize: 12,
    },
    {
      name: "Secretory",
      population: phases?.postOvulation.uterine.secretory || 0,
      color: "#98FB98", // Secretory
      legendFontColor: "#000",
      legendFontSize: 12,
    },
    {
      name: "Luteal",
      population: phases?.postOvulation.ovarian.luteal || 0,
      color: "#BA55D3", // Luteal
      legendFontColor: "#000",
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cycle Phases Distribution</Text>
      {phases ? (
        <>
          <PieChart
            data={pieChartData}
            width={320} // Set width
            height={320} // Set height
            chartConfig={{
              backgroundColor: "#ffffff",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population" // This should match the field for population
            backgroundColor="transparent" // Set background transparent to avoid black screen
            paddingLeft="15" // Adjust padding
            center={[15, 10]} // Adjust center if necessary
          />
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseText}>Pre-Ovulation:</Text>
            <Text style={styles.phaseText}>
              Uterine Cycle: Menstruation, Proliferative
            </Text>
            <Text style={styles.phaseText}>
              Ovarian Cycle: Follicular, Ovulation
            </Text>

            <Text style={styles.phaseText}>Post-Ovulation:</Text>
            <Text style={styles.phaseText}>Uterine Cycle: Secretory</Text>
            <Text style={styles.phaseText}>Ovarian Cycle: Luteal</Text>
          </View>

          <View style={styles.definitionsContainer}>
            <Text style={styles.definitionTitle}>Cycle Definitions:</Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>Menstruation:</Text> The shedding of the
              uterine lining, which results in bleeding.
            </Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>Proliferative Phase:</Text> The phase
              when the uterine lining thickens in preparation for a potential
              pregnancy.
            </Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>Follicular Phase:</Text> The phase when
              follicles in the ovaries mature in preparation for ovulation.
            </Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>Ovulation:</Text> The release of a
              mature egg from the ovary.
            </Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>Secretory Phase:</Text> The phase after
              ovulation when the uterine lining continues to prepare for
              implantation.
            </Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>Luteal Phase:</Text> The phase after
              ovulation when the body prepares for possible pregnancy.
            </Text>
          </View>
        </>
      ) : (
        <Text>No cycle data available for the last 6 months</Text>
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
  phaseContainer: {
    marginTop: 16,
  },
  phaseText: {
    fontSize: 16,
    marginBottom: 4,
  },
  definitionsContainer: {
    marginTop: 16,
  },
  definitionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 16,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default CycleLengthChart;

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useEffect, useState } from "react";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { PieChart } from "react-native-chart-kit"; // Corrected import for PieChart

// // Function to calculate the phases based on cycle data
// const calculateCyclePhases = (cycleData) => {
//   const phases = {
//     preOvulation: {
//       uterine: {
//         menstruation: 0,
//         proliferative: 0,
//       },
//       ovarian: {
//         follicular: 0,
//         ovulation: 0,
//       },
//     },
//     postOvulation: {
//       uterine: {
//         secretory: 0,
//       },
//       ovarian: {
//         luteal: 0,
//       },
//     },
//   };

//   cycleData.forEach((cycle) => {
//     const cycleLength = cycle.cycleLength;
//     const ovulationDay = cycle.ovulationDay;

//     // Pre-Ovulation Phases
//     phases.preOvulation.uterine.menstruation = cycle.menstruationDuration;
//     phases.preOvulation.uterine.proliferative =
//       ovulationDay - cycle.menstruationDuration;

//     phases.preOvulation.ovarian.follicular = ovulationDay;
//     phases.preOvulation.ovarian.ovulation = 1; // Ovulation is one day

//     // Post-Ovulation Phases
//     phases.postOvulation.uterine.secretory = cycleLength - ovulationDay;
//     phases.postOvulation.ovarian.luteal = cycleLength - ovulationDay;
//   });

//   return phases;
// };

// const CycleLengthChart = () => {
//   const [cycleData, setCycleData] = useState([]);
//   const [phases, setPhases] = useState(null);

//   useEffect(() => {
//     const loadCycleData = async () => {
//       const data = await AsyncStorage.getItem("cycleData");
//       if (data) {
//         const parsedData = JSON.parse(data);
//         const formattedData = formatCycleData(parsedData);
//         const filteredData = filterLast6Months(formattedData);
//         setCycleData(filteredData);

//         // Calculate phases for the pie chart
//         const calculatedPhases = calculateCyclePhases(filteredData);
//         setPhases(calculatedPhases);
//       }
//     };

//     loadCycleData();
//   }, []);

//   // Format cycle data to only include date, cycleLength, and ovulationDay
//   const formatCycleData = (cycleData) => {
//     return Object.keys(cycleData).map((date) => ({
//       date,
//       cycleLength: cycleData[date].cycleLength || 28,
//       ovulationDay: cycleData[date].ovulationDay || 14, // Default ovulation on day 14
//       menstruationDuration: cycleData[date].menstruationDuration || 5, // Default menstruation duration
//     }));
//   };

//   // Filter the data to include only the last 6 months
//   const filterLast6Months = (data) => {
//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     return data.filter((cycle) => {
//       const cycleDate = new Date(cycle.date);
//       return cycleDate >= sixMonthsAgo;
//     });
//   };

//   // Pie Chart Data
//   const pieChartData = [
//     {
//       name: "Menstruation",
//       population: phases?.preOvulation.uterine.menstruation || 0,
//       color: "#FF6347", // Menstruation
//       legendFontColor: "#000",
//       legendFontSize: 12,
//     },
//     {
//       name: "Proliferative",
//       population: phases?.preOvulation.uterine.proliferative || 0,
//       color: "#FFD700", // Proliferative
//       legendFontColor: "#000",
//       legendFontSize: 12,
//     },
//     {
//       name: "Follicular",
//       population: phases?.preOvulation.ovarian.follicular || 0,
//       color: "#90EE90", // Follicular
//       legendFontColor: "#000",
//       legendFontSize: 12,
//     },
//     {
//       name: "Ovulation",
//       population: phases?.preOvulation.ovarian.ovulation || 0,
//       color: "#FF1493", // Ovulation
//       legendFontColor: "#000",
//       legendFontSize: 12,
//     },
//     {
//       name: "Secretory",
//       population: phases?.postOvulation.uterine.secretory || 0,
//       color: "#98FB98", // Secretory
//       legendFontColor: "#000",
//       legendFontSize: 12,
//     },
//     {
//       name: "Luteal",
//       population: phases?.postOvulation.ovarian.luteal || 0,
//       color: "#BA55D3", // Luteal
//       legendFontColor: "#000",
//       legendFontSize: 12,
//     },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Cycle Phases Distribution</Text>
//       {phases ? (
//         <>
//           <PieChart
//             data={pieChartData}
//             width={300}
//             height={300}
//             chartConfig={{
//               backgroundColor: "#ffffff",
//               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             }}
//           />
//           <View style={styles.phaseContainer}>
//             <Text style={styles.phaseText}>Pre-Ovulation:</Text>
//             <Text style={styles.phaseText}>
//               Uterine Cycle: Menstruation, Proliferative
//             </Text>
//             <Text style={styles.phaseText}>
//               Ovarian Cycle: Follicular, Ovulation
//             </Text>

//             <Text style={styles.phaseText}>Post-Ovulation:</Text>
//             <Text style={styles.phaseText}>Uterine Cycle: Secretory</Text>
//             <Text style={styles.phaseText}>Ovarian Cycle: Luteal</Text>
//           </View>

//           <View style={styles.definitionsContainer}>
//             <Text style={styles.definitionTitle}>Cycle Definitions:</Text>
//             <Text style={styles.definitionText}>
//               <Text style={styles.bold}>Menstruation:</Text> The shedding of the
//               uterine lining, which results in bleeding.
//             </Text>
//             <Text style={styles.definitionText}>
//               <Text style={styles.bold}>Proliferative Phase:</Text> The phase
//               when the uterine lining thickens in preparation for a potential
//               pregnancy.
//             </Text>
//             <Text style={styles.definitionText}>
//               <Text style={styles.bold}>Follicular Phase:</Text> The phase when
//               follicles in the ovaries mature in preparation for ovulation.
//             </Text>
//             <Text style={styles.definitionText}>
//               <Text style={styles.bold}>Ovulation:</Text> The release of a
//               mature egg from the ovary.
//             </Text>
//             <Text style={styles.definitionText}>
//               <Text style={styles.bold}>Secretory Phase:</Text> The phase after
//               ovulation when the uterine lining continues to prepare for
//               implantation.
//             </Text>
//             <Text style={styles.definitionText}>
//               <Text style={styles.bold}>Luteal Phase:</Text> The phase after
//               ovulation when the body prepares for possible pregnancy.
//             </Text>
//           </View>
//         </>
//       ) : (
//         <Text>No cycle data available for the last 6 months</Text>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   phaseContainer: {
//     marginTop: 16,
//   },
//   phaseText: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   definitionsContainer: {
//     marginTop: 16,
//   },
//   definitionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   definitionText: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   bold: {
//     fontWeight: "bold",
//   },
// });

// export default CycleLengthChart;

// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import React, { useEffect, useState } from "react";
// // import { ScrollView, StyleSheet, Text, View } from "react-native";
// // import { Doughnut } from "react-native-chart-kit"; // For the doughnut chart

// // // Function to calculate the phases based on cycle data
// // const calculateCyclePhases = (cycleData) => {
// //   const phases = {
// //     preOvulation: {
// //       uterine: {
// //         menstruation: 0,
// //         proliferative: 0,
// //       },
// //       ovarian: {
// //         follicular: 0,
// //         ovulation: 0,
// //       },
// //     },
// //     postOvulation: {
// //       uterine: {
// //         secretory: 0,
// //       },
// //       ovarian: {
// //         luteal: 0,
// //       },
// //     },
// //   };

// //   cycleData.forEach((cycle) => {
// //     const cycleLength = cycle.cycleLength;
// //     const ovulationDay = cycle.ovulationDay;

// //     // Pre-Ovulation Phases
// //     phases.preOvulation.uterine.menstruation = cycle.menstruationDuration;
// //     phases.preOvulation.uterine.proliferative =
// //       ovulationDay - cycle.menstruationDuration;

// //     phases.preOvulation.ovarian.follicular = ovulationDay;
// //     phases.preOvulation.ovarian.ovulation = 1; // Ovulation is one day

// //     // Post-Ovulation Phases
// //     phases.postOvulation.uterine.secretory = cycleLength - ovulationDay;
// //     phases.postOvulation.ovarian.luteal = cycleLength - ovulationDay;
// //   });

// //   return phases;
// // };

// // const CycleLengthChart = () => {
// //   const [cycleData, setCycleData] = useState([]);
// //   const [phases, setPhases] = useState(null);

// //   useEffect(() => {
// //     const loadCycleData = async () => {
// //       const data = await AsyncStorage.getItem("cycleData");
// //       if (data) {
// //         const parsedData = JSON.parse(data);
// //         const formattedData = formatCycleData(parsedData);
// //         const filteredData = filterLast6Months(formattedData);
// //         setCycleData(filteredData);

// //         // Calculate phases for the doughnut chart
// //         const calculatedPhases = calculateCyclePhases(filteredData);
// //         setPhases(calculatedPhases);
// //       }
// //     };

// //     loadCycleData();
// //   }, []);

// //   // Format cycle data to only include date, cycleLength, and ovulationDay
// //   const formatCycleData = (cycleData) => {
// //     return Object.keys(cycleData).map((date) => ({
// //       date,
// //       cycleLength: cycleData[date].cycleLength || 28,
// //       ovulationDay: cycleData[date].ovulationDay || 14, // Default ovulation on day 14
// //       menstruationDuration: cycleData[date].menstruationDuration || 5, // Default menstruation duration
// //     }));
// //   };

// //   // Filter the data to include only the last 6 months
// //   const filterLast6Months = (data) => {
// //     const sixMonthsAgo = new Date();
// //     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

// //     return data.filter((cycle) => {
// //       const cycleDate = new Date(cycle.date);
// //       return cycleDate >= sixMonthsAgo;
// //     });
// //   };

// //   // Doughnut Chart Data
// //   const doughnutData = {
// //     labels: [
// //       "Menstruation",
// //       "Proliferative",
// //       "Follicular",
// //       "Ovulation",
// //       "Secretory",
// //       "Luteal",
// //     ],
// //     datasets: [
// //       {
// //         data: [
// //           phases?.preOvulation.uterine.menstruation || 0,
// //           phases?.preOvulation.uterine.proliferative || 0,
// //           phases?.preOvulation.ovarian.follicular || 0,
// //           phases?.preOvulation.ovarian.ovulation || 0,
// //           phases?.postOvulation.uterine.secretory || 0,
// //           phases?.postOvulation.ovarian.luteal || 0,
// //         ],
// //         colors: [
// //           "#FF6347", // Menstruation
// //           "#FFD700", // Proliferative
// //           "#90EE90", // Follicular
// //           "#FF1493", // Ovulation
// //           "#98FB98", // Secretory
// //           "#BA55D3", // Luteal
// //         ],
// //       },
// //     ],
// //   };

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.title}>Cycle Phases Distribution</Text>
// //       {phases ? (
// //         <>
// //           <Doughnut
// //             data={doughnutData}
// //             width={300}
// //             height={300}
// //             chartConfig={{
// //               backgroundColor: "#ffffff",
// //               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
// //               labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
// //             }}
// //           />
// //           <View style={styles.phaseContainer}>
// //             <Text style={styles.phaseText}>Pre-Ovulation:</Text>
// //             <Text style={styles.phaseText}>
// //               Uterine Cycle: Menstruation, Proliferative
// //             </Text>
// //             <Text style={styles.phaseText}>
// //               Ovarian Cycle: Follicular, Ovulation
// //             </Text>

// //             <Text style={styles.phaseText}>Post-Ovulation:</Text>
// //             <Text style={styles.phaseText}>Uterine Cycle: Secretory</Text>
// //             <Text style={styles.phaseText}>Ovarian Cycle: Luteal</Text>
// //           </View>

// //           <View style={styles.definitionsContainer}>
// //             <Text style={styles.definitionTitle}>Cycle Definitions:</Text>
// //             <Text style={styles.definitionText}>
// //               <Text style={styles.bold}>Menstruation:</Text> The shedding of the
// //               uterine lining, which results in bleeding.
// //             </Text>
// //             <Text style={styles.definitionText}>
// //               <Text style={styles.bold}>Proliferative Phase:</Text> The phase
// //               when the uterine lining thickens in preparation for a potential
// //               pregnancy.
// //             </Text>
// //             <Text style={styles.definitionText}>
// //               <Text style={styles.bold}>Follicular Phase:</Text> The phase when
// //               follicles in the ovaries mature in preparation for ovulation.
// //             </Text>
// //             <Text style={styles.definitionText}>
// //               <Text style={styles.bold}>Ovulation:</Text> The release of a
// //               mature egg from the ovary.
// //             </Text>
// //             <Text style={styles.definitionText}>
// //               <Text style={styles.bold}>Secretory Phase:</Text> The phase after
// //               ovulation when the uterine lining continues to prepare for
// //               implantation.
// //             </Text>
// //             <Text style={styles.definitionText}>
// //               <Text style={styles.bold}>Luteal Phase:</Text> The phase after
// //               ovulation when the body prepares for possible pregnancy.
// //             </Text>
// //           </View>
// //         </>
// //       ) : (
// //         <Text>No cycle data available for the last 6 months</Text>
// //       )}
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     marginBottom: 16,
// //   },
// //   phaseContainer: {
// //     marginTop: 16,
// //   },
// //   phaseText: {
// //     fontSize: 16,
// //     marginBottom: 4,
// //   },
// //   definitionsContainer: {
// //     marginTop: 16,
// //   },
// //   definitionTitle: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     marginBottom: 8,
// //   },
// //   definitionText: {
// //     fontSize: 16,
// //     marginBottom: 4,
// //   },
// //   bold: {
// //     fontWeight: "bold",
// //   },
// // });

// // export default CycleLengthChart;

// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import React, { useEffect, useState } from "react";
// // // import { ScrollView, StyleSheet, Text, View } from "react-native";
// // // import { LineChart } from "react-native-chart-kit";

// // // // Function to calculate average cycle length
// // // const calculateAverageCycleLength = (cycleData) => {
// // //   const totalCycles = cycleData.length;
// // //   if (totalCycles === 0) return 0;

// // //   const totalLength = cycleData.reduce(
// // //     (acc, cycle) => acc + cycle.cycleLength,
// // //     0
// // //   );
// // //   return (totalLength / totalCycles).toFixed(1); // Rounded to 1 decimal place
// // // };

// // // const CycleLengthChart = () => {
// // //   const [cycleData, setCycleData] = useState([]);
// // //   const [averageCycleLength, setAverageCycleLength] = useState(0);

// // //   useEffect(() => {
// // //     const loadCycleData = async () => {
// // //       const data = await AsyncStorage.getItem("cycleData");
// // //       if (data) {
// // //         const parsedData = JSON.parse(data);
// // //         const formattedData = formatCycleData(parsedData);
// // //         const filteredData = filterLast6Months(formattedData);
// // //         setCycleData(filteredData);
// // //         setAverageCycleLength(calculateAverageCycleLength(filteredData));
// // //       }
// // //     };

// // //     loadCycleData();
// // //   }, []);

// // //   // Format cycle data to only include date and cycleLength
// // //   const formatCycleData = (cycleData) => {
// // //     return Object.keys(cycleData).map((date) => ({
// // //       date,
// // //       cycleLength: cycleData[date].cycleLength || 28,
// // //     }));
// // //   };

// // //   // Filter the data to include only the last 6 months
// // //   const filterLast6Months = (data) => {
// // //     const sixMonthsAgo = new Date();
// // //     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

// // //     return data.filter((cycle) => {
// // //       const cycleDate = new Date(cycle.date);
// // //       return cycleDate >= sixMonthsAgo;
// // //     });
// // //   };

// // //   // Prepare the data for the chart
// // //   const data = {
// // //     labels: cycleData.map(
// // //       (cycle) => new Date(cycle.date).toISOString().split("T")[0]
// // //     ), // Dates in YYYY-MM-DD format
// // //     datasets: [
// // //       {
// // //         data: cycleData.map((cycle) => cycle.cycleLength),
// // //       },
// // //     ],
// // //   };

// // //   return (
// // //     <ScrollView style={styles.container}>
// // //       <Text style={styles.title}>Cycle Length Trend</Text>
// // //       {cycleData.length > 0 ? (
// // //         <>
// // //           <LineChart
// // //             data={data}
// // //             width={320} // from react-native
// // //             height={220}
// // //             chartConfig={{
// // //               backgroundColor: "#e26a00",
// // //               backgroundGradientFrom: "#fb8c00",
// // //               backgroundGradientTo: "#ffa726",
// // //               decimalPlaces: 2, // optional, defaults to 2dp
// // //               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
// // //               labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
// // //               style: {
// // //                 borderRadius: 16,
// // //               },
// // //             }}
// // //             bezier
// // //           />
// // //           <View style={styles.averageContainer}>
// // //             <Text style={styles.averageText}>
// // //               Average Cycle Length (Last 6 months): {averageCycleLength} days
// // //             </Text>
// // //           </View>
// // //         </>
// // //       ) : (
// // //         <Text>No cycle data available for the last 6 months</Text>
// // //       )}
// // //     </ScrollView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 16,
// // //   },
// // //   title: {
// // //     fontSize: 24,
// // //     fontWeight: "bold",
// // //     marginBottom: 16,
// // //   },
// // //   averageContainer: {
// // //     marginTop: 16,
// // //     alignItems: "center",
// // //   },
// // //   averageText: {
// // //     fontSize: 18,
// // //     fontWeight: "bold",
// // //     color: "#32a852", // Green for average text
// // //   },
// // // });

// // // export default CycleLengthChart;

// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import React, { useEffect, useState } from "react";
// // // // import { ScrollView, StyleSheet, Text } from "react-native";
// // // // import { LineChart } from "react-native-chart-kit";

// // // // const CycleLengthChart = () => {
// // // //   const [cycleData, setCycleData] = useState([]);

// // // //   useEffect(() => {
// // // //     const loadCycleData = async () => {
// // // //       const data = await AsyncStorage.getItem("cycleData");
// // // //       if (data) {
// // // //         const parsedData = JSON.parse(data);
// // // //         const formattedData = formatCycleData(parsedData);
// // // //         setCycleData(formattedData);
// // // //       }
// // // //     };

// // // //     loadCycleData();
// // // //   }, []);

// // // //   const formatCycleData = (cycleData) => {
// // // //     return Object.keys(cycleData).map((date) => ({
// // // //       date,
// // // //       cycleLength: cycleData[date].cycleLength || 28,
// // // //     }));
// // // //   };

// // // //   const data = {
// // // //     labels: cycleData.map(
// // // //       (cycle) => new Date(cycle.date).toISOString().split("T")[0]
// // // //     ),
// // // //     datasets: [
// // // //       {
// // // //         data: cycleData.map((cycle) => cycle.cycleLength),
// // // //       },
// // // //     ],
// // // //   };

// // // //   return (
// // // //     <ScrollView style={styles.container}>
// // // //       <Text style={styles.title}>Cycle Length Trend</Text>
// // // //       <LineChart
// // // //         data={data}
// // // //         width={320} // from react-native
// // // //         height={220}
// // // //         chartConfig={{
// // // //           backgroundColor: "#e26a00",
// // // //           backgroundGradientFrom: "#fb8c00",
// // // //           backgroundGradientTo: "#ffa726",
// // // //           decimalPlaces: 2, // optional, defaults to 2dp
// // // //           color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
// // // //           labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
// // // //           style: {
// // // //             borderRadius: 16,
// // // //           },
// // // //         }}
// // // //         bezier
// // // //       />
// // // //     </ScrollView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     padding: 16,
// // // //   },
// // // //   title: {
// // // //     fontSize: 24,
// // // //     fontWeight: "bold",
// // // //     marginBottom: 16,
// // // //   },
// // // // });

// // // // export default CycleLengthChart;
