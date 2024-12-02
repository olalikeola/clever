import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryLine } from "victory-native";

export default function CycleLengthChart() {
  const [cycleData, setCycleData] = useState([]);

  useEffect(() => {
    const loadCycleData = async () => {
      const data = await AsyncStorage.getItem("cycleData");
      if (data) {
        const parsedData = JSON.parse(data);
        const formattedData = formatCycleData(parsedData);
        setCycleData(formattedData);
      }
    };

    loadCycleData();
  }, []);

  const formatCycleData = (cycleData) => {
    return Object.keys(cycleData).map((date) => ({
      date,
      cycleLength: cycleData[date].cycleLength || 28, // Default cycle length if missing
    }));
  };

  const data =
    cycleData.length > 0
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
}
