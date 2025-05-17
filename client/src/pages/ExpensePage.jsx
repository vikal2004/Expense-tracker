
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('token');

  const fetchExpenses = async () => {
    const res = await axios.get('/api/expenses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAdd = async (data) => {
    if (editing) {
      await axios.put(`/api/expenses/${editing._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post('/api/expenses', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setEditing(null);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ExpenseForm onSubmit={handleAdd} initialData={editing} />
      <ExpenseList
        expenses={expenses}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ExpensePage;
