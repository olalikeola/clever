// src/screens/AddCycleDataModal.js

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
  // Initialize the states with empty strings or default values
  const [flow, setFlow] = useState("");
  const [pain, setPain] = useState("");
  const [spotting, setSpotting] = useState("");
  const [feelings, setFeelings] = useState("");

  useEffect(() => {
    if (initialData) {
      // If there is initial data, set the fields to the existing values
      setFlow(initialData.flow);
      setPain(initialData.pain);
      setSpotting(initialData.spotting);
      setFeelings(initialData.feelings);
    } else {
      // If no initial data (i.e., new entry), reset to default values (empty string or initial state)
      setFlow("");
      setPain("");
      setSpotting("");
      setFeelings("");
    }
  }, [initialData]); // Run every time initialData changes

  const handleSave = () => {
    const data = { flow, pain, spotting, feelings };
    onSave(date, data); // Save the data
    onClose(); // Close the modal after saving
  };

  const renderButton = (title, currentValue, setValue) => (
    <TouchableOpacity
      style={[styles.button, currentValue === title && styles.selectedButton]} // Highlight selected button
      onPress={() => setValue(title)} // Set value when button is pressed
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
    backgroundColor: "#ff6347", // Highlight selected button
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

// // src/screens/AddCycleDataModal.js

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

//   useEffect(() => {
//     if (initialData) {
//       setFlow(initialData.flow);
//       setPain(initialData.pain);
//       setSpotting(initialData.spotting);
//       setFeelings(initialData.feelings);
//     }
//   }, [initialData]);

//   const handleSave = () => {
//     const data = { flow, pain, spotting, feelings };
//     onSave(date, data);
//     onClose();
//   };

//   const renderButton = (title, currentValue, setValue) => (
//     <TouchableOpacity
//       style={[styles.button, currentValue === title && styles.selectedButton]}
//       onPress={() => setValue(title)}
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

// // // src/screens/AddCycleDataModal.js

// // import React, { useEffect, useState } from "react";
// // import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

// // const AddCycleDataModal = ({ visible, onClose, onSave, date, initialData }) => {
// //   const [flow, setFlow] = useState("");
// //   const [pain, setPain] = useState("");
// //   const [spotting, setSpotting] = useState("");
// //   const [feelings, setFeelings] = useState("");

// //   // If there's initial data passed, populate the fields with it
// //   useEffect(() => {
// //     if (initialData) {
// //       setFlow(initialData.flow);
// //       setPain(initialData.pain);
// //       setSpotting(initialData.spotting);
// //       setFeelings(initialData.feelings);
// //     }
// //   }, [initialData]); // Run whenever the initialData changes

// //   const handleSave = () => {
// //     const data = { flow, pain, spotting, feelings };
// //     onSave(date, data); // Save data to AsyncStorage
// //     onClose(); // Close the modal
// //   };

// //   return (
// //     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
// //       <View style={styles.modalContainer}>
// //         <Text style={styles.title}>Cycle Data for {date}</Text>
// //         <TextInput
// //           placeholder="Flow (light/medium/heavy)"
// //           value={flow}
// //           onChangeText={setFlow}
// //           style={styles.input}
// //         />
// //         <TextInput
// //           placeholder="Pain (none/mild/severe)"
// //           value={pain}
// //           onChangeText={setPain}
// //           style={styles.input}
// //         />
// //         <TextInput
// //           placeholder="Spotting (yes/no)"
// //           value={spotting}
// //           onChangeText={setSpotting}
// //           style={styles.input}
// //         />
// //         <TextInput
// //           placeholder="Feelings"
// //           value={feelings}
// //           onChangeText={setFeelings}
// //           style={styles.input}
// //         />
// //         <Button title="Save" onPress={handleSave} />
// //         <Button title="Cancel" onPress={onClose} />
// //       </View>
// //     </Modal>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     padding: 20,
// //     backgroundColor: "#fff",
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     marginBottom: 20,
// //   },
// //   input: {
// //     borderBottomWidth: 1,
// //     marginBottom: 10,
// //     padding: 8,
// //     fontSize: 16,
// //   },
// // });

// // export default AddCycleDataModal;

// // // // src/screens/AddCycleDataModal.js

// // // import React, { useState } from "react";
// // // import { Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

// // // const AddCycleDataModal = ({ visible, onClose, onSave, date }) => {
// // //   const [flow, setFlow] = useState("");
// // //   const [pain, setPain] = useState("");
// // //   const [spotting, setSpotting] = useState("");
// // //   const [feelings, setFeelings] = useState("");

// // //   const handleSave = () => {
// // //     const data = { flow, pain, spotting, feelings };
// // //     onSave(date, data); // Save data to AsyncStorage
// // //     onClose(); // Close the modal
// // //   };

// // //   return (
// // //     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
// // //       <View style={styles.modalContainer}>
// // //         <Text style={styles.title}>Cycle Data for {date}</Text>
// // //         <TextInput
// // //           placeholder="Flow (light/medium/heavy)"
// // //           value={flow}
// // //           onChangeText={setFlow}
// // //           style={styles.input}
// // //         />
// // //         <TextInput
// // //           placeholder="Pain (none/mild/severe)"
// // //           value={pain}
// // //           onChangeText={setPain}
// // //           style={styles.input}
// // //         />
// // //         <TextInput
// // //           placeholder="Spotting (yes/no)"
// // //           value={spotting}
// // //           onChangeText={setSpotting}
// // //           style={styles.input}
// // //         />
// // //         <TextInput
// // //           placeholder="Feelings"
// // //           value={feelings}
// // //           onChangeText={setFeelings}
// // //           style={styles.input}
// // //         />
// // //         <Button title="Save" onPress={handleSave} />
// // //         <Button title="Cancel" onPress={onClose} />
// // //       </View>
// // //     </Modal>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   modalContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     padding: 20,
// // //     backgroundColor: "#fff",
// // //   },
// // //   title: {
// // //     fontSize: 20,
// // //     fontWeight: "bold",
// // //     marginBottom: 20,
// // //   },
// // //   input: {
// // //     borderBottomWidth: 1,
// // //     marginBottom: 10,
// // //     padding: 8,
// // //     fontSize: 16,
// // //   },
// // // });

// // // export default AddCycleDataModal;
