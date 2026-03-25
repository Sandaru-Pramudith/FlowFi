const express = require("express");
const xlsx = require("xlsx");
const Income = require("../models/Income");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Get all income
router.get("/", protect, async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    res.json({ income, totalIncome });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add income
router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, date, description, icon } = req.body;
    if (!title || !amount || !category || !date)
      return res.status(400).json({ message: "Title, amount, category and date are required" });

    const income = await Income.create({
      userId: req.user._id,
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
      description: description || "",
      icon: icon || "",
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete income
router.delete("/:id", protect, async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ message: "Income not found" });
    await income.deleteOne();
    res.json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download Excel
router.get("/download/excel", protect, async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    const data = income.map((item) => ({
      Title: item.title,
      Amount: item.amount,
      Category: item.category,
      Date: new Date(item.date).toLocaleDateString(),
      Description: item.description,
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Disposition", "attachment; filename=income.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
