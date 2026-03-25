const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Salary", "Freelancing", "Investments", "E-commerce Sales", "Interest from Savings", "Graphic Design", "Affiliate Marketing", "Stocks", "Rental Income", "Other"],
    },
    date: { type: Date, required: true },
    description: { type: String, trim: true, default: "" },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
