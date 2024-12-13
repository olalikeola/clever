import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

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
  const [currentDefinition, setCurrentDefinition] = useState(0); // To manage which cycle definition is being shown

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

  // Pie Chart Data (without legend properties)
  const pieChartData = [
    {
      name: "Menstruation",
      population: phases?.preOvulation.uterine.menstruation || 0,
      color: "#FF6347", // Menstruation
    },
    {
      name: "Proliferative",
      population: phases?.preOvulation.uterine.proliferative || 0,
      color: "#FFD700", // Proliferative
    },
    {
      name: "Follicular",
      population: phases?.preOvulation.ovarian.follicular || 0,
      color: "#90EE90", // Follicular
    },
    {
      name: "Ovulation",
      population: phases?.preOvulation.ovarian.ovulation || 0,
      color: "#FF1493", // Ovulation
    },
    {
      name: "Secretory",
      population: phases?.postOvulation.uterine.secretory || 0,
      color: "#add8e6", // Secretory
    },
    {
      name: "Luteal",
      population: phases?.postOvulation.ovarian.luteal || 0,
      color: "#BA55D3", // Luteal
    },
  ];

  const cycleDefinitions = [
    {
      title: "Menstruation",
      definition:
        "The shedding of the uterine lining, which results in bleeding.",
    },
    {
      title: "Proliferative Phase",
      definition:
        "The phase when the uterine lining thickens in preparation for a potential pregnancy.",
    },
    {
      title: "Follicular Phase",
      definition:
        "The phase when follicles in the ovaries mature in preparation for ovulation.",
    },
    {
      title: "Ovulation",
      definition: "The release of a mature egg from the ovary.",
    },
    {
      title: "Secretory Phase",
      definition:
        "The phase after ovulation when the uterine lining continues to prepare for implantation.",
    },
    {
      title: "Luteal Phase",
      definition:
        "The phase after ovulation when the body prepares for possible pregnancy.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cycle Phases Distribution</Text>

      {/* New Italicized Text Above the Chart */}
      <Text style={styles.pastSixMonthsText}>
        based on your past six months
      </Text>

      {phases ? (
        <>
          {/* Pie Chart */}
          <View style={styles.chartContainer}>
            <PieChart
              data={pieChartData}
              width={280} // Adjusted width (more reasonable size for visibility)
              height={280} // Adjusted height (more reasonable size for visibility)
              chartConfig={{
                backgroundColor: "#ffffff",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population" // This should match the field for population
              backgroundColor="transparent" // Set background transparent to avoid black screen
              paddingLeft={screenWidth / 6} // Adding some padding to avoid clipping
              hasLegend={false} // Hide the default legend
            />
          </View>

          {/* Custom Legend Below Chart */}
          <View style={styles.legendContainer}>
            {pieChartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </View>

          {/* Cycle Definitions Navigation */}
          <View style={styles.definitionsContainer}>
            <Text style={styles.definitionTitle}>
              {cycleDefinitions[currentDefinition].title}
            </Text>
            <Text style={styles.definitionText}>
              {cycleDefinitions[currentDefinition].definition}
            </Text>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                onPress={() =>
                  setCurrentDefinition((prev) =>
                    prev > 0 ? prev - 1 : cycleDefinitions.length - 1
                  )
                }
                style={styles.button}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setCurrentDefinition((prev) =>
                    prev < cycleDefinitions.length - 1 ? prev + 1 : 0
                  )
                }
                style={styles.button}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
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
    textAlign: "center", // Center the title
  },
  pastSixMonthsText: {
    fontSize: 18,
    color: "#6200EE", // Purple color
    textAlign: "center", // Center the text
    marginBottom: 16, // Add some space below the text
    fontStyle: "italic", // Make the text italic
  },
  chartContainer: {
    justifyContent: "center", // Ensures the chart is centered in the container
    alignItems: "center", // Ensures the chart is centered in the container
    marginBottom: 16,
    width: "100%", // Ensure the chart takes up the full width
    height: 300, // Optional: Set a height to give more space for the pie chart if needed
  },
  legendContainer: {
    flexDirection: "row", // Align legend items in a row
    flexWrap: "wrap", // Allow legend items to wrap to the next line
    justifyContent: "center", // Center the legend items
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8, // Space between legend items
    marginBottom: 8, // Space between rows if items wrap
  },
  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#000",
  },
  definitionsContainer: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  definitionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#6200EE",
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CycleLengthChart;
