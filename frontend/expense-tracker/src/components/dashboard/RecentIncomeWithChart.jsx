import React, { useState, useEffect } from 'react'
import CustomPieChart from '../charts/CustomPieChart'

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    const [chartData, setChartData] = useState([]);
    const COLORS = ["#875CF5", "#FA2C37", "#FFC900", "#4F39F6"];
    const prepareChartData = () => {
        const dataArr = data.map((item) => ({
            name: item?.source,
            amount: item?.amount
        }));
        setChartData(dataArr);
    };
    useEffect(() => {
        prepareChartData();
        return () => { }
    }, [data]);
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 60 days income</h5>
            </div>
            <CustomPieChart
                data={chartData}
                label="Total income"
                totalAmount={`$${totalIncome}`}
                showTextAnchor
                colors={COLORS}
            />
        </div>
    )
}

export default RecentIncomeWithChart
