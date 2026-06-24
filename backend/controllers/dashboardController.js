import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import mongoose, { isValidObjectId, Types } from "mongoose";
import { response } from "express";

//Get all dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //Fetch total & expense
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        //Get income transaction in last 60days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Get total income for last 60 days
        const last60DaysIncome = last60DaysIncomeTransactions.reduce(
            (sum, transacion) => sum + transacion.amount, 0
        );

        //Get expense transactions in last 30days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Get total expense for last 30days
        const last30DaysExpense = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        //Fetch last 5 transactions
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "Income"
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "Expense"
                })
            )

        ].sort((a, b) => b.date - a.date);

        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: last30DaysExpense,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysIncome: {
                total: last60DaysIncome,
                transactions: last60DaysIncomeTransactions
            },
            recentTransactions: lastTransactions
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
}