import mongoose, { model } from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    category: { type: String, required: true }, //Example food, cloth, etc
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }

}, { timestamp: true });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;