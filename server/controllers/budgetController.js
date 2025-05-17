 const Budget =require('../models/Budget');
const Expense = require('../models/Expense');
 const setBudget=async(req,res)=>{
    const { monthlyBudget } = req.body;
      try {
        const existing = await Budget.findOne({ userId: req.user.id });
        if (existing) {
          existing.monthlyBudget = monthlyBudget;
          await existing.save();
          return res.json(existing);
        }
        const budget = await Budget.create({ userId: req.user.id, monthlyBudget });
        res.json(budget);
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
}

 const getBudget=async(req,res)=>{
    try {
        const budget = await Budget.findOne({ userId: req.user.id });
        const expenses = await Expense.find({ userId: req.user.id });
    
        const totalSpent = expenses.reduce((acc, item) => acc + item.amount, 0);
        const categorySummary = {};
    
        expenses.forEach((item) => {
          categorySummary[item.category] = (categorySummary[item.category] || 0) + item.amount;
        });
    
        res.json({
          budget: budget?.monthlyBudget || 0,
          spent: totalSpent,
          remaining: (budget?.monthlyBudget || 0) - totalSpent,
          categories: categorySummary,
        });
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
}
module.exports={setBudget, getBudget}