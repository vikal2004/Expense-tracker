const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
  getReport,
} = require('../controllers/expenseController');


router.post('/', auth, addExpense);
router.get('/', auth, getExpenses);
router.put('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);
router.get("/summary", auth, getSummary);
router.get("/report", auth, getReport);
//splitexpense

module.exports = router;
