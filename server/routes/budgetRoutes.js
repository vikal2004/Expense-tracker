

const express=require("express");
const Budget=require("../models/Budget.js");
const Expense=require("../models/Expense.js");
const auth=require("../middleware/authMiddleware.js")
const {setBudget, getBudget}=require("../controllers/budgetController.js")
const router = express.Router();

// Set/Update Monthly Budget
router.post("/", auth, setBudget);

// Get Budget + Expense Summary
router.get("/", auth,getBudget);

module.exports=router;
