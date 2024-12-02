// components/MoodTrendsChart.js

import React from "react";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

const MoodTrendsChart = ({ moodData }) => {
  const moodTrend = moodData.map((entry) => ({
    x: entry.date, // Date of mood tracking
    y: entry.moodScore, // Mood score (1 to 5 scale)
  }));

  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryLine
        data={moodTrend}
        style={{
          data: { stroke: "#32a852", strokeWidth: 2 },
        }}
      />
    </VictoryChart>
  );
};

export default MoodTrendsChart;
