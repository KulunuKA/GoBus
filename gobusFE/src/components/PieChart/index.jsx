import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const PieCharts = ({ data, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PieCharts;
