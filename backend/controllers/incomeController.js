import User from "../models/User.js";
import Income from "../models/Income.js"
import { json } from "express";
import xlsx from "xlsx";

//add income source
export const addIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, source, amount, date } = req.body;
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        await newIncome.save();
        return res.status(200).json(newIncome);
    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
}

//get all income sources
export const getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (err) {
        res.status(200).json({ message: "Server Error" });
    }
}

//delete income
export const deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}
//Download income sources in excel
export const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        //Prepare data for excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        const filename = 'income_details.xlsx';
        xlsx.writeFile(wb, filename);
        res.download(filename);
    } catch (err) {
        return res.status(500).json({ message: 'Server Error' });
    }
}