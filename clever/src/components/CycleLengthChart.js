import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory";

const CycleLengthChart = () => {
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
      cycleLength: cycleData[date].cycleLength || 28,
    }));
  };

  const data =
    cycleData.length > 0
      ? cycleData.map((cycle) => ({
          x: new Date(cycle.date).toISOString().split("T")[0],
          y: cycle.cycleLength,
        }))
      : [];

  return (
    <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
      <VictoryAxis />
      <VictoryAxis dependentAxis />
      <VictoryLine
        data={data}
        style={{ data: { stroke: "#ff6347", strokeWidth: 3 } }}
      />
      <VictoryScatter data={data} style={{ data: { fill: "#ff6347" } }} />
    </VictoryChart>
  );
};

export default CycleLengthChart;
