import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

import ChartHeader from "../../dashboard/LiveChart/ChartHeader";
import MetricTabs from "../../dashboard/LiveChart/MetricTabs";
import ChartStatistics from "../../dashboard/LiveChart/ChartStatistics";
import EngineeringTooltip from "../../dashboard/LiveChart/EngineeringTooltip";

const metricColors = {
  voltage: "#39E5C4",
  current: "#F59E0B",
  power: "#FB923C",
  capacity: "#4ADE80",
  energy: "#38BDF8",
};

export default function BatteryChart({ data = [] }) {
  const [selectedMetric, setSelectedMetric] = useState("voltage");


  const latestValue =
    data.length > 0 ? data[data.length - 1][selectedMetric] : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-[#2B313C] bg-[#181C24] shadow-lg">

      <ChartHeader />

      <MetricTabs
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />

      <ChartStatistics
        data={data}
        metric={selectedMetric}
      />

      <div className="h-[500px] p-4">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 20,
            }}
          >

            <CartesianGrid
              stroke="#2B313C"
              strokeDasharray="4 4"
              vertical
              horizontal
            />

            <XAxis
              dataKey="timestamp"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin", "dataMax"]}
            />

            <Tooltip
              content={<EngineeringTooltip />}
            />

            <Line
  type="monotone"
  dataKey={selectedMetric}
  stroke={metricColors[selectedMetric]}
  strokeWidth={2.8}
  dot={false}
  activeDot={{ r: 5 }}
  animationDuration={350}
/>    

            <ReferenceLine
              y={latestValue}
              stroke="#64748B"
              strokeDasharray="5 5"
            />


          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}