import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from "recharts";

const CustomBarChart = ({ data }) => {
    // Function to determine bar color based on index
    const getBarColor = (index) => {
        return index % 2 === 0 ? "#875cF5" : "#cfbefb";
    };
    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { category, amount, source } = payload[0].payload;
            return (
                <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-md">
                    <p className="text-xs font-semibold text-purple-800 mb-1">{category || source}</p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="font-medium text-sm font-gray-600">${amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white mt-4">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />
                    <XAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <Tooltip content={customTooltip} />
                    <Legend />
                    <Bar
                        dataKey="amount"
                        fill="#FF8042"
                        radius={[10, 10, 0, 0]}
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getBarColor(index)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart
