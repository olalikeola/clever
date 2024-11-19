// src/screens/CalendarScreen.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});

  const handleDayPress = async (day) => {
    const date = day.dateString;
    const updatedDates = { ...selectedDates, [date]: { selected: true } };
    setSelectedDates(updatedDates);
    await AsyncStorage.setItem("menstrualDates", JSON.stringify(updatedDates));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Cycle</Text>
      <Calendar
        markedDates={selectedDates}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: "#ff6347",
          selectedDayTextColor: "#ffffff",
        }}
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default CalendarScreen;
