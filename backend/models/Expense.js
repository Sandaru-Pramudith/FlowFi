const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Shopping", "Travel", "Electricity Bill", "Loan Repayment", "Food", "Entertainment", "Healthcare", "Education", "Rent", "Utilities", "Other"],
    },
    date: { type: Date, required: true },
    description: { type: String, trim: true, default: "" },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
