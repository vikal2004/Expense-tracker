// models/Budget.js
const mongoose=require('mongoose')

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  monthlyBudget: {
    type: Number,
    required: true,
  },
});
module.exports= mongoose.model("Budget", BudgetSchema);
