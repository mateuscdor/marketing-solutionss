import { ClockIcon } from "@heroicons/react/outline";
import { isEmpty } from "lodash";
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
  if (isEmpty(data)) {
    return (
      <div className="flex flex-col w-full h-full text-center justify-center items-center border-dashed border-2 rounded-md py-4 px-6">
        <ClockIcon className="w-10 h-10 text-gray-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data</h3>
        <p className="mt-1 text-sm text-gray-500">No data to show yet...</p>
      </div>
    );
  }
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
