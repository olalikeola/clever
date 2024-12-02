// components/SymptomChart.js

import React from "react";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

const SymptomChart = ({ symptomsData }) => {
  const symptomData = symptomsData.map((entry) => ({
    x: entry.date, // Date of symptom occurrence
    y: entry.intensity, // Intensity of the symptom (1 to 5 scale)
  }));

  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryLine
        data={symptomData}
        style={{
          data: { stroke: "#ff6347", strokeWidth: 2 },
        }}
      />
    </VictoryChart>
  );
};

export default SymptomChart;
