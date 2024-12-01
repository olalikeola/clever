import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import AddCycleDataModal from "./AddCycleDataModal";

const CalendarScreen = () => {
  const [cycleData, setCycleData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [predictedPeriodDate, setPredictedPeriodDate] = useState(null);

  useEffect(() => {
    const loadCycleData = async () => {
      const data = await AsyncStorage.getItem("cycleData");
      if (data) {
        const parsedData = JSON.parse(data);
        setCycleData(parsedData);
        setPredictedPeriodDate(getPredictedPeriodDate(parsedData));
      }
    };

    loadCycleData();
  }, []);

  const handleAddCycleData = async (date, data) => {
    let updatedCycleData = { ...cycleData };

    if (data === null) {
      delete updatedCycleData[date];
    } else {
      updatedCycleData[date] = data;
    }

    setCycleData(updatedCycleData);
    await AsyncStorage.setItem("cycleData", JSON.stringify(updatedCycleData));
    setPredictedPeriodDate(getPredictedPeriodDate(updatedCycleData));
  };

  const getExistingDataForDate = (date) => {
    return cycleData[date] || null;
  };

  const markedDates = Object.keys(cycleData).reduce((acc, date) => {
    if (cycleData[date]) {
      acc[date] = {
        selected: true,
        selectedColor: "#ff6347",
        marked: true,
        dotColor: "#ff6347",
      };
    }
    return acc;
  }, {});

  const handleDayPress = (day) => {
    const currentDate = day.dateString;
    const existingData = getExistingDataForDate(currentDate);

    setSelectedDate(currentDate);
    setIsModalVisible(true);
  };

  const getPredictedPeriodDate = (cycleData) => {
    const dates = Object.keys(cycleData);
    const lastDate = new Date(
      Math.max(...dates.map((date) => new Date(date).getTime()))
    );
    const predictedStartDate = new Date(lastDate);
    predictedStartDate.setDate(lastDate.getDate() + 30);
    return predictedStartDate.toISOString().split("T")[0];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Cycle</Text>

      {predictedPeriodDate && (
        <Text style={styles.predictedDate}>
          Your next period is likely to start on {predictedPeriodDate}
        </Text>
      )}

      <Calendar
        current={new Date().toISOString().split("T")[0]}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: "#ff6347",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#ff6347",
          arrowColor: "#ff6347",
        }}
      />

      <AddCycleDataModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleAddCycleData}
        date={selectedDate}
        initialData={getExistingDataForDate(selectedDate)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fdfdfd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  predictedDate: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#ff6347",
    marginBottom: 20,
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
//   const [cycleData, setCycleData] = useState({});
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [predictedPeriodDate, setPredictedPeriodDate] = useState(null);

//   // Load saved cycle data from AsyncStorage when the component mounts
//   useEffect(() => {
//     const loadCycleData = async () => {
//       const data = await AsyncStorage.getItem("cycleData");
//       if (data) {
//         const parsedData = JSON.parse(data);
//         setCycleData(parsedData);
//         setPredictedPeriodDate(getPredictedPeriodDate(parsedData)); // Update predicted date
//       }
//     };

//     loadCycleData();
//   }, []);

//   // Save cycle data to AsyncStorage
//   const handleAddCycleData = async (date, data) => {
//     const updatedCycleData = { ...cycleData, [date]: data };
//     setCycleData(updatedCycleData);

//     // Save the updated cycle data in AsyncStorage
//     await AsyncStorage.setItem("cycleData", JSON.stringify(updatedCycleData));

//     // Recalculate the predicted next period date based on the updated data
//     setPredictedPeriodDate(getPredictedPeriodDate(updatedCycleData));
//   };

//   // Get existing data for the selected date
//   const getExistingDataForDate = (date) => {
//     return cycleData[date];
//   };

//   // Mark dates with cycle data
//   const markedDates = Object.keys(cycleData).reduce((acc, date) => {
//     acc[date] = {
//       selected: true,
//       selectedColor: "#ff6347", // Red for period days
//       marked: true,
//       dotColor: "#ff6347", // Add a dot to show there's data
//     };
//     return acc;
//   }, {});

//   const handleDayPress = (day) => {
//     setSelectedDate(day.dateString);
//     setIsModalVisible(true); // Open the modal when a date is selected
//   };

//   // Function to predict the next period based on the last logged date
//   const getPredictedPeriodDate = (cycleData) => {
//     const dates = Object.keys(cycleData);
//     const lastDate = new Date(
//       Math.max(...dates.map((date) => new Date(date).getTime()))
//     ); // Find the latest date
//     const predictedStartDate = new Date(lastDate);
//     predictedStartDate.setDate(lastDate.getDate() + 30); // Predict 30 days from the last cycle

//     return predictedStartDate.toISOString().split("T")[0]; // Return in 'YYYY-MM-DD' format
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Track Your Cycle</Text>

//       {predictedPeriodDate && (
//         <Text style={styles.predictedDate}>
//           Your next period is likely to start on {predictedPeriodDate}
//         </Text>
//       )}

//       <Calendar
//         current={new Date().toISOString().split("T")[0]} // Set current date
//         markedDates={markedDates}
//         onDayPress={handleDayPress} // Handle day press to open modal
//         theme={{
//           selectedDayBackgroundColor: "#ff6347", // Red for period days
//           selectedDayTextColor: "#ffffff",
//           todayTextColor: "#ff6347", // Highlight today's date
//           arrowColor: "#ff6347",
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
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   predictedDate: {
//     fontSize: 16,
//     fontStyle: "italic",
//     color: "#ff6347",
//     marginBottom: 20,
//   },
// });

// export default CalendarScreen;
