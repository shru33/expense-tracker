import React, { useState } from 'react'
import Input from '../inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: '',
        amount: '',
        date: '',
        icon: ''
    });

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />
            <Input
                value={income.source}
                onChange={(e) => handleChange('source', e.target.value)}
                label="Income Source"
                placeholder="Freelance, Salary, etc"
                type="text"
            />
            <Input
                value={income.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                label="Amount"
                placeholder="0.00"
                type="number"
            />
            <Input
                value={income.date}
                onChange={(e) => handleChange('date', e.target.value)}
                label="Date"
                placeholder="Select date"
                type="date"
            />
            <div className="flex justify-end mt-6">
                <button
                    className="add-btn add-btn-fill"
                    type="button"
                    onClick={() => onAddIncome(income)}
                >
                    Add Income
                </button>

            </div>
        </div>
    )
}

export default AddIncomeForm
