import React from 'react'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomLineChart = ({ data }) => {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded-lg shadow-md border-gray-300">
                    <p className="text-xs text-purple-800 font-semibold">{payload[0].payload.category}</p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="text-sm font-medium text-gray-900">${payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="bg-white">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#875cf5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke="none" />

                    <Tooltip content={CustomTooltip} />
                    <Area type="monotone" dataKey="amount" stroke="#875cf5" fillOpacity={1} fill="url(#incomeGradient)" strokeWidth={3} dot={{ r: 3 }} />
                </AreaChart>
            </ResponsiveContainer>

        </div>
    )
}

export default CustomLineChart
