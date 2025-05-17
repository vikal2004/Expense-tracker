const Expense = require('../models/Expense');
const PDFDocument=require("pdfkit")

// Add expense
exports.addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const newExpense = new Expense({
      title,
      amount,
      category,
      date,
      userId: req.user._id,
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: 'Error creating expense' });
  }
};

// Get all expenses for user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: 'Error updating expense' });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
     
    const expenses = await Expense.find({ userId });
    
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
   
    const categoryTotals = {};
    const monthlyTotals = {};

    expenses.forEach((expense) => {
      // Category totals
      const category = expense.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;

      // Monthly totals
      const month = new Date(expense.date).toLocaleString("default", { month: "short", year: "numeric" });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
    });

    res.status(200).json({
      totalSpent,
      categoryTotals,
      monthlyTotals,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching summary" });
  }
};

exports.getReport=async(req, res)=>{
  try {
    const userId=req.user.id;

    const expenses = await Expense.find({ userId });

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=expense-report.pdf");

     doc.pipe(res);

     // Add content
    doc.fontSize(20).text("Expense Report", { align: "center" });
    doc.moveDown();

    expenses.forEach((exp, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${exp.title} | ₹${exp.amount} | ${exp.category} | ${new Date(exp.date).toDateString()}`
      );
    });

    doc.end();
  } catch (error) {
    console.error("Error generating report:", err);
    res.status(500).send("Server error");
  }
}


