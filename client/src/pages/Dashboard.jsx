import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import Charts from "../components/Charts";
import Form from "../components/Form";
import Report from "../components/Report";

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const [editId, setEditId] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };
  const [summary, setSummary] = useState({
    totalSpent: 0,
    categoryTotals: {},
    monthlyTotals: {},
  });

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/expenses/summary",
        { headers }
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const [budgetData, setBudgetData] = useState({
    budget: 0,
    spent: 0,
    remaining: 0,
    categories: {},
  });

  const fetchBudget = async () => {
    const res = await axios.get("http://localhost:5000/api/budget", {
      headers,
    });
    setBudgetData(res.data);
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  // Fetch Expenses
  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses", {
      headers,
    });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add or Edit Expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(
        `http://localhost:5000/api/expenses/${editId}`,
        formData,
        { headers }
      );
    } else {
      await axios.post("http://localhost:5000/api/expenses", formData, {
        headers,
      });
    }
    setFormData({ title: "", amount: "", category: "", date: "" });
    setEditId(null);
    fetchExpenses();
    fetchSummary();
    fetchBudget();
  };

  // Edit button click
  const handleEdit = (expense) => {
    setFormData(expense);
    setEditId(expense._id);
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, { headers });
    fetchExpenses();
    fetchBudget();
    fetchSummary();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">💸 Expense Tracker</h1>
      <Report />
      <Charts summary={summary} />

      <div className="mb-8 bg-gray-50 border rounded-xl p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">📊 Budget Overview</h2>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Monthly Budget</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{budgetData.budget}
            </p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Spent</p>
            <p className="text-2xl font-bold text-red-500">
              ₹{budgetData.spent}
            </p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-2xl font-bold text-blue-500">
              ₹{budgetData.remaining}
            </p>
          </div>
        </div>

        {/* Update Budget */}
        <div className="mt-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const newBudget = e.target.budget.value;
              await axios.post(
                "http://localhost:5000/api/budget",
                { monthlyBudget: newBudget },
                { headers }
              );
              fetchBudget();
              e.target.reset();
            }}
            className="flex gap-2"
          >
            <input
              type="number"
              name="budget"
              placeholder="Set Monthly Budget"
              className="border rounded px-3 py-2 w-60"
              required
            />
            <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
              Save
            </button>
          </form>
        </div>

        {/* Category Summary */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">💡 Category-wise Spending</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(budgetData.categories).map(([cat, amt]) => (
              <div key={cat} className="bg-white p-3 rounded shadow text-sm">
                <p className="text-gray-600">{cat}</p>
                <p className="font-bold text-indigo-600">₹{amt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <Form handleSubmit={handleSubmit} formData={formData} setFormData={setFormData} editId={editId} />

      {/* Expenses List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="p-4">Title</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id} className="border-t text-sm">
                <td className="p-4">{exp.title}</td>
                <td className="p-4">₹{exp.amount}</td>
                <td className="p-4">{exp.category}</td>
                <td className="p-4">{moment(exp.date).format("YYYY-MM-DD")}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
