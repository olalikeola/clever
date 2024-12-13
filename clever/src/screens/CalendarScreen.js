import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
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
      delete updatedCycleData[date]; // Remove data for this date
    } else {
      // Save the cycle data with the cycle length (for example)
      updatedCycleData[date] = {
        ...data, // existing data
        cycleLength: data.cycleLength || 28, // Default cycle length (you can adjust this)
      };
    }

    setCycleData(updatedCycleData);
    await AsyncStorage.setItem("cycleData", JSON.stringify(updatedCycleData));
    setPredictedPeriodDate(getPredictedPeriodDate(updatedCycleData)); // Update the prediction
  };

  const getExistingDataForDate = (date) => {
    return cycleData[date] || null;
  };

  // Mark dates that have cycle data
  const markedDates = Object.keys(cycleData).reduce((acc, date) => {
    if (cycleData[date]) {
      acc[date] = {
        selected: true,
        selectedColor: "#ff6347", // Red for period days
        marked: true,
        dotColor: "#ff6347", // Add a dot to show there's data
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

  // Format the predicted period date to "Dec 12, 2024"
  const getPredictedPeriodDate = (cycleData) => {
    const dates = Object.keys(cycleData);
    const lastDate = new Date(
      Math.max(...dates.map((date) => new Date(date).getTime()))
    );
    const predictedStartDate = new Date(lastDate);
    predictedStartDate.setDate(lastDate.getDate() + 30); // Predict 30 days from the last cycle

    // Format the predicted date in "Dec 12, 2024" format
    return predictedStartDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Title and predicted date */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Track Your Cycle</Text>

        {predictedPeriodDate && (
          <Text style={styles.predictedDate}>
            Your next period is likely to start on {predictedPeriodDate}
          </Text>
        )}
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={new Date().toISOString().split("T")[0]} // Set current date
          markedDates={markedDates}
          onDayPress={handleDayPress} // Open modal when a date is selected
          theme={{
            selectedDayBackgroundColor: "#ff6347", // Red for period days
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#6200EE", // Highlight today's date
            arrowColor: "#6200EE",
          }}
        />
      </View>

      {/* Modal for adding/editing cycle data */}
      <AddCycleDataModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleAddCycleData}
        date={selectedDate}
        initialData={getExistingDataForDate(selectedDate)} // Pass existing data or undefined
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  textContainer: {
    paddingTop: 40, // This will allow some space below the status bar
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  predictedDate: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6200EE",
  },
  calendarContainer: {
    flex: 1,
    justifyContent: "flex-start", // Keeps the calendar in the upper part of the container
    width: "100%", // Ensures the calendar takes full width
  },
});

export default CalendarScreen;
