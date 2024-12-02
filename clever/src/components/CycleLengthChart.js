import React from "react";
import { VictoryChart, VictoryLine } from "victory-native";

const CycleLengthChart = ({ cycleData }) => {
  const data =
    Array.isArray(cycleData) && cycleData.length > 0
      ? cycleData.map((cycle) => ({
          x: cycle.date, // Date of cycle start
          y: cycle.cycleLength, // Length of cycle (in days)
        }))
      : [];

  return (
    <VictoryChart domainPadding={20}>
      <VictoryLine
        data={data}
        style={{
          data: { stroke: "#ff6347", strokeWidth: 3 },
        }}
      />
    </VictoryChart>
  );
};

export default CycleLengthChart; // Ensure default export here
