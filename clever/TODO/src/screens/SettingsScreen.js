import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import RNFS from "react-native-csv";
import Share from "react-native-share";

const SettingsScreen = ({ navigation }) => {
  const sampleData = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 },
  ];

  const exportDataToCSV = async () => {
    try {
      // Convert data to CSV format
      const csvHeader = "ID,Name,Age\n";
      const csvRows = sampleData
        .map((row) => `${row.id},${row.name},${row.age}`)
        .join("\n");
      const csvContent = csvHeader + csvRows;

      // Save CSV file
      const filePath = `${RNFS.DocumentDirectoryPath}/data.csv`;
      await RNFS.writeFile(filePath, csvContent, "utf8");

      // Share the file
      await Share.open({
        url: `file://${filePath}`,
        type: "text/csv",
        title: "Share CSV",
      });

      Alert.alert("Success", "Data exported and shared successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to export data: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>

      {/* Export to CSV Button */}
      <Button title="Export and Share CSV" onPress={exportDataToCSV} />

      {/* Go Back Button */}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default SettingsScreen;

// import React from "react";
// import { Button, StyleSheet, Text, View } from "react-native";

// const SettingsScreen = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Settings Screen</Text>
//       {/* Add settings options here */}
//       <Button title="Go Back" onPress={() => navigation.goBack()} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });

// export default SettingsScreen;
