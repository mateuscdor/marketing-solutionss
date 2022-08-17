import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export type DashboardChartProps = {
  data: any[];
  valueKeys: string[];
};
const DashboardChart = ({ data, valueKeys }: DashboardChartProps) => {
  console.log({
    data,
    valueKeys,
  });
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      {valueKeys.map((key) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      ))}
    </LineChart>
  );
};

export default DashboardChart;
