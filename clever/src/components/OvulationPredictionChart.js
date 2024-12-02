// components/OvulationPredictionChart.js

import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";

const OvulationPredictionChart = ({ cycleData }) => {
  // Assume the most recent cycle is the one we're predicting ovulation from
  const lastCycle = cycleData[cycleData.length - 1];
  const ovulationDate = new Date(lastCycle.date);
  ovulationDate.setDate(ovulationDate.getDate() + lastCycle.cycleLength - 14); // Ovulation is typically 14 days before the next period

  const ovulationPrediction = {
    x: ovulationDate.toISOString().split("T")[0], // Format the date in 'YYYY-MM-DD'
    y: 1, // Fixed y-axis value, as we're just marking the ovulation event
  };

  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryLine
        data={[
          { x: lastCycle.date, y: 0 },
          { x: ovulationPrediction.x, y: 1 },
        ]}
        style={{
          data: { stroke: "blue", strokeWidth: 3 },
        }}
      />
      <VictoryScatter
        data={[ovulationPrediction]}
        size={5}
        style={{
          data: { fill: "blue" },
        }}
      />
    </VictoryChart>
  );
};

export default OvulationPredictionChart;
