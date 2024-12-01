// src/screens/AddCycleDataModal.js

import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

const AddCycleDataModal = ({ visible, onClose, onSave, date }) => {
  const [flow, setFlow] = useState("");
  const [pain, setPain] = useState("");
  const [spotting, setSpotting] = useState("");
  const [feelings, setFeelings] = useState("");

  const handleSave = () => {
    const data = { flow, pain, spotting, feelings };
    onSave(date, data); // Save data to AsyncStorage
    onClose(); // Close the modal
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Cycle Data for {date}</Text>
        <TextInput
          placeholder="Flow (light/medium/heavy)"
          value={flow}
          onChangeText={setFlow}
          style={styles.input}
        />
        <TextInput
          placeholder="Pain (none/mild/severe)"
          value={pain}
          onChangeText={setPain}
          style={styles.input}
        />
        <TextInput
          placeholder="Spotting (yes/no)"
          value={spotting}
          onChangeText={setSpotting}
          style={styles.input}
        />
        <TextInput
          placeholder="Feelings"
          value={feelings}
          onChangeText={setFeelings}
          style={styles.input}
        />
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
});

export default AddCycleDataModal;
