import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartHeader from "./ChartHeader";
import MetricTabs from "./MetricTabs";
import ChartStatistics from "./ChartStatistics";
import EngineeringTooltip from "./EngineeringTooltip";

const colors = {
  voltage: "#39E5C4",
  current: "#F59E0B",
  power: "#FB923C",
  capacity: "#4ADE80",
  energy: "#38BDF8",
};

export default function LiveChart({ data }) {
  const [selectedMetric, setSelectedMetric] = useState("voltage");

  return (
    <div className="overflow-hidden rounded-xl border border-[#2B313C] bg-[#181C24]">
      <ChartHeader />

      <MetricTabs
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />
      
      <ChartHeader />

<MetricTabs
  selectedMetric={selectedMetric}
  setSelectedMetric={setSelectedMetric}
/>

<ChartStatistics
  data={data}
  selectedMetric={selectedMetric}
/>

<div className="h-[380px] p-4"></div>

      <div className="h-[380px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
  data={data}
  margin={{
    top: 15,
    right: 20,
    left: 10,
    bottom: 10,
  }}
>
            <CartesianGrid
  stroke="#2B313C"
  strokeDasharray="4 4"
  vertical={false}
/>

            <XAxis
              dataKey="timestamp"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
            />

            <YAxis
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              domain={["dataMin", "dataMax"]}
            />

            <Tooltip content={<EngineeringTooltip />} />

            <Line
  type="monotone"
  dataKey={selectedMetric}
  stroke={colors[selectedMetric]}
  strokeWidth={3}
  dot={false}
  activeDot={{
    r: 5,
    strokeWidth: 2,
    fill: "#ffffff",
  }}
  animationDuration={600}
  isAnimationActive
/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}