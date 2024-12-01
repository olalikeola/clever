import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
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

  useEffect(() => {
    if (initialData) {
      setFlow(initialData.flow || "");
      setPain(initialData.pain || "");
      setSpotting(initialData.spotting || "");
      setFeelings(initialData.feelings || "");
    } else {
      setFlow("");
      setPain("");
      setSpotting("");
      setFeelings("");
    }
  }, [initialData]);

  const handleSave = () => {
    const data = { flow, pain, spotting, feelings };
    if (!flow && !pain && !spotting && !feelings) {
      onSave(date, null); // Clear data if nothing is selected
    } else {
      onSave(date, data); // Save data if something is selected
    }
    onClose();
  };

  const renderButton = (title, currentValue, setValue) => (
    <TouchableOpacity
      key={title}
      style={[styles.button, currentValue === title && styles.selectedButton]}
      onPress={() => {
        setValue(currentValue === title ? "" : title);
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Cycle Data for {date}</Text>

        <Text style={styles.label}>Flow</Text>
        <View style={styles.buttonContainer}>
          {["Light", "Medium", "Heavy"].map((option) =>
            renderButton(option, flow, setFlow)
          )}
        </View>

        <Text style={styles.label}>Pain</Text>
        <View style={styles.buttonContainer}>
          {["None", "Mild", "Severe"].map((option) =>
            renderButton(option, pain, setPain)
          )}
        </View>

        <Text style={styles.label}>Spotting</Text>
        <View style={styles.buttonContainer}>
          {["Yes", "No"].map((option) =>
            renderButton(option, spotting, setSpotting)
          )}
        </View>

        <Text style={styles.label}>Feelings</Text>
        <TextInput
          value={feelings}
          onChangeText={setFeelings}
          placeholder="Describe your feelings"
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
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#ff6347",
  },
  buttonText: {
    color: "#fff",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
});

export default AddCycleDataModal;

// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const AddCycleDataModal = ({ visible, onClose, onSave, date, initialData }) => {
//   const [flow, setFlow] = useState("");
//   const [pain, setPain] = useState("");
//   const [spotting, setSpotting] = useState("");
//   const [feelings, setFeelings] = useState("");

//   // Set initial values when the modal is opened
//   useEffect(() => {
//     if (initialData) {
//       setFlow(initialData.flow || ""); // Set initial values from data if available
//       setPain(initialData.pain || "");
//       setSpotting(initialData.spotting || "");
//       setFeelings(initialData.feelings || "");
//     } else {
//       setFlow(""); // Default values for new entries
//       setPain("");
//       setSpotting("");
//       setFeelings("");
//     }
//   }, [initialData]); // This runs every time `initialData` changes

//   // Handle saving the data when user clicks Save
//   const handleSave = () => {
//     const data = { flow, pain, spotting, feelings };
//     onSave(date, data); // Pass the updated data to the parent component (CalendarScreen)
//     onClose(); // Close the modal after saving
//   };

//   // Toggle button selection logic
//   const renderButton = (title, currentValue, setValue) => (
//     <TouchableOpacity
//       key={title}
//       style={[styles.button, currentValue === title && styles.selectedButton]} // Highlight button if selected
//       onPress={() => {
//         // Toggle selection (if selected, unselect it)
//         setValue(currentValue === title ? "" : title);
//       }}
//     >
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//       <View style={styles.modalContainer}>
//         <Text style={styles.title}>Cycle Data for {date}</Text>

//         <Text style={styles.label}>Flow</Text>
//         <View style={styles.buttonContainer}>
//           {["Light", "Medium", "Heavy"].map((option) =>
//             renderButton(option, flow, setFlow)
//           )}
//         </View>

//         <Text style={styles.label}>Pain</Text>
//         <View style={styles.buttonContainer}>
//           {["None", "Mild", "Severe"].map((option) =>
//             renderButton(option, pain, setPain)
//           )}
//         </View>

//         <Text style={styles.label}>Spotting</Text>
//         <View style={styles.buttonContainer}>
//           {["Yes", "No"].map((option) =>
//             renderButton(option, spotting, setSpotting)
//           )}
//         </View>

//         <Text style={styles.label}>Feelings</Text>
//         <TextInput
//           value={feelings}
//           onChangeText={setFeelings}
//           placeholder="Describe your feelings"
//           style={styles.input}
//         />

//         <Button title="Save" onPress={handleSave} />
//         <Button title="Cancel" onPress={onClose} />
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginTop: 10,
//     fontWeight: "bold",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginTop: 10,
//     justifyContent: "space-between",
//   },
//   button: {
//     padding: 10,
//     backgroundColor: "#ddd",
//     borderRadius: 5,
//   },
//   selectedButton: {
//     backgroundColor: "#ff6347", // Highlight selected button
//   },
//   buttonText: {
//     color: "#fff",
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 10,
//     padding: 8,
//     fontSize: 16,
//   },
// });

// export default AddCycleDataModal;
