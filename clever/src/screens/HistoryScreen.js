// src/screens/HistoryScreen.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import AddCycleDataModal from "./AddCycleDataModal"; // Import the modal component

const HistoryScreen = () => {
  const [cycleData, setCycleData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Load saved cycle data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadCycleData = async () => {
      const data = await AsyncStorage.getItem("cycleData");
      if (data) {
        setCycleData(JSON.parse(data)); // Parse and set state
      }
    };

    loadCycleData();
  }, []);

  // Save cycle data to AsyncStorage
  const handleAddCycleData = async (date, data) => {
    const newCycleData = { ...cycleData, [date]: data };
    setCycleData(newCycleData);
    await AsyncStorage.setItem("cycleData", JSON.stringify(newCycleData));
  };

  // Get existing data for the selected date
  const getExistingDataForDate = (date) => {
    return cycleData[date];
  };

  // Mark dates with cycle data
  const markedDates = Object.keys(cycleData).reduce((acc, date) => {
    acc[date] = {
      selected: true,
      selectedColor: "#ff6347", // Red for period days
      marked: true,
      dotColor: "#ff6347", // Add a dot to show there's data
    };
    return acc;
  }, {});

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true); // Open the modal when a date is selected
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Historical Calendar</Text>

      <Calendar
        current={new Date().toISOString().split("T")[0]} // Set current date
        markedDates={markedDates}
        onDayPress={handleDayPress} // Handle day press to open modal
        theme={{
          selectedDayBackgroundColor: "#ff6347", // Red for period days
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#ff6347", // Highlight today's date
          arrowColor: "#ff6347",
        }}
      />

      {/* Modal for adding/editing cycle data */}
      <AddCycleDataModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleAddCycleData}
        date={selectedDate}
        initialData={getExistingDataForDate(selectedDate)} // Pass existing data or undefined
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fdfdfd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HistoryScreen;

// // src/screens/HistoryScreen.js

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useEffect, useState } from "react";
// import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
// import AddCycleDataModal from "./AddCycleDataModal"; // Import the modal component

// const HistoryScreen = () => {
//   const [cycleData, setCycleData] = useState({});
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Load saved cycle data from AsyncStorage when the component mounts
//   useEffect(() => {
//     const loadCycleData = async () => {
//       const data = await AsyncStorage.getItem("cycleData");
//       if (data) {
//         setCycleData(JSON.parse(data)); // Parse and set state
//       }
//     };

//     loadCycleData();
//   }, []);

//   // Save cycle data to AsyncStorage
//   const handleAddCycleData = async (date, data) => {
//     const newCycleData = { ...cycleData, [date]: data };
//     setCycleData(newCycleData);
//     await AsyncStorage.setItem("cycleData", JSON.stringify(newCycleData));
//   };

//   // Get existing data for the selected date
//   const getExistingDataForDate = (date) => {
//     return cycleData[date];
//   };

//   // Render each month
//   const renderMonth = (month) => {
//     const daysInMonth = 30; // Let's assume 30 days for simplicity, replace with real logic
//     let days = [];
//     for (let i = 1; i <= daysInMonth; i++) {
//       const date = `${month}-${String(i).padStart(2, "0")}`;
//       days.push(
//         <View key={date} style={styles.dayContainer}>
//           <Button
//             title={`Day ${i}`}
//             onPress={() => {
//               setSelectedDate(date);
//               setIsModalVisible(true);
//             }}
//           />
//           {cycleData[date] && (
//             <Text style={styles.dayText}>
//               Data: {JSON.stringify(cycleData[date])}
//             </Text>
//           )}
//         </View>
//       );
//     }
//     return (
//       <View style={styles.monthContainer} key={month}>
//         <Text style={styles.monthTitle}>{month}</Text>
//         {days}
//       </View>
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Scrollable Calendar History</Text>
//       {["2023-01", "2023-02", "2023-03"].map(renderMonth)}{" "}
//       {/* Render some historical months */}
//       {/* Modal for adding/editing cycle data */}
//       <AddCycleDataModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSave={handleAddCycleData}
//         date={selectedDate}
//         initialData={getExistingDataForDate(selectedDate)} // Pass existing data or undefined
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "#fdfdfd",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   monthContainer: {
//     marginBottom: 20,
//   },
//   monthTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   dayContainer: {
//     marginBottom: 10,
//   },
//   dayText: {
//     fontSize: 14,
//     color: "gray",
//   },
// });

// export default HistoryScreen;

// // import React from "react";
// // import { ScrollView, StyleSheet, Text } from "react-native";

// // const HistoryScreen = () => {
// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.text}>Scrollable Calendar History</Text>
// //       {/* Add historical calendar data here */}
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flexGrow: 1,
// //     padding: 20,
// //   },
// //   text: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //   },
// // });

// // export default HistoryScreen;
