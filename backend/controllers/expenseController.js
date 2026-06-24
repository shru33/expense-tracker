import Expense from "../models/Expense.js";
import xlsx from "xlsx";

//Add expense
export const addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields required" });
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        await newExpense.save();
        return res.status(200).json(newExpense);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

//Get all Expenses
export const getAlExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        return res.status(200).json(expense);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

//Delete Expenses
export const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Expense deleted successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }

}

//Download Expenses
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        //Prepare data for excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        const filename = "Expense_details.xlsx";
        xlsx.writeFile(wb, filename);
        res.download(filename);

    } catch {
        return res.status(500).json({ message: "Server error" });
    }
}