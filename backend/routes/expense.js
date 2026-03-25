const express = require("express");
const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Get all expenses
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    res.json({ expenses, totalExpense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add expense
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, date, description, icon } = req.body;
    if (!title || !amount || !category || !date)
      return res.status(400).json({ message: "Title, amount, category and date are required" });

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
      description: description || "",
      icon: icon || "",
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete expense
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download Excel
router.get("/download/excel", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    const data = expenses.map((item) => ({
      Title: item.title,
      Amount: item.amount,
      Category: item.category,
      Date: new Date(item.date).toLocaleDateString(),
      Description: item.description,
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
