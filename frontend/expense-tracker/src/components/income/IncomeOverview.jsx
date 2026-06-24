import React, { useState, useEffect } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../charts/CustomBarChart'
import { prepareIncomeBarChartData } from '../../utills/helper'


const IncomeOverview = ({ transactions, onAddIncome }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result);

        return () => { }

    }, [transactions])
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Income overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">Track your income sources and amounts over time.</p>
                </div>
                <button onClick={onAddIncome} className="add-btn">
                    <LuPlus />
                    Add Income
                </button>
            </div>
            <div className="mt-10">
                <CustomBarChart data={chartData} />
            </div>
        </div>
    )
}

export default IncomeOverview
