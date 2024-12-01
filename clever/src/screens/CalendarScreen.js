// src/screens/CalendarScreen.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import AddCycleDataModal from "./AddCycleDataModal"; // Import the modal component

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [cycleData, setCycleData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  // Handle day press (select a date)
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true); // Open the modal when a date is selected
  };

  // Get the existing data for the selected date
  const getExistingDataForDate = (date) => {
    return cycleData[date]; // Return data for the selected date or undefined
  };

  // Calculate predicted period date (30 days from today)
  const getPredictedPeriodDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30); // Add 30 days
    return today.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
  };

  // Mark dates with cycle data
  const markedDates = Object.keys(cycleData).reduce((acc, date) => {
    acc[date] = { selected: true, selectedColor: "#ff6347" }; // Mark as red (period days)
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Cycle</Text>
      <Text style={styles.nextPeriodText}>
        Your next period is likely to start on: {getPredictedPeriodDate()}
      </Text>

      <Calendar
        current={new Date().toISOString().split("T")[0]}
        markedDates={markedDates}
        onDayPress={handleDayPress} // Handle day press to open modal
        theme={{
          selectedDayBackgroundColor: "#ff6347", // Red for period days
          selectedDayTextColor: "#ffffff",
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: Platform.OS === "ios" ? 40 : 20, // Adjust margin based on platform (iOS or Android)
    backgroundColor: "#fdfdfd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  nextPeriodText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default CalendarScreen;

// // src/screens/CalendarScreen.js

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useEffect, useState } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { Calendar } from "react-native-calendars";
// import AddCycleDataModal from "./AddCycleDataModal"; // Import the modal component

// const CalendarScreen = () => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [cycleData, setCycleData] = useState({});
//   const [isModalVisible, setIsModalVisible] = useState(false);

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

//   // Handle day press (select a date)
//   const handleDayPress = (day) => {
//     setSelectedDate(day.dateString);
//     setIsModalVisible(true); // Open the modal when a date is selected
//   };

//   // Get the existing data for the selected date
//   const getExistingDataForDate = (date) => {
//     return cycleData[date]; // Return data for the selected date or undefined
//   };

//   // Calculate predicted period date (30 days from today)
//   const getPredictedPeriodDate = () => {
//     const today = new Date();
//     today.setDate(today.getDate() + 30); // Add 30 days
//     return today.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
//   };

//   // Mark dates with cycle data
//   const markedDates = Object.keys(cycleData).reduce((acc, date) => {
//     acc[date] = { selected: true, selectedColor: "#ff6347" }; // Mark as red (period days)
//     return acc;
//   }, {});

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Track Your Cycle</Text>
//       <Text style={styles.nextPeriodText}>
//         Your next period is likely to start on: {getPredictedPeriodDate()}
//       </Text>

//       <Calendar
//         current={new Date().toISOString().split("T")[0]}
//         markedDates={markedDates}
//         onDayPress={handleDayPress} // Handle day press to open modal
//         theme={{
//           selectedDayBackgroundColor: "#ff6347", // Red for period days
//           selectedDayTextColor: "#ffffff",
//         }}
//       />

//       {/* Modal for adding/editing cycle data */}
//       <AddCycleDataModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSave={handleAddCycleData}
//         date={selectedDate}
//         initialData={getExistingDataForDate(selectedDate)} // Pass existing data or undefined
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fdfdfd",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   nextPeriodText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
// });

// export default CalendarScreen;

// // src/screens/CalendarScreen.js

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useEffect, useState } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { Calendar } from "react-native-calendars";
// import AddCycleDataModal from "./AddCycleDataModal"; // Import the modal component

// const CalendarScreen = () => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [cycleData, setCycleData] = useState({});
//   const [isModalVisible, setIsModalVisible] = useState(false);

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

//   // Mark dates with cycle data
//   const markedDates = Object.keys(cycleData).reduce((acc, date) => {
//     acc[date] = { selected: true, selectedColor: "#ff6347" }; // Mark as red (period days)
//     return acc;
//   }, {});

//   // Handle day press (select a date)
//   const handleDayPress = (day) => {
//     setSelectedDate(day.dateString);
//     setIsModalVisible(true); // Open the modal when a date is selected
//   };

//   // Calculate predicted period date (30 days from today)
//   const getPredictedPeriodDate = () => {
//     const today = new Date();
//     today.setDate(today.getDate() + 30); // Add 30 days
//     return today.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Track Your Cycle</Text>
//       <Text style={styles.nextPeriodText}>
//         Your next period is likely to start on: {getPredictedPeriodDate()}
//       </Text>

//       <Calendar
//         current={new Date().toISOString().split("T")[0]}
//         markedDates={markedDates}
//         onDayPress={handleDayPress}
//         theme={{
//           selectedDayBackgroundColor: "#ff6347", // Red for period days
//           selectedDayTextColor: "#ffffff",
//         }}
//       />

//       {/* Modal for adding cycle data */}
//       <AddCycleDataModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSave={handleAddCycleData}
//         date={selectedDate}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fdfdfd",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   nextPeriodText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
// });

// export default CalendarScreen;

// // // src/screens/CalendarScreen.js
// // import React from "react";
// // import { StyleSheet, Text, View } from "react-native";
// // import { Calendar } from "react-native-calendars";

// // const CalendarScreen = () => {
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Track Your Cycle</Text>
// //       <Calendar
// //         theme={{
// //           selectedDayBackgroundColor: "#ff6347",
// //           selectedDayTextColor: "#ffffff",
// //         }}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: "#fdfdfd",
// //   },
// //   title: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     marginBottom: 20,
// //   },
// // });

// // export default CalendarScreen;
