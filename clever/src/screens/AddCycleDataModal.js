import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddCycleDataModal = ({ visible, onClose, onSave, date, initialData }) => {
  const [flow, setFlow] = useState("");
  const [pain, setPain] = useState("");
  const [spotting, setSpotting] = useState("");
  const [feelings, setFeelings] = useState("");
  const [mentalSymptoms, setMentalSymptoms] = useState([]);
  const [notes, setNotes] = useState("");

  // Format the date into the desired format: "Dec 12, 2024"
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    if (initialData) {
      setFlow(initialData.flow || "");
      setPain(initialData.pain || "");
      setSpotting(initialData.spotting || "");
      setFeelings(initialData.feelings || "");
      setMentalSymptoms(initialData.mentalSymptoms || []);
      setNotes(initialData.notes || "");
    } else {
      setFlow("");
      setPain("");
      setSpotting("");
      setFeelings("");
      setMentalSymptoms([]);
      setNotes("");
    }
  }, [initialData]);

  const handleSave = () => {
    const data = {
      flow,
      pain,
      spotting,
      feelings,
      mentalSymptoms,
      notes,
    };
    if (
      !flow &&
      !pain &&
      !spotting &&
      !feelings &&
      mentalSymptoms.length === 0 &&
      !notes
    ) {
      onSave(date, null); // Clear data if nothing is selected
    } else {
      onSave(date, data); // Save data if something is selected
    }
    onClose();
  };

  const renderButton = (title, currentValue, setValue, multiple = false) => (
    <TouchableOpacity
      key={title}
      style={[styles.button, currentValue === title && styles.selectedButton]}
      onPress={() => {
        if (multiple) {
          // Toggle selection for multiple symptoms (mental symptoms)
          if (currentValue.includes(title)) {
            setValue(currentValue.filter((item) => item !== title));
          } else {
            setValue([...currentValue, title]);
          }
        } else {
          setValue(currentValue === title ? "" : title);
        }
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.title}>Cycle Data for {formattedDate}</Text>

        {/* Flow Section */}
        <Text style={styles.label}>Flow</Text>
        <View style={styles.buttonContainer}>
          {["Light", "Medium", "Heavy"].map((option) =>
            renderButton(option, flow, setFlow)
          )}
        </View>

        {/* Pain Section */}
        <Text style={styles.label}>Pain</Text>
        <View style={styles.buttonContainer}>
          {["None", "Mild", "Severe"].map((option) =>
            renderButton(option, pain, setPain)
          )}
        </View>

        {/* Spotting Section */}
        <Text style={styles.label}>Spotting</Text>
        <View style={styles.buttonContainer}>
          {["Yes", "No"].map((option) =>
            renderButton(option, spotting, setSpotting)
          )}
        </View>

        {/* Feelings Section */}
        <Text style={styles.label}>Feelings</Text>
        <View style={styles.buttonContainer}>
          {["Happy", "Sad", "Irritable", "Anxious", "Calm"].map((option) =>
            renderButton(option, feelings, setFeelings)
          )}
        </View>

        {/* Mental Symptoms Section */}
        <Text style={styles.label}>Mental Symptoms</Text>
        <View style={styles.buttonContainer}>
          {["Cramps", "Fatigue", "Mood Swings", "Bloating"].map((option) =>
            renderButton(option, mentalSymptoms, setMentalSymptoms, true)
          )}
        </View>

        {/* Notes Section */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any additional notes here"
          style={styles.input}
          multiline
        />

        {/* Save and Cancel Buttons */}
        <View style={styles.buttonRow}>
          <Button title="Cancel" onPress={onClose} />
          <Button title="Save" onPress={handleSave} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight, // Adjust for the status bar on iOS devices
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Center the title
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center", // Center the label text
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center", // Center the buttons horizontally
    flexWrap: "wrap",
  },
  button: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: "#ff6347",
  },
  buttonText: {
    color: "#fff",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 8,
    fontSize: 16,
    minHeight: 60,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default AddCycleDataModal;
